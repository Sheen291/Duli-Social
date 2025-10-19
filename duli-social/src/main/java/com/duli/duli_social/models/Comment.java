package com.duli.duli_social.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    //một người có thể có nhiều cmt nhưng 1 cmt thì k thể do nhiều người cmt
    @ManyToOne
    private User user;

    private String content;

    @ManyToMany
    private List<User> liked = new ArrayList<>();

    private LocalDateTime createdAt;


    
    public Comment() {

    }

    public Comment(Integer id, User user, String content, List<User> liked, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.content = content;
        this.liked = liked;
        this.createdAt = createdAt;
    }



    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<User> getLiked() {
        return liked;
    }

    public void setLiked(List<User> liked) {
        this.liked = liked;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
