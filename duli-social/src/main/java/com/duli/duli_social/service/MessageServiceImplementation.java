package com.duli.duli_social.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duli.duli_social.models.Chat;
import com.duli.duli_social.models.Message;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.ChatRepository;
import com.duli.duli_social.repository.MessageRepository;
import com.duli.duli_social.request.CreateMessageRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class MessageServiceImplementation implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatService chatService;

    @Autowired
    private ChatRepository chatRepository;

    @Override
    @Transactional
    public Message createMessage(User user, Long chatId, CreateMessageRequest req) throws Exception {
        
        Chat chat = chatService.findChatById(chatId);

        Message message = new Message();
        message.setChat(chat);
        message.setUser(user);
        message.setContent(req.getContent());
        message.setImage(req.getImage());
        message.setVideo(req.getVideo());
        message.setCreatedAt(LocalDateTime.now());

        Message savedMessage = messageRepository.save(message);

        chat.getMessages().add(savedMessage);
        chatRepository.save(chat); 

        return savedMessage;
    }

    @Override
    public List<Message> findChatsMessages(Long chatId, Integer page, Integer size) throws Exception {
        
        Chat chat = chatService.findChatById(chatId);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Message> messages = messageRepository.findByChatId(chatId, pageable);

        return messages.getContent();
    }

    @Override
    public Message findMessageById(Long messageId) throws Exception {
        Optional<Message> opt = messageRepository.findById(messageId);
        
        if(opt.isPresent()) {
            return opt.get();
        }
        throw new Exception("Message not found with id " + messageId);
    }

    @Override
    public void deleteMessage(Long messageId, User reqUser) throws Exception {
        Message message = findMessageById(messageId);
        
        if(message.getUser().getId().equals(reqUser.getId())) {
            messageRepository.delete(message);
        } else {
            throw new Exception("You can't delete another user's message");
        }
    }

    @Override
    public List<Message> markChatAsRead(Long chatId, User reqUser) throws Exception {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new Exception("Chat not found"));
        
        List<Message> updatedMessages = new ArrayList<>();

        for (Message msg : chat.getMessages()) {
            if (!msg.getUser().getId().equals(reqUser.getId()) && !msg.isRead()) {
                msg.setRead(true);
                updatedMessages.add(messageRepository.save(msg));
            }
        }
        return updatedMessages;
    }
}