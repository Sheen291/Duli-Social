package com.duli.duli_social.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.duli.duli_social.dto.UserDto;
import com.duli.duli_social.models.Post;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.UserRepository;
import com.duli.duli_social.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @GetMapping("/api/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/api/users/{userId}")
    public User getUserById(@PathVariable("userId") Long id) throws Exception {
        return userService.findUserById(id);
    }

    @PutMapping("/api/users")
    public User updateUser(@RequestHeader("Authorization") String jwt, @RequestBody User user) throws Exception {
        User findUser = userService.findUserByJwt(jwt);
        return userService.updateUser(user, findUser.getId());
    }
    
    @PutMapping("/api/users/follow/{acceptUserId}")
    public User followUser(@RequestHeader("Authorization") String jwt, @PathVariable Long acceptUserId) throws Exception {
        User requestUser = userService.findUserByJwt(jwt);
        return userService.followUser(requestUser.getId(), acceptUserId);
    }

    @GetMapping("/api/users/search")
    public List<UserDto> searchUser(@RequestParam("query") String query) {
        return userService.searchUser(query);
    }

    @GetMapping("/api/users/profile")
    public UserDto getUserByToken(@RequestHeader("Authorization") String jwt) {
        return userService.findUserDtoByJwt(jwt);
    }

    @GetMapping("/api/users/saved-posts")
    public ResponseEntity<List<Post>> getUserSavedPosts(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserByJwt(jwt);
        
        List<Post> savedPosts = user.getSavedPost(); 
        
        return new ResponseEntity<>(savedPosts, HttpStatus.OK);
    }
}