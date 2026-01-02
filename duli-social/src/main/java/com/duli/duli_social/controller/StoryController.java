package com.duli.duli_social.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.duli.duli_social.dto.StoryDto;
import com.duli.duli_social.models.Story;
import com.duli.duli_social.models.User;
import com.duli.duli_social.service.StoryService;
import com.duli.duli_social.service.UserService;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    @Autowired
    private StoryService storyService;
    @Autowired
    private UserService userService;

    @PostMapping
    public StoryDto createStory(@RequestBody Story story, @RequestHeader("Authorization") String jwt) {
        User user = userService.findUserByJwt(jwt);
        return storyService.createStory(story, user);
    }

    @GetMapping
    public List<StoryDto> getHomeStories(@RequestHeader("Authorization") String jwt) {
        return storyService.findStoryByJwt(jwt);
    }
    
    @GetMapping("/user/{userId}")
    public List<StoryDto> getUserStories(@PathVariable Long userId) {
        return storyService.findStoryByUserId(userId);
    }
}