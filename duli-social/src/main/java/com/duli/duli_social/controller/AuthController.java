package com.duli.duli_social.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.duli.duli_social.config.JwtProvider;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.UserRepository;
import com.duli.duli_social.response.AuthResponse;

@RestController
@RequestMapping("/auth")    // /auth/...
public class AuthController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

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

        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), savedUser.getPassword());

        String token = JwtProvider.generateToken(authentication);

        AuthResponse res = new AuthResponse(token, "Register successfully");

        return res;
    }

}
