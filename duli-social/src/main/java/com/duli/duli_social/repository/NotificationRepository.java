package com.duli.duli_social.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.duli.duli_social.models.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
}