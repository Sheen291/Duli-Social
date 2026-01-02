package com.duli.duli_social.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.duli.duli_social.dto.ShortVideoDto;
import com.duli.duli_social.models.ShortVideo;
import com.duli.duli_social.models.User;
import com.duli.duli_social.response.APIResponse;
import com.duli.duli_social.service.ShortVideoService;
import com.duli.duli_social.service.UserService;

@RestController
@RequestMapping("/api/shortvideos")
public class ShortVideoController {

    @Autowired
    private ShortVideoService shortVideoService;

    @Autowired
    private UserService userService;

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

    // Lấy tất cả video (Feed) - Có phân trang
    @GetMapping
    public ResponseEntity<Page<ShortVideoDto>> findAllShortVideo(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ShortVideoDto> allVideo = shortVideoService.findAllShortVideo(page, size);
        return new ResponseEntity<>(allVideo, HttpStatus.OK);
    }

    // Lấy video của user - Có phân trang
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
}