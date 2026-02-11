package com.duli.duli_social.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ShortVideoDto {
    private Long id;
    private String title;
    private String videoUrl;
    private LocalDateTime createdAt;
    
    private UserDto user;
    
    private List<Long> likedUserIds = new ArrayList<>();
    private int totalComments;

    private List<CommentDto> comments = new ArrayList<>();

    public ShortVideoDto() {
    }

    public List<CommentDto> getComments() {
        return comments;
    }

    public void setComments(List<CommentDto> comments) {
        this.comments = comments;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public List<Long> getLikedUserIds() { return likedUserIds; }
    public void setLikedUserIds(List<Long> likedUserIds) { this.likedUserIds = likedUserIds; }

    public int getTotalComments() { return totalComments; }
    public void setTotalComments(int totalComments) { this.totalComments = totalComments; }
}