package com.duli.duli_social.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CommentDto {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    
    private UserDto user;
    
    private List<Long> likedUserIds = new ArrayList<>();
    
    private Long postId;
    private Long shortVideoId;

    public CommentDto() {
    }

    // --- GETTER & SETTER ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public List<Long> getLikedUserIds() { return likedUserIds; }
    public void setLikedUserIds(List<Long> likedUserIds) { this.likedUserIds = likedUserIds; }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public Long getShortVideoId() { return shortVideoId; }
    public void setShortVideoId(Long shortVideoId) { this.shortVideoId = shortVideoId; }
}