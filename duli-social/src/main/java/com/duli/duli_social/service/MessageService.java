package com.duli.duli_social.service;

import java.util.List;
import com.duli.duli_social.models.Message;
import com.duli.duli_social.models.User;
import com.duli.duli_social.request.CreateMessageRequest;

public interface MessageService {
    public Message createMessage(User user, Long chatId, CreateMessageRequest req) throws Exception;
    
    public List<Message> findChatsMessages(Long chatId, Integer page, Integer size) throws Exception;
    public Message findMessageById(Long messageId) throws Exception;
    public void deleteMessage(Long messageId, User reqUser) throws Exception;
    public List<Message> markChatAsRead(Long chatId, User reqUser) throws Exception;
}