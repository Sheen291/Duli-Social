package com.duli.duli_social.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.duli.duli_social.config.JwtProvider;
import com.duli.duli_social.dto.UserDto;
import com.duli.duli_social.models.NotificationType;
import com.duli.duli_social.models.Post;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;
import com.duli.duli_social.dto.GoogleUserInfo;
import com.duli.duli_social.response.AuthResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    UserRepository userRepository;

    @Value("${google.client.id}")
    private String googleClientId;

    @Value("${google.client.secret}")
    private String googleClientSecret;

    @Value("${google.redirect.uri}")
    private String googleRedirectUri;

    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User registerUser(User user) {
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPassword(user.getPassword());
        newUser.setGender(user.getGender());
        
        return userRepository.save(newUser);
    }

    @Override
    public User findUserById(Long userId) throws Exception {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return user.get();
        }
        throw new Exception("User not exist with userid " + userId);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public User followUser(Long reqUserId, Long acceptUserId) throws Exception {
        User reqUser = findUserById(reqUserId);       
        User acceptUser = findUserById(acceptUserId); 

        if (reqUser.getFollowings().contains(acceptUser) || acceptUser.getFollowers().contains(reqUser)) {
            reqUser.getFollowings().remove(acceptUser);
            acceptUser.getFollowers().remove(reqUser);
            
            
        } else {
            reqUser.getFollowings().add(acceptUser);
            acceptUser.getFollowers().add(reqUser);
            
            notificationService.createNotification(
                acceptUser,                  
                reqUser,                      
                NotificationType.FOLLOW_USER, 
                "started following you.",     
                reqUser.getId()               
            );
        }

        userRepository.save(reqUser);
        userRepository.save(acceptUser);

        return reqUser;
    }

    @Override
    public User updateUser(User user, Long userId) throws Exception {
        System.out.println("DEBUG UPDATE: Bio received = " + user.getBio());
        
        Optional<User> user1 = userRepository.findById(userId);
        if (user1.isEmpty()) {
            throw new Exception("User not exist with id " + userId);
        }
        User oldUser = user1.get();

        if (user.getFirstName() != null) oldUser.setFirstName(user.getFirstName());
        if (user.getLastName() != null) oldUser.setLastName(user.getLastName());
        if (user.getGender() != null) oldUser.setGender(user.getGender());
        if (user.getImage() != null) oldUser.setImage(user.getImage());
        if (user.getBio() != null) {
            oldUser.setBio(user.getBio());
        }

        return userRepository.save(oldUser);
    }

    @Override
    public List<UserDto> searchUser(String query) {
        List<User> users = userRepository.searchUser(query);
        
        return users.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public User findUserByJwt(String jwt) {
        String email = JwtProvider.getEmailFromJwtToken(jwt);
        return userRepository.findByEmail(email).orElse(null);
    }
    
    @Override
    public UserDto findUserDtoByJwt(String jwt) {
        User user = findUserByJwt(jwt);
        if(user == null) return null;
        return mapToDto(user);
    }

    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setGender(user.getGender());
        dto.setImage(user.getImage());

        dto.setBio(user.getBio());
        
        dto.setFollowers(user.getFollowers().stream()
                .map(this::mapToBasicDto) 
                .collect(Collectors.toList()));
                
        dto.setFollowings(user.getFollowings().stream()
                .map(this::mapToBasicDto) 
                .collect(Collectors.toList()));
        if (user.getSavedPost() != null) {
             dto.setSavedPostIds(user.getSavedPost().stream().map(Post::getId).collect(Collectors.toList()));
        }
        return dto;
    }

    private UserDto mapToBasicDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setImage(user.getImage());
        return dto;
    }

    @Override
    public AuthResponse loginWithGoogle(String code) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String tokenUrl = "https://oauth2.googleapis.com/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String requestBody = "code=" + code +
                "&client_id=" + googleClientId +
                "&client_secret=" + googleClientSecret +
                "&redirect_uri=" + googleRedirectUri +
                "&grant_type=authorization_code";

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        
        ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, request, String.class);
        
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(response.getBody());
        String accessToken = rootNode.path("access_token").asText();

        String userInfoUrl = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + accessToken;
        GoogleUserInfo googleUser = restTemplate.getForObject(userInfoUrl, GoogleUserInfo.class);

        if (googleUser == null || googleUser.getEmail() == null) {
            throw new Exception("Failed to get user info from Google");
        }

        User user = userRepository.findByEmail(googleUser.getEmail()).orElse(null);

        if (user == null) {
            user = new User();
            user.setEmail(googleUser.getEmail());
            user.setFirstName(googleUser.getGivenName());
            user.setLastName(googleUser.getFamilyName());
            user.setGoogleId(googleUser.getId());
            user.setImage(googleUser.getPicture());
            user.setGender("unknown"); 
            
            user.setPassword(passwordEncoder.encode("GOOGLE_AUTH_" + googleUser.getId())); 

            user = userRepository.save(user);
        } else {
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleUser.getId());
            }
            if (user.getImage() == null) {
                user.setImage(googleUser.getPicture());
            }
            userRepository.save(user);
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), null, new ArrayList<>());        
        String jwt = JwtProvider.generateToken(authentication);

        return new AuthResponse(jwt, "Login with Google successfully");    }
}