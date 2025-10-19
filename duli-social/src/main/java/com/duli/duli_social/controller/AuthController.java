package com.duli.duli_social.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import com.duli.duli_social.config.JwtProvider;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.UserRepository;
import com.duli.duli_social.request.LoginRequest;
import com.duli.duli_social.response.AuthResponse;
import com.duli.duli_social.service.CustomerUserDetailsService;

@RestController
@RequestMapping("/auth")    // /auth/...
public class AuthController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    @PostMapping("/signup")
    public AuthResponse createUser(@RequestBody User user) throws Exception {
        
        User isExist = userRepository.findByEmail(user.getEmail());

        if (isExist!=null) {
            throw new Exception("this email already used by another user");
        }

        User newUser = new User();

        newUser.setEmail(user.getEmail());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(newUser);

        //phần này gọi ra để tạo token từ email với password được cung cấp
        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), savedUser.getPassword());

        String token = JwtProvider.generateToken(authentication);

        AuthResponse res = new AuthResponse(token, "Register successfully");

        return res;
    }

    @PostMapping("/signin")
    public AuthResponse logIn(@RequestBody LoginRequest loginRequest) throws Exception {
        
        //cái này lấy username với password đã mã hóa lưu trong db nên lúc so sánh cần encoder ra
        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(loginRequest.getEmail());

        if (userDetails == null) {
            throw new BadCredentialsException("invalid username");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), userDetails.getPassword())) {
            throw new BadCredentialsException("incorrect password");
        }

        //tương tự với đăng ký, check thông tin xong thì cho qua
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String token = JwtProvider.generateToken(authentication);

        AuthResponse res = new AuthResponse(token, "Login successfully");


        return res;
    }
}
