package com.duli.duli_social.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.duli.duli_social.dto.CommentDto;
import com.duli.duli_social.dto.PostDto;
import com.duli.duli_social.dto.UserDto;
import com.duli.duli_social.models.Post;
import com.duli.duli_social.models.User;
import com.duli.duli_social.response.APIResponse;
import com.duli.duli_social.service.PostService;
import com.duli.duli_social.service.UserService;
import com.duli.duli_social.service.FeedService;

@RestController
public class PostController {

    @Autowired
    PostService postService;

    @Autowired
    UserService userService;

    @Autowired
    private FeedService feedService;

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

    @GetMapping("/api/posts/search")
    public ResponseEntity<List<Post>> searchPost(@RequestParam("query") String query) {
        List<Post> posts = postService.searchPost(query);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/api/posts/feed")
    public ResponseEntity<List<PostDto>> getFeedPosts(
            @RequestParam String sessionId, 
            @RequestParam(defaultValue = "0") int page) {
            
        List<Post> posts = feedService.getFeedPosts(sessionId, page, 5); 
        
        List<PostDto> postDtos = posts.stream().map((post) -> {
            
            PostDto dto = new PostDto();
            dto.setId(post.getId());
            dto.setCaption(post.getCaption());
            dto.setImage(post.getImage());
            dto.setVideo(post.getVideo());
            dto.setCreatedAt(post.getCreatedAt());
            
            UserDto userDto = new UserDto();
            userDto.setId(post.getUser().getId());
            userDto.setFirstName(post.getUser().getFirstName());
            userDto.setLastName(post.getUser().getLastName());
            userDto.setImage(post.getUser().getImage());
            dto.setUser(userDto);
            
            dto.setLikedUserIds(post.getLikedUsers().stream().map(User::getId).collect(Collectors.toList()));
            dto.setSavedUserIds(post.getSavedUsers().stream().map(User::getId).collect(Collectors.toList()));
            dto.setTotalComments(post.getComments().size());
            
            if (post.getComments() != null) {
                List<CommentDto> commentDtos = post.getComments().stream().map(comment -> {
                    CommentDto cDto = new CommentDto();
                    cDto.setId(comment.getId());
                    cDto.setContent(comment.getContent());
                    cDto.setCreatedAt(comment.getCreatedAt());

                    UserDto commentUser = new UserDto();
                    commentUser.setId(comment.getUser().getId());
                    commentUser.setFirstName(comment.getUser().getFirstName());
                    commentUser.setLastName(comment.getUser().getLastName());
                    commentUser.setImage(comment.getUser().getImage());
                    cDto.setUser(commentUser);
                    
                    return cDto;
                }).collect(Collectors.toList());

                dto.setComments(commentDtos);
            }
            
            return dto;
            
        }).collect(Collectors.toList());

        return new ResponseEntity<>(postDtos, HttpStatus.OK);
    }
}