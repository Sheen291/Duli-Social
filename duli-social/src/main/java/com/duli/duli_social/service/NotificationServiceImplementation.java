package com.duli.duli_social.service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.duli.duli_social.dto.NotificationDto;
import com.duli.duli_social.dto.UserDto;
import com.duli.duli_social.models.Notification;
import com.duli.duli_social.models.NotificationType;
import com.duli.duli_social.models.Post;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.NotificationRepository;
import com.duli.duli_social.repository.PostRepository;

@Service
public class NotificationServiceImplementation implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private PostRepository postRepository;

    @Override
    public void createNotification(User recipient, User actor, NotificationType type, String message, Long relatedId) {
        if(recipient.getId().equals(actor.getId())) return;

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setActor(actor);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRelatedId(relatedId);
        notification.setRead(false);

        Notification savedNotification = notificationRepository.save(notification);

        NotificationDto notificationDto = mapToDto(savedNotification);

        simpMessagingTemplate.convertAndSendToUser(
                String.valueOf(recipient.getId()),
                "/private-notification",          
                notificationDto                 
        );
    }

    @Override
    public List<NotificationDto> findUsersNotification(Long userId) {
        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        return notifications.stream().map(this::mapToDto).collect(Collectors.toList());
    }
    
    private NotificationDto mapToDto(Notification noti) {
        NotificationDto dto = new NotificationDto();
        dto.setId(noti.getId());
        dto.setMessage(noti.getMessage());
        dto.setType(noti.getType());
        dto.setRead(noti.isRead());
        dto.setCreatedAt(noti.getCreatedAt());
        dto.setRelatedId(noti.getRelatedId());
        
        UserDto actorDto = new UserDto();
        actorDto.setId(noti.getActor().getId());
        actorDto.setFirstName(noti.getActor().getFirstName());
        actorDto.setLastName(noti.getActor().getLastName());
        actorDto.setImage(noti.getActor().getImage());
        dto.setActor(actorDto);

        if (noti.getType() == NotificationType.LIKE_POST || noti.getType() == NotificationType.COMMENT_POST) {
            if (noti.getRelatedId() != null) {
                Optional<Post> post = postRepository.findById(noti.getRelatedId());
                if (post.isPresent()) {
                    dto.setPreviewImage(post.get().getImage());
                }
            }
        }
        
        return dto;
    }
}