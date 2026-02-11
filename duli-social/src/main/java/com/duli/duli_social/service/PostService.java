package com.duli.duli_social.service;

import java.util.List;

import com.duli.duli_social.dto.PostDto;
import com.duli.duli_social.models.Post;
import org.springframework.data.domain.Page;

public interface PostService {

    Post createPost(Post post, Long userId) throws Exception;

    String deletePost(Long postId, Long userId) throws Exception;

    Page<PostDto> findPostByUserId(Long userId, int page, int size) throws Exception;

    PostDto findPostById(Long postId) throws Exception;

    Page<PostDto> findAllPost(int page, int size);

    PostDto savePost(Long postId, Long userId) throws Exception;

    PostDto likePost(Long postId, Long userId) throws Exception;

    List<Post> searchPost(String query);
}