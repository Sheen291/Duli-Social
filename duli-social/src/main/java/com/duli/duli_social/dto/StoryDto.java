package com.duli.duli_social.dto;

import java.time.LocalDateTime;

public class StoryDto {
    private Long id;
    private UserDto user;
    private String image;
    private String caption;
    private LocalDateTime createdAt;

    public StoryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}