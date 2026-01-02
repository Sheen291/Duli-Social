package com.duli.duli_social.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.duli.duli_social.models.Chat;
import com.duli.duli_social.models.User;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    
    @Query(value = "SELECT c.* FROM chats c " +
                   "JOIN chat_users cu ON c.id = cu.chat_id " +
                   "WHERE cu.user_id = :userId " +
                   "ORDER BY c.created_at DESC", 
           nativeQuery = true)
    public List<Chat> findChatsByUserId(@Param("userId") Long userId);

    @Query("select c from Chat c where :user MEMBER OF c.users AND :reqUser MEMBER OF c.users")
    public Chat findChatByUsers(@Param("user") User user, @Param("reqUser") User reqUser);
}