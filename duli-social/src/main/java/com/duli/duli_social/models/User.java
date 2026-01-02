package com.duli.duli_social.models;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name="users")
public class User extends BaseEntity {

    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String gender;
    private String image;

    @JsonProperty("bio")
    private String bio;

    @Column(name = "google_id", unique = true)
    private String googleId;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_follows",
        joinColumns = @JoinColumn(name = "follower_id"),
        inverseJoinColumns = @JoinColumn(name = "following_id")
    )
    private Set<User> followings = new HashSet<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "followings", fetch = FetchType.LAZY)
    private Set<User> followers = new HashSet<>();

    @JsonIgnore
    @ManyToMany
    private List<Post> savedPost = new ArrayList<>();

    public User() {
    }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Set<User> getFollowers() { return followers; }
    public void setFollowers(Set<User> followers) { this.followers = followers; }

    public Set<User> getFollowings() { return followings; }
    public void setFollowings(Set<User> followings) { this.followings = followings; }

    public List<Post> getSavedPost() { return savedPost; }
    public void setSavedPost(List<Post> savedPost) { this.savedPost = savedPost; }

    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }

    @JsonProperty("followers")
    public List<Long> getFollowersIds() {
        if (this.followers == null) return new ArrayList<>();
        return this.followers.stream()
                .map(User::getId)
                .collect(Collectors.toList());
    }

    @JsonProperty("followings")
    public List<Long> getFollowingsIds() {
        if (this.followings == null) return new ArrayList<>();
        return this.followings.stream()
                .map(User::getId)
                .collect(Collectors.toList());
    }
    
    @JsonProperty("savedPostIds") 
    public List<Long> getSavedPostIds() {
        if (this.savedPost == null) return new ArrayList<>();
        return this.savedPost.stream()
                .map(Post::getId)
                .collect(Collectors.toList());
    }

    @JsonProperty("bio")
    public String getBio() {
        System.out.println(">>> CHECK GETTER BIO: " + this.bio); 
        return this.bio;    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}