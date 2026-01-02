package com.duli.duli_social.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.duli.duli_social.models.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MessageRepository extends JpaRepository<Message, Long> {
    
    public Page<Message> findByChatId(Long chatId, Pageable pageable);
}