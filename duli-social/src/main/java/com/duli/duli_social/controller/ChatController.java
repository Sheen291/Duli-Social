package com.duli.duli_social.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.duli.duli_social.models.Chat;
import com.duli.duli_social.models.User;
import com.duli.duli_social.request.CreateChatRequest;
import com.duli.duli_social.service.ChatService;
import com.duli.duli_social.service.UserService;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;

    @PostMapping
    public Chat createChat(@RequestHeader("Authorization") String jwt, @RequestBody CreateChatRequest req) throws Exception {
        User reqUser = userService.findUserByJwt(jwt);
        User resUser = userService.findUserById(req.getUserId());
        return chatService.createChat(reqUser, resUser);
    }

    @GetMapping
    public List<Chat> findUserChats(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserByJwt(jwt);
        
        System.out.println("DEBUG: User ID from Token: " + user.getId()); 

        return chatService.findAllChatByUserId(user.getId());
    }
}