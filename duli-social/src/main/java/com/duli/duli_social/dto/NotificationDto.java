package com.duli.duli_social.dto;

import java.time.LocalDateTime;
import com.duli.duli_social.models.NotificationType;

public class NotificationDto {
    private Long id;
    private String message;
    private NotificationType type;
    private boolean read;
    private LocalDateTime createdAt;
    
    private UserDto actor;
    private Long relatedId;
    
    private String previewImage; 

    public NotificationDto() {
    }    

    public NotificationDto(Long id, String message, NotificationType type, boolean read, LocalDateTime createdAt,
            UserDto actor, Long relatedId, String previewImage) {
        this.id = id;
        this.message = message;
        this.type = type;
        this.read = read;
        this.createdAt = createdAt;
        this.actor = actor;
        this.relatedId = relatedId;
        this.previewImage = previewImage;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public UserDto getActor() { return actor; }
    public void setActor(UserDto actor) { this.actor = actor; }

    public Long getRelatedId() { return relatedId; }
    public void setRelatedId(Long relatedId) { this.relatedId = relatedId; }
    
    public String getPreviewImage() {
        return previewImage;
    }

    public void setPreviewImage(String previewImage) {
        this.previewImage = previewImage;
    }
}