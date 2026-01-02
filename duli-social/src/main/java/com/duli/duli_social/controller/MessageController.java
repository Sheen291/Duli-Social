package com.duli.duli_social.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.duli.duli_social.models.Message;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.MessageRepository;
import com.duli.duli_social.request.CreateMessageRequest;
import com.duli.duli_social.service.MessageService;
import com.duli.duli_social.service.UserService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/chat/{chatId}")
    public Message createMessage(@RequestBody CreateMessageRequest req, 
                                 @RequestHeader("Authorization") String jwt) throws Exception {
        
        User user = userService.findUserByJwt(jwt);
        
        Message savedMessage = messageService.createMessage(user, req.getChatId(), req);
        
        simpMessagingTemplate.convertAndSend("/group/" + req.getChatId(), savedMessage);
        
        return savedMessage;
    }

    @GetMapping("/chat/{chatId}")
    public List<Message> findMessagesOfChat(
            @RequestHeader("Authorization") String jwt, 
            @PathVariable Long chatId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size
    ) throws Exception {
        
        User user = userService.findUserByJwt(jwt); 
        
        return messageService.findChatsMessages(chatId, page, size);
    }

    @PutMapping("/{chatId}/read")
    public ResponseEntity<List<Message>> markMessagesAsRead(
            @PathVariable Long chatId, 
            @RequestHeader("Authorization") String jwt) throws Exception {
        
        User user = userService.findUserByJwt(jwt);
        
        // set isRead = true
        List<Message> messages = messageService.markChatAsRead(chatId, user);
        
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }
}