package com.duli.duli_social.models;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "stories")
public class Story extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "image_url", nullable = false)
    private String image;

    private String caption;

    public Story() {
    }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }
}