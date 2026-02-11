package com.duli.duli_social.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.duli.duli_social.dto.CommentDto;
import com.duli.duli_social.dto.ShortVideoDto;
import com.duli.duli_social.dto.UserDto;
import com.duli.duli_social.models.ShortVideo;
import com.duli.duli_social.models.User;
import com.duli.duli_social.response.APIResponse;
import com.duli.duli_social.service.FeedService;
import com.duli.duli_social.service.ShortVideoService;
import com.duli.duli_social.service.UserService;

@RestController
@RequestMapping("/api/shortvideos")
public class ShortVideoController {

    @Autowired
    private ShortVideoService shortVideoService;

    @Autowired
    private UserService userService;

    @Autowired
    private FeedService feedService;

    @PostMapping("/created")
    public ResponseEntity<ShortVideoDto> createShortVideo(@RequestHeader("Authorization") String jwt, @RequestBody ShortVideo shortVideo) {
        User user = userService.findUserByJwt(jwt);
        ShortVideoDto createdVideo = shortVideoService.createShortVideo(shortVideo, user);
        return new ResponseEntity<>(createdVideo, HttpStatus.CREATED);
    }

    @PutMapping("/liked/{shortVideoId}")
    public ResponseEntity<ShortVideoDto> likedShortVideo(@RequestHeader("Authorization") String jwt, @PathVariable Long shortVideoId) throws Exception {
        User user = userService.findUserByJwt(jwt);
        ShortVideoDto likedVideo = shortVideoService.likeShortVideo(shortVideoId, user.getId());
        return new ResponseEntity<>(likedVideo, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Page<ShortVideoDto>> findAllShortVideo(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ShortVideoDto> allVideo = shortVideoService.findAllShortVideo(page, size);
        return new ResponseEntity<>(allVideo, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ShortVideoDto>> findAllShortVideoUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ShortVideoDto> allVideoUser = shortVideoService.findShortVideoByUserId(userId, page, size);
        return new ResponseEntity<>(allVideoUser, HttpStatus.OK);
    }

    @DeleteMapping("/deleted/{shortVideoId}")
    public ResponseEntity<APIResponse> deletedShortVideo(@RequestHeader("Authorization") String jwt, @PathVariable Long shortVideoId) throws Exception {
        User user = userService.findUserByJwt(jwt);
        String message = shortVideoService.deleteShortVideo(shortVideoId, user.getId());
        return new ResponseEntity<>(new APIResponse(message, true), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ShortVideoDto>> searchShortVideo(@RequestParam("query") String query) {
        List<ShortVideoDto> videos = shortVideoService.searchShortVideo(query);
        return new ResponseEntity<>(videos, HttpStatus.OK);
    }

    @GetMapping("/feed")
    public ResponseEntity<List<ShortVideoDto>> getReelFeed(
            @RequestParam String sessionId, 
            @RequestParam(defaultValue = "0") int page) {
        
        List<ShortVideo> reels = feedService.getReelFeed(sessionId, page, 5); 
        
        List<ShortVideoDto> reelDtos = reels.stream().map(video -> {
            ShortVideoDto dto = new ShortVideoDto();
            dto.setId(video.getId());
            dto.setTitle(video.getTitle());
            dto.setVideoUrl(video.getVideoUrl());
            dto.setCreatedAt(video.getCreatedAt());

            UserDto userDto = new UserDto();
            userDto.setId(video.getUser().getId());
            userDto.setFirstName(video.getUser().getFirstName());
            userDto.setLastName(video.getUser().getLastName());
            userDto.setImage(video.getUser().getImage());
            dto.setUser(userDto);

            if (video.getLikedUsers() != null) {
                dto.setLikedUserIds(video.getLikedUsers().stream()
                    .map(User::getId)
                    .collect(Collectors.toList()));
            }

            if (video.getComments() != null) {
                 List<CommentDto> commentDtos = video.getComments().stream().map(comment -> {
                    CommentDto cDto = new CommentDto();
                    cDto.setId(comment.getId());
                    cDto.setContent(comment.getContent());
                    cDto.setCreatedAt(comment.getCreatedAt());
                    
                    UserDto uDto = new UserDto();
                    uDto.setId(comment.getUser().getId());
                    uDto.setFirstName(comment.getUser().getFirstName());
                    uDto.setLastName(comment.getUser().getLastName());
                    uDto.setImage(comment.getUser().getImage());
                    cDto.setUser(uDto);
                    
                    return cDto;
                }).collect(Collectors.toList());
                
                dto.setComments(commentDtos);
                dto.setTotalComments(commentDtos.size());
            }
            
            return dto;
        }).collect(Collectors.toList());
        
        return new ResponseEntity<>(reelDtos, HttpStatus.OK);
    }

}