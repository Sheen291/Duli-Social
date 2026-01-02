package com.duli.duli_social.service;

import com.duli.duli_social.dto.CommentDto;
import com.duli.duli_social.models.Comment;

public interface CommentService {
    
    CommentDto createComment(Comment comment, Long postId, Long userId) throws Exception;

    CommentDto likeComment(Long commentId, Long userId) throws Exception;

    CommentDto findCommentById(Long commentId) throws Exception;
    
    CommentDto createCommentInShortVideo(Comment comment, Long shortVideoId, Long userId) throws Exception;
}