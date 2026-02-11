package com.duli.duli_social.service;

import java.util.List;

import com.duli.duli_social.dto.NotificationDto;
import com.duli.duli_social.models.NotificationType;
import com.duli.duli_social.models.User;

public interface NotificationService {
    public void createNotification(User recipient, User actor, NotificationType type, String message, Long relatedId);
    public List<NotificationDto> findUsersNotification(Long userId);
    public void deleteNotification(User recipient, User actor, NotificationType type, Long relatedId);
}
