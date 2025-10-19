package com.duli.duli_social.service;

import java.util.Optional;

import com.duli.duli_social.models.Comment;

public interface CommentService {
    public Comment createComment(Comment comment, Integer postId, Integer userId) throws Exception;

    public Comment likedComment(Integer commentId, Integer userId) throws Exception;

    public Comment findCommentByCommentId(Integer commentId);

}
