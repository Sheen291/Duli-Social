package com.duli.duli_social.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.duli.duli_social.models.Chat;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.ChatRepository;

@Service
public class ChatServiceImplementation implements ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Override
    public Chat createChat(User reqUser, User user2) {
        // Kiểm tra xem đã có đoạn chat giữa 2 người này chưa
        Chat isExist = chatRepository.findChatByUsers(reqUser, user2);

        if (isExist != null) {
            return isExist;
        }
        
        // Nếu chưa thì tạo mới
        Chat chat = new Chat();
        chat.getUsers().add(user2);
        chat.getUsers().add(reqUser);
        // timestamp được BaseEntity lo, nhưng nếu muốn update thủ công time tin nhắn cuối thì set cũng được
        chat.setCreatedAt(LocalDateTime.now()); 

        return chatRepository.save(chat);
    }

    @Override
    public Chat findChatById(Long chatId) throws Exception {
        Optional<Chat> chat = chatRepository.findById(chatId);

        if (chat.isEmpty()) {
            throw new Exception("Chat not exist with id: " + chatId);
        }
        return chat.get();
    }

    @Override
    public List<Chat> findAllChatByUserId(Long userId) {
        return chatRepository.findChatsByUserId(userId);
    }
}