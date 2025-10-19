package com.duli.duli_social.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.duli.duli_social.models.Comment;
import com.duli.duli_social.models.Post;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.CommentRepository;
import com.duli.duli_social.repository.PostRepository;

public class CommentServiceImplementation implements CommentService {

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;



    @Override
    public Comment createComment(Comment comment, Integer postId, Integer userId) throws Exception {
        
        Post post = postService.findPostById(postId);
        User user = userService.findUserById(userId);

        Comment newComment = new Comment();

        newComment.setUser(user);
        newComment.setContent(comment.getContent());
        newComment.setCreatedAt(LocalDateTime.now());

        post.getComments().add(newComment);
        postRepository.save(post);

        return commentRepository.save(newComment);
    }

    @Override
    public Comment likedComment(Integer commentId, Integer userId) throws Exception {
        
        Comment comment = findCommentByCommentId(commentId);

        User user = userService.findUserById(userId);

        if(comment.getLiked().contains(user)) {
            comment.getLiked().remove(user);
        }
        else {
            comment.getLiked().add(user);
        }

        commentRepository.save(comment);

        return comment;
    }

    @Override
    public Comment findCommentByCommentId(Integer commentId) {
        
        Optional<Comment> comment = commentRepository.findById(commentId);

        return comment.get();
    }

}
