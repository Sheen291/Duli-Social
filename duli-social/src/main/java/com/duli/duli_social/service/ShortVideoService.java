package com.duli.duli_social.service;

import com.duli.duli_social.dto.ShortVideoDto;
import com.duli.duli_social.models.Post;
import com.duli.duli_social.models.ShortVideo;
import com.duli.duli_social.models.User;

import java.util.List;

import org.springframework.data.domain.Page;

public interface ShortVideoService {

    ShortVideoDto createShortVideo(ShortVideo shortVideo, User user);

    Page<ShortVideoDto> findShortVideoByUserId(Long userId, int page, int size);

    ShortVideoDto findShortVideoById(Long shortVideoId) throws Exception;

    Page<ShortVideoDto> findAllShortVideo(int page, int size);

    ShortVideoDto likeShortVideo(Long shortVideoId, Long userId) throws Exception;
    
    String deleteShortVideo(Long shortVideoId, Long userId) throws Exception;

    List<ShortVideoDto> searchShortVideo(String query);
}