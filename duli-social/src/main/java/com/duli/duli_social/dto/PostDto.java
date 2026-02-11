package com.duli.duli_social.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PostDto {
    private Long id;
    private String caption;
    private String image;
    private String video;
    private LocalDateTime createdAt;
    
    private UserDto user;
    
    private List<Long> likedUserIds = new ArrayList<>();
    
    private int totalComments;

    private List<CommentDto> comments = new ArrayList<>();

    private List<Long> savedUserIds = new ArrayList<>();

    public PostDto() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public String getVideo() { return video; }
    public void setVideo(String video) { this.video = video; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
    
    public List<Long> getLikedUserIds() { return likedUserIds; }
    public void setLikedUserIds(List<Long> likedUserIds) { this.likedUserIds = likedUserIds; }

    public int getTotalComments() { return totalComments; }
    public void setTotalComments(int totalComments) { this.totalComments = totalComments; }

    public List<CommentDto> getComments() { return comments; }
    public void setComments(List<CommentDto> comments) { this.comments = comments; }

    public List<Long> getSavedUserIds() {
        return savedUserIds;
    }

    public void setSavedUserIds(List<Long> savedUserIds) {
        this.savedUserIds = savedUserIds;
    }
}