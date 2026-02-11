package com.duli.duli_social.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.duli.duli_social.models.Notification;
import com.duli.duli_social.models.NotificationType;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    Notification findByRecipientIdAndActorIdAndTypeAndRelatedId(Long recipientId, Long actorId, NotificationType type, Long relatedId);
}