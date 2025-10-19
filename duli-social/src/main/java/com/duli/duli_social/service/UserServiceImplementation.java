package com.duli.duli_social.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.duli.duli_social.config.JwtProvider;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.UserRepository;

@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    UserRepository userRepository;

    @Override
    public User registerUser(User user) {
        User newUser=new User();
        newUser.setEmail(user.getEmail());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPassword(user.getPassword());
        newUser.setId(user.getId());

        User savedUser=userRepository.save(newUser);

        return savedUser;
    }

    @Override
    public User findUserById(Integer userId) throws Exception {

        Optional<User> user=userRepository.findById(userId);
        
        if(user.isPresent()) {
            return user.get();
        }

        throw new Exception("user not exist with userid" + userId);
    }

    @Override
    public User findUserByEmail(String email) {
        
        User user=userRepository.findByEmail(email);
        return user;
    }

    @Override
    public User followUser(Integer requestUserId, Integer acceptUserId) throws Exception {

        User requestUser = findUserById(requestUserId);

        User acceptUser = findUserById(acceptUserId);

        if (acceptUser.getFollowers().contains(requestUser.getId())) {
            acceptUser.getFollowers().remove((Integer) requestUser.getId());
            requestUser.getFollowings().remove((Integer) acceptUser.getId());
            System.out.println("User unfollowed.");
        } else {
            acceptUser.getFollowers().add(requestUser.getId());
            requestUser.getFollowings().add(acceptUser.getId());
            System.out.println("User followed.");
        }

        userRepository.save(requestUser);
        userRepository.save(acceptUser);

        return requestUser;
    }

    @Override
    public User updateUser(User user, Integer userId) throws Exception {
        
        Optional<User> user1 = userRepository.findById(userId);

        if(user1.isEmpty()) {
            throw new Exception("user not exist with id" + userId);
        }

        User oldUser=user1.get();

        if(user.getFirstName()!=null) {
            oldUser.setFirstName(user.getFirstName());
        }
        if(user.getLastName()!=null) {
            oldUser.setLastName(user.getLastName());
        }
        if(user.getEmail()!=null) {
            oldUser.setEmail(user.getEmail());
        }
        if(user.getPassword()!=null) {
            oldUser.setPassword(user.getPassword());
        }
        if(user.getGender()!=null) {
            oldUser.setGender(user.getGender());
        }
        
        User updatedUser=userRepository.save(oldUser);
        
        return updatedUser;
    }

    @Override
    public List<User> searchUser(String query) {
        
        return userRepository.searchUser(query);
    }

    @Override
    public User findUserByToken(String jwt) {
        
        String email = JwtProvider.getEmailFromJwtToken(jwt);
        User user = userRepository.findByEmail(email);

        return user;
    }
    
}
