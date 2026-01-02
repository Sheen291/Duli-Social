package com.duli.duli_social.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.duli.duli_social.dto.CommentDto;
import com.duli.duli_social.models.Comment;
import com.duli.duli_social.models.User;
import com.duli.duli_social.service.CommentService;
import com.duli.duli_social.service.UserService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @PostMapping("/post/{postId}")
    public ResponseEntity<CommentDto> createComment(
            @RequestBody Comment comment, 
            @RequestHeader("Authorization") String jwt, 
            @PathVariable Long postId) throws Exception {
        
        User user = userService.findUserByJwt(jwt);
        CommentDto newComment = commentService.createComment(comment, postId, user.getId());
        return new ResponseEntity<>(newComment, HttpStatus.CREATED);
    }
    
    @PostMapping("/shortvideo/{shortVideoId}")
    public ResponseEntity<CommentDto> createCommentShortVideo(
            @RequestBody Comment comment, 
            @RequestHeader("Authorization") String jwt, 
            @PathVariable Long shortVideoId) throws Exception {
        
        User user = userService.findUserByJwt(jwt);
        CommentDto newComment = commentService.createCommentInShortVideo(comment, shortVideoId, user.getId());
        return new ResponseEntity<>(newComment, HttpStatus.CREATED);
    }

    @PutMapping("/liked/{commentId}")
    public ResponseEntity<CommentDto> likedComment(
            @RequestHeader("Authorization") String jwt, 
            @PathVariable Long commentId) throws Exception {
        
        User user = userService.findUserByJwt(jwt);
        CommentDto likedComment = commentService.likeComment(commentId, user.getId());
        return new ResponseEntity<>(likedComment, HttpStatus.OK);
    }
}