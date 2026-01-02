package com.duli.duli_social.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller; // Thêm cái này

import com.duli.duli_social.models.Message;

@Controller
public class RealtimeChatController {
    
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat/{groupId}")
    public Message sendMessageToGroup(@Payload Message message, @DestinationVariable String groupId) {
        
        simpMessagingTemplate.convertAndSend("/group/" + groupId, message);
        
        return message;
    }
}