package com.duli.duli_social.service;

import java.util.List;

import com.duli.duli_social.models.Post;

public interface PostService {

    Post createPost(Post post, Integer userId) throws Exception;

    String deletePost(Integer postId, Integer userId) throws Exception;

    List<Post> findPostByUserId(Integer userId) throws Exception;

    Post findPostById(Integer postId) throws Exception;

    List<Post> findAllPost();

    Post savePost(Integer postId, Integer userId) throws Exception;

    Post likePost(Integer postId, Integer userId) throws Exception;
}
