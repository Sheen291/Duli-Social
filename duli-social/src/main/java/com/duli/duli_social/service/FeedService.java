package com.duli.duli_social.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.duli.duli_social.models.Post;
import com.duli.duli_social.models.ShortVideo;
import com.duli.duli_social.repository.PostRepository;
import com.duli.duli_social.repository.ShortVideoRepository;

@Service
public class FeedService {

    @Autowired
    private PostRepository postRepository;

    private Map<String, List<Long>> userFeedCache = new ConcurrentHashMap<>();

    @Autowired 
    private ShortVideoRepository shortVideoRepository;
    
    private Map<String, List<Long>> userReelFeedCache = new ConcurrentHashMap<>();

    public List<Post> getFeedPosts(String sessionId, int page, int size) {
        
        if (!userFeedCache.containsKey(sessionId)) {
            List<Long> allPostIds = postRepository.findAllIds();
            
            Collections.shuffle(allPostIds);
            
            userFeedCache.put(sessionId, allPostIds);
            
        }

        List<Long> cachedIds = userFeedCache.get(sessionId);

        int start = page * size;
        int end = Math.min((page + 1) * size, cachedIds.size());

        if (start >= cachedIds.size()) {
            return new ArrayList<>();
        }

        List<Long> pageIds = cachedIds.subList(start, end);

        List<Post> posts = postRepository.findAllById(pageIds);
        
        Map<Long, Post> postMap = posts.stream().collect(Collectors.toMap(Post::getId, p -> p));
        List<Post> sortedPosts = new ArrayList<>();
        for (Long id : pageIds) {
            if (postMap.containsKey(id)) {
                sortedPosts.add(postMap.get(id));
            }
        }
        
        return sortedPosts;
    }

    public List<ShortVideo> getReelFeed(String sessionId, int page, int size) {
        
        if (!userReelFeedCache.containsKey(sessionId)) {
            List<Long> allIds = shortVideoRepository.findAllIds();
            Collections.shuffle(allIds);
            userReelFeedCache.put(sessionId, allIds);
        }

        List<Long> cachedIds = userReelFeedCache.get(sessionId);

        int start = page * size;
        int end = Math.min((page + 1) * size, cachedIds.size());

        if (start >= cachedIds.size()) {
            return new ArrayList<>();
        }

        List<Long> pageIds = cachedIds.subList(start, end);

        List<ShortVideo> videos = shortVideoRepository.findAllById(pageIds);
        
        Map<Long, ShortVideo> videoMap = videos.stream().collect(Collectors.toMap(ShortVideo::getId, v -> v));
        List<ShortVideo> sortedVideos = new ArrayList<>();
        for (Long id : pageIds) {
            if (videoMap.containsKey(id)) {
                sortedVideos.add(videoMap.get(id));
            }
        }
        
        return sortedVideos;
    }
}
