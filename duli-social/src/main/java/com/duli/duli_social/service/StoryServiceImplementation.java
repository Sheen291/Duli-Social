package com.duli.duli_social.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.duli.duli_social.dto.StoryDto;
import com.duli.duli_social.dto.UserDto;
import com.duli.duli_social.models.NotificationType;
import com.duli.duli_social.models.Story;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.StoryRepository;

@Service
public class StoryServiceImplementation implements StoryService {

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Override
    public StoryDto createStory(Story story, User user) {
        Story newStory = new Story();
        newStory.setCaption(story.getCaption());
        newStory.setImage(story.getImage());
        newStory.setUser(user);
        newStory.setCreatedAt(LocalDateTime.now());
        
        Story savedStory = storyRepository.save(newStory);

        Set<User> followers = user.getFollowers();
        
        for (User follower : followers) {
            notificationService.createNotification(
                follower,                   
                user,                       
                NotificationType.NEW_STORY, 
                "added to their story.",    
                savedStory.getId()          
            );
        }

        return mapToDto(savedStory);
    }

    @Override
    public List<StoryDto> findStoryByUserId(Long userId) {
        LocalDateTime time = LocalDateTime.now().minusHours(24);
        
        List<Story> stories = storyRepository.findByUserIdAndCreatedAtAfter(userId, time);
        
        return stories.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<StoryDto> findStoryByJwt(String jwt) {
        User user = userService.findUserByJwt(jwt);
        LocalDateTime time = LocalDateTime.now().minusHours(24);
        
        List<Long> followingIds = user.getFollowings().stream()
                .map(User::getId)
                .collect(Collectors.toList());
        
        followingIds.add(user.getId());

        List<Story> stories = storyRepository.findStoryByUserIds(followingIds, time);
        
        return stories.stream().map(this::mapToDto).collect(Collectors.toList());
    }
    

    private StoryDto mapToDto(Story story) {
        StoryDto dto = new StoryDto();
        dto.setId(story.getId());
        dto.setCaption(story.getCaption());
        dto.setImage(story.getImage());
        dto.setCreatedAt(story.getCreatedAt());
        
        User u = story.getUser();
        UserDto userDto = new UserDto();
        userDto.setId(u.getId());
        userDto.setFirstName(u.getFirstName());
        userDto.setLastName(u.getLastName());
        userDto.setEmail(u.getEmail());
        userDto.setGender(u.getGender());
        userDto.setImage(u.getImage());
        
        
        dto.setUser(userDto);
        
        return dto;
    }
}