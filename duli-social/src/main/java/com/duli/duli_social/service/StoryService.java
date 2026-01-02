package com.duli.duli_social.service;

import java.util.List;
import com.duli.duli_social.dto.StoryDto;
import com.duli.duli_social.models.Story;
import com.duli.duli_social.models.User;

public interface StoryService {
    public StoryDto createStory(Story story, User user);
    public List<StoryDto> findStoryByUserId(Long userId);
    public List<StoryDto> findStoryByJwt(String jwt);
}