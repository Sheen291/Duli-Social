package com.duli.duli_social.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.duli.duli_social.dto.CommentDto;
import com.duli.duli_social.dto.PostDto;
import com.duli.duli_social.dto.UserDto;
import com.duli.duli_social.models.NotificationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duli.duli_social.models.Post;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.PostRepository;
import com.duli.duli_social.repository.UserRepository;

@Service
public class PostServiceImplementation implements PostService {

    @Autowired
    PostRepository postRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;
    
    @Autowired
    NotificationService notificationService;

    @Override
    public Post createPost(Post post, Long userId) throws Exception {
        User user = userService.findUserById(userId);

        Post newPost = new Post();
        newPost.setCaption(post.getCaption());
        newPost.setImage(post.getImage());
        newPost.setVideo(post.getVideo());
        newPost.setUser(user);
        
        return postRepository.save(newPost);
    }

    @Override
    @Transactional
    public String deletePost(Long postId, Long userId) throws Exception {
        Post post = findPostEntityById(postId);
        User user = userService.findUserById(userId);

        if (!post.getUser().getId().equals(user.getId())) {
            throw new Exception("You can't delete another user's post");
        }
          
        postRepository.delete(post);
        return "Post deleted successfully";
    }

    @Override
    public Page<PostDto> findPostByUserId(Long userId, int page, int size) throws Exception {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findPostByUserId(userId, pageable);
        return posts.map(this::mapToDto);
    }

    @Override
    public Page<PostDto> findAllPost(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findAllPosts(pageable);
        return posts.map(this::mapToDto);
    }

    @Override
    public PostDto findPostById(Long postId) throws Exception {
        Post post = findPostEntityById(postId);
        return mapToDto(post);
    }

    @Override
    public PostDto savePost(Long postId, Long userId) throws Exception {
        Post post = findPostEntityById(postId);
        User user = userService.findUserById(userId);

        if (user.getSavedPost().contains(post)) {
            user.getSavedPost().remove(post);
        } else {
            user.getSavedPost().add(post);
        }
        userRepository.save(user);
        
        return mapToDto(post);
    }

    @Override
    public PostDto likePost(Long postId, Long userId) throws Exception {
        Post post = findPostEntityById(postId);
        User user = userService.findUserById(userId);

        if (post.getLikedUsers().contains(user)) {
            post.getLikedUsers().remove(user);
        } else {
            post.getLikedUsers().add(user);

            notificationService.createNotification(
                post.getUser(),              
                user,                        
                NotificationType.LIKE_POST,  
                "liked your post",           
                post.getId()                 
            );
        }
        
        Post savedPost = postRepository.save(post);
        return mapToDto(savedPost);
    }
    // ---------------------------------

    private Post findPostEntityById(Long postId) throws Exception {
        return postRepository.findById(postId)
                .orElseThrow(() -> new Exception("Post not found with id " + postId));
    }

    private PostDto mapToDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setCaption(post.getCaption());
        dto.setImage(post.getImage());
        dto.setVideo(post.getVideo());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setTotalComments(post.getComments().size());
        
        User u = post.getUser();
        UserDto userDto = new UserDto();
        userDto.setId(u.getId());
        userDto.setFirstName(u.getFirstName());
        userDto.setLastName(u.getLastName());
        userDto.setImage(u.getImage());
        userDto.setEmail(u.getEmail());
        dto.setUser(userDto);
        
        dto.setLikedUserIds(post.getLikedUsers().stream()
                .map(User::getId)
                .collect(Collectors.toList()));

        if (post.getComments() != null && !post.getComments().isEmpty()) {
            List<CommentDto> commentDtos = post.getComments().stream().map(comment -> {
                CommentDto cDto = new CommentDto();
                cDto.setId(comment.getId());
                cDto.setContent(comment.getContent());
                cDto.setCreatedAt(comment.getCreatedAt());

                User commentUser = comment.getUser();
                UserDto cuDto = new UserDto();
                cuDto.setId(commentUser.getId());
                cuDto.setFirstName(commentUser.getFirstName());
                cuDto.setLastName(commentUser.getLastName());
                cuDto.setImage(commentUser.getImage());
                cuDto.setEmail(commentUser.getEmail());
                
                cDto.setUser(cuDto);
                
                return cDto;
            }).collect(Collectors.toList());
            
            dto.setComments(commentDtos);
            dto.setTotalComments(commentDtos.size());
        } else {
            dto.setComments(new ArrayList<>());
            dto.setTotalComments(0);
        }
        
        return dto;
    }

    @Override
    public List<Post> searchPost(String query) {
        return postRepository.searchPost(query);
    }
}