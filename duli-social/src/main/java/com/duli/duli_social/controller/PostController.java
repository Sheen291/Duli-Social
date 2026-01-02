package com.duli.duli_social.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.duli.duli_social.dto.PostDto;
import com.duli.duli_social.models.Post;
import com.duli.duli_social.models.User;
import com.duli.duli_social.response.APIResponse;
import com.duli.duli_social.service.PostService;
import com.duli.duli_social.service.UserService;

@RestController
public class PostController {

    @Autowired
    PostService postService;

    @Autowired
    UserService userService;

    @PostMapping("/api/posts")
    public ResponseEntity<Post> createPost(@RequestHeader("Authorization") String jwt, @RequestBody Post post) throws Exception {
        User user = userService.findUserByJwt(jwt);
        Post createdPost = postService.createPost(post, user.getId());
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    @DeleteMapping("/api/posts/{postId}")
    public ResponseEntity<APIResponse> deletePost(@RequestHeader("Authorization") String jwt, @PathVariable Long postId) throws Exception {
        User user = userService.findUserByJwt(jwt);
        String message = postService.deletePost(postId, user.getId());
        return new ResponseEntity<>(new APIResponse(message, true), HttpStatus.OK);
    }

    @GetMapping("/api/posts/{postId}")
    public ResponseEntity<PostDto> findPostById(@PathVariable Long postId) throws Exception {
        PostDto post = postService.findPostById(postId);
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @GetMapping("/api/posts/user/{userId}")
    public ResponseEntity<Page<PostDto>> findUsersPost(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) throws Exception {
        Page<PostDto> posts = postService.findPostByUserId(userId, page, size);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/api/posts")
    public ResponseEntity<Page<PostDto>> findAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<PostDto> posts = postService.findAllPost(page, size);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @PutMapping("/api/posts/saved/{postId}")
    public ResponseEntity<PostDto> savePost(@RequestHeader("Authorization") String jwt, @PathVariable Long postId) throws Exception {
        User user = userService.findUserByJwt(jwt);
        PostDto savedPost = postService.savePost(postId, user.getId());
        return new ResponseEntity<>(savedPost, HttpStatus.OK);
    }

    @PutMapping("/api/posts/like/{postId}")
    public ResponseEntity<PostDto> likePost(@RequestHeader("Authorization") String jwt, @PathVariable Long postId) throws Exception {
        User user = userService.findUserByJwt(jwt);
        PostDto likedPost = postService.likePost(postId, user.getId());
        return new ResponseEntity<>(likedPost, HttpStatus.OK);
    }
}