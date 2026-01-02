package com.duli.duli_social.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "messages")
public class Message extends BaseEntity {

    private String content;

    @Column(name = "image_url")
    private String image;

    @Column(name = "video_url")
    private String video;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "chat_id")
    private Chat chat;

    @Column(name = "is_read")
    private boolean isRead = false;

    public Message() {
    }

    
    
    public Message(String content, String image, String video, User user, Chat chat, boolean isRead) {
        this.content = content;
        this.image = image;
        this.video = video;
        this.user = user;
        this.chat = chat;
        this.isRead = isRead;
    }



    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getVideo() { return video; }
    public void setVideo(String video) { this.video = video; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Chat getChat() { return chat; }
    public void setChat(Chat chat) { this.chat = chat; }



    public boolean isRead() {
        return isRead;
    }



    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }
}