package com.duli.duli_social.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.duli.duli_social.models.Post;
import com.duli.duli_social.models.User;
import com.duli.duli_social.response.APIResponse;
import com.duli.duli_social.service.PostService;
import com.duli.duli_social.service.UserService;

//@RestController để báo cho spring biết class này dùng để viết api, tiếp nhận request từ client các method sẽ trả về json cho client
@RestController
public class PostController {

    @Autowired
    PostService postService;

    @Autowired
    UserService userService;

    @PostMapping("/api/posts")
    public ResponseEntity<Post> createPost(@RequestHeader("Authorization")String jwt, @RequestBody Post post) throws Exception {
        User user = userService.findUserByToken(jwt);
        Post createdPost = postService.createPost(post, user.getId());
        return new ResponseEntity<>(createdPost,HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/api/posts/{postId}")
    public ResponseEntity<APIResponse> deletePost(@RequestHeader("Authorization")String jwt, @PathVariable Integer postId) throws Exception {
        User user = userService.findUserByToken(jwt);
        String message=postService.deletePost(postId, user.getId());
        APIResponse res=new APIResponse(message, true);

        return new ResponseEntity<APIResponse>(res, HttpStatus.OK);
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<Post> findPostById(@PathVariable Integer postId) throws Exception{

        Post post=postService.findPostById(postId);
        return new ResponseEntity<Post>(post,HttpStatus.ACCEPTED);
    }

    @GetMapping("/posts/user/{userId}")
    public ResponseEntity<List<Post>> findUsersPost(@PathVariable Integer userId) throws Exception{

        List<Post> listOfPosts=postService.findPostByUserId(userId);

        return new ResponseEntity<List<Post>>(listOfPosts,HttpStatus.OK);

    }

    @GetMapping("/posts")
    public ResponseEntity<List<Post>> findAllPosts() {
        
        List<Post> listOfAllPosts=postService.findAllPost();
        return new ResponseEntity<List<Post>>(listOfAllPosts,HttpStatus.OK);
    }

    @PutMapping("/api/posts/saved/{postId}")
    public ResponseEntity<Post> savePost(@RequestHeader("Authorization")String jwt, @PathVariable Integer postId) throws Exception {
        
        User user = userService.findUserByToken(jwt);
        
        Post savedPost=postService.savePost(postId, user.getId());
        return new ResponseEntity<Post>(savedPost,HttpStatus.ACCEPTED);
    }

    @PutMapping("/api/posts/like/{postId}")
    public ResponseEntity<Post> likePost(@RequestHeader("Authorization")String jwt, @PathVariable Integer postId) throws Exception {
        
        User user = userService.findUserByToken(jwt);

        Post likedPost=postService.likePost(postId, user.getId());
        return new ResponseEntity<Post>(likedPost,HttpStatus.ACCEPTED);
    }
}

