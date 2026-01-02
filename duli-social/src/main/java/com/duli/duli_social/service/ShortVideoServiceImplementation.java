package com.duli.duli_social.service;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duli.duli_social.dto.ShortVideoDto;
import com.duli.duli_social.dto.UserDto;
import com.duli.duli_social.models.ShortVideo;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.ShortVideoRepository;

@Service
public class ShortVideoServiceImplementation implements ShortVideoService {

    @Autowired
    private ShortVideoRepository shortVideoRepository;

    @Autowired
    private UserService userService;

    @Override
    public ShortVideoDto createShortVideo(ShortVideo shortVideo, User user) {
        ShortVideo createdShortVideo = new ShortVideo();
        createdShortVideo.setTitle(shortVideo.getTitle());
        createdShortVideo.setUser(user);
        createdShortVideo.setVideoUrl(shortVideo.getVideoUrl()); 
        
        ShortVideo savedVideo = shortVideoRepository.save(createdShortVideo);
        return mapToDto(savedVideo);
    }

    @Override
    public Page<ShortVideoDto> findShortVideoByUserId(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ShortVideo> videos = shortVideoRepository.findShortVideoByUserId(userId, pageable);
        return videos.map(this::mapToDto);
    }

    @Override
    public Page<ShortVideoDto> findAllShortVideo(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ShortVideo> videos = shortVideoRepository.findAllShortVideos(pageable);
        return videos.map(this::mapToDto);
    }

    @Override
    public ShortVideoDto likeShortVideo(Long shortVideoId, Long userId) throws Exception {
        ShortVideo shortVideo = findEntityById(shortVideoId);
        User user = userService.findUserById(userId);

        if (shortVideo.getLikedUsers().contains(user)) {
            shortVideo.getLikedUsers().remove(user);
        } else {
            shortVideo.getLikedUsers().add(user);
        }

        ShortVideo savedVideo = shortVideoRepository.save(shortVideo);
        return mapToDto(savedVideo);
    }

    @Override
    @Transactional
    public String deleteShortVideo(Long shortVideoId, Long userId) throws Exception {
        ShortVideo shortVideo = findEntityById(shortVideoId);
        User user = userService.findUserById(userId);

        if (!shortVideo.getUser().getId().equals(user.getId())) {
            throw new Exception("Can't delete short video of another user");
        }

        shortVideoRepository.delete(shortVideo);
        return "Short video deleted successfully";
    }

    @Override
    public ShortVideoDto findShortVideoById(Long shortVideoId) throws Exception {
        ShortVideo sv = findEntityById(shortVideoId);
        return mapToDto(sv);
    }
        
    private ShortVideo findEntityById(Long id) throws Exception {
        return shortVideoRepository.findById(id)
                .orElseThrow(() -> new Exception("Short video not found with id " + id));
    }

    private ShortVideoDto mapToDto(ShortVideo sv) {
        ShortVideoDto dto = new ShortVideoDto();
        dto.setId(sv.getId());
        dto.setTitle(sv.getTitle());
        dto.setVideoUrl(sv.getVideoUrl());
        dto.setCreatedAt(sv.getCreatedAt());
        dto.setTotalComments(sv.getComments().size());
        
        User u = sv.getUser();
        UserDto userDto = new UserDto();
        userDto.setId(u.getId());
        userDto.setFirstName(u.getFirstName());
        userDto.setLastName(u.getLastName());
        userDto.setImage(u.getImage());
        dto.setUser(userDto);
        
        dto.setLikedUserIds(sv.getLikedUsers().stream()
                .map(User::getId)
                .collect(Collectors.toList()));
        
        return dto;
    }
}