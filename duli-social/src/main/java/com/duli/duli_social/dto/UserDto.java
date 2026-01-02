package com.duli.duli_social.dto;

import java.util.ArrayList;
import java.util.List;

public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private String image;
    private String bio;
    
    private List<Long> followers = new ArrayList<>();
    private List<Long> followings = new ArrayList<>();

    private List<Long> savedPostIds = new ArrayList<>();

    public UserDto() {
    }

    
    public UserDto(Long id, String firstName, String lastName, String email, String gender, String image, String bio,
            List<Long> followers, List<Long> followings, List<Long> savedPostIds) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.image = image;
        this.bio = bio;
        this.followers = followers;
        this.followings = followings;
        this.savedPostIds = savedPostIds;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getBio() {
        return bio;
    }


    public void setBio(String bio) {
        this.bio = bio;
    }


    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<Long> getFollowers() {
        return followers;
    }

    public void setFollowers(List<Long> followers) {
        this.followers = followers;
    }

    public List<Long> getFollowings() {
        return followings;
    }

    public void setFollowings(List<Long> followings) {
        this.followings = followings;
    }



    public List<Long> getSavedPostIds() {
        return savedPostIds;
    }



    public void setSavedPostIds(List<Long> savedPostIds) {
        this.savedPostIds = savedPostIds;
    }
}