package com.duli.duli_social.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity

public class Post {
    //tự động tạo id nếu không cung cấp
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String caption;
    
    private String image;
    
    private String video;
    
    @ManyToOne
    private User user;

    private LocalDateTime createdAt;
    
    @OneToMany
    private List<User> likedUser=new ArrayList<>();

    public Post() {

    }
    

    public Post(Integer id, String caption, String image, String video, User user, LocalDateTime createdAt,
            List<User> likedUser) {
        this.id = id;
        this.caption = caption;
        this.image = image;
        this.video = video;
        this.user = user;
        this.createdAt = createdAt;
        this.likedUser = likedUser;
    }


    public String getCaption() {
        return caption;
    }
    public void setCaption(String caption) {
        this.caption = caption;
    }
    public String getImage() {
        return image;
    }
    public void setImage(String image) {
        this.image = image;
    }
    public String getVideo() {
        return video;
    }
    public void setVideo(String video) {
        this.video = video;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }


    public List<User> getLikedUser() {
        return likedUser;
    }


    public void setLikedUser(List<User> likedUser) {
        this.likedUser = likedUser;
    }
}
