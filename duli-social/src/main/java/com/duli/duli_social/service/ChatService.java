package com.duli.duli_social.service;

import java.util.List;
import com.duli.duli_social.models.Chat;
import com.duli.duli_social.models.User;

public interface ChatService {
    
    public Chat createChat(User reqUser, User user2);

    public Chat findChatById(Long chatId) throws Exception;

    public List<Chat> findAllChatByUserId(Long userId);
}