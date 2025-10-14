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
import org.springframework.web.bind.annotation.RestController;

import com.duli.duli_social.models.Post;
import com.duli.duli_social.response.APIResponse;
import com.duli.duli_social.service.PostService;

//@RestController để báo cho spring biết class này dùng để viết api, tiếp nhận request từ client các method sẽ trả về json cho client
@RestController
public class PostController {

    @Autowired
    PostService postService;

    @PostMapping("/posts/user/{userId}")
    public ResponseEntity<Post> createPost(@RequestBody Post post, @PathVariable Integer userId) throws Exception {
        Post createdPost=postService.createPost(post, userId);
        return new ResponseEntity<>(createdPost,HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/posts/{postId}/user/{userId}")
    public ResponseEntity<APIResponse> deletePost(@PathVariable Integer postId, @PathVariable Integer userId) throws Exception {
        String message=postService.deletePost(postId, userId);
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

    @PutMapping("/posts/{postId}/user/{userId}/saved")
    public ResponseEntity<Post> savePost(@PathVariable Integer postId, @PathVariable Integer userId) throws Exception {
        
        Post savedPost=postService.savePost(postId, userId);
        return new ResponseEntity<Post>(savedPost,HttpStatus.ACCEPTED);
    }

    @PutMapping("/posts/like/{postId}/user/{userId}")
    public ResponseEntity<Post> likePost(@PathVariable Integer postId, @PathVariable Integer userId) throws Exception {
        
        Post likedPost=postService.likePost(postId, userId);
        return new ResponseEntity<Post>(likedPost,HttpStatus.ACCEPTED);
    }
}

