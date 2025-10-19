package com.duli.duli_social.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duli.duli_social.config.JwtProvider;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.UserRepository;
import com.duli.duli_social.service.UserService;

@RestController
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;


    @GetMapping("/api/users")
    public List<User> getUsers() {
        
        List<User> users=userRepository.findAll();
        
        return users;
    }

    @GetMapping("/api/users/{userId}")
    public User getUserById(@PathVariable("userId")Integer id) throws Exception {

        User user=userService.findUserById(id);
        return user; 
    }

    @PutMapping("/api/users")
    public User updateUser(@RequestHeader("Authorization")String jwt, @RequestBody User user) throws Exception {
        
        User findUser =  userService.findUserByToken(jwt);
        User updatedUser = userService.updateUser(user, findUser.getId());
        return updatedUser;
    }
    
    @PutMapping("/api/users/follow/{acceptUserId}")
    public User followUser(@RequestHeader("Authorization")String jwt, @PathVariable Integer acceptUserId) throws Exception {

        User requestUser = userService.findUserByToken(jwt);

        User acceptUser=userService.followUser(requestUser.getId(), acceptUserId);
        return acceptUser;
    }

    @GetMapping("/api/users/search")
    public List<User> searchUser(@RequestParam("query") String query) {
        
        List<User> users=userService.searchUser(query);
        return users;
    }

    @GetMapping("/api/users/profile")
    public User getUserByToken(@RequestHeader("Authorization")String jwt) {
        
        User user = userService.findUserByToken(jwt);
        user.setPassword(null); //che password
        
        return user;
    }
}
