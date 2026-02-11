package com.duli.duli_social.service;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import com.duli.duli_social.dto.CommentDto;
import com.duli.duli_social.dto.UserDto;
import com.duli.duli_social.models.NotificationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duli.duli_social.models.Comment;
import com.duli.duli_social.models.Post;
import com.duli.duli_social.models.ShortVideo;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.CommentRepository;
import com.duli.duli_social.repository.PostRepository;
import com.duli.duli_social.repository.ShortVideoRepository;

@Service
public class CommentServiceImplementation implements CommentService {

    @Autowired
    private UserService userService;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ShortVideoRepository shortVideoRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    @Transactional
    public CommentDto createComment(Comment comment, Long postId, Long userId) throws Exception {
        User user = userService.findUserById(userId);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new Exception("Post not found"));

        Comment newComment = new Comment();
        newComment.setUser(user);
        newComment.setContent(comment.getContent());
        newComment.setPost(post);
        newComment.setCreatedAt(LocalDateTime.now());

        Comment savedComment = commentRepository.save(newComment);
        
        notificationService.createNotification(
            post.getUser(),                
            user,                           
            NotificationType.COMMENT_POST,  
            "commented on your post: " + comment.getContent(), 
            post.getId()                    
        );

        return mapToDto(savedComment);
    }

    @Override
    @Transactional
    public CommentDto createCommentInShortVideo(Comment comment, Long shortVideoId, Long userId) throws Exception {
        User user = userService.findUserById(userId);
        ShortVideo video = shortVideoRepository.findById(shortVideoId)
                .orElseThrow(() -> new Exception("Short video not found"));

        Comment newComment = new Comment();
        newComment.setUser(user);
        newComment.setContent(comment.getContent());
        newComment.setShortVideo(video);
        newComment.setCreatedAt(LocalDateTime.now());

        Comment savedComment = commentRepository.save(newComment);
        

        return mapToDto(savedComment);
    }

    @Override
    public CommentDto likeComment(Long commentId, Long userId) throws Exception {
        Comment comment = findEntityById(commentId);
        User user = userService.findUserById(userId);

        if (comment.getLikedUsers().contains(user)) {
            comment.getLikedUsers().remove(user);
        } else {
            comment.getLikedUsers().add(user);

            Long relatedId = (comment.getPost() != null) ? comment.getPost().getId() : 
                             (comment.getShortVideo() != null ? comment.getShortVideo().getId() : null);

            notificationService.createNotification(
                comment.getUser(),               
                user,                            
                NotificationType.LIKE_COMMENT,   
                "liked your comment.",          
                relatedId                        
            );
        }

        Comment savedComment = commentRepository.save(comment);
        return mapToDto(savedComment);
    }

    @Override
    public CommentDto findCommentById(Long commentId) throws Exception {
        Comment comment = findEntityById(commentId);
        return mapToDto(comment);
    }
    
    private Comment findEntityById(Long commentId) throws Exception {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new Exception("Comment not found"));
    }

    private CommentDto mapToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        
        User u = comment.getUser();
        UserDto userDto = new UserDto();
        userDto.setId(u.getId());
        userDto.setFirstName(u.getFirstName());
        userDto.setLastName(u.getLastName());
        userDto.setImage(u.getImage());
        dto.setUser(userDto);
        
        dto.setLikedUserIds(comment.getLikedUsers().stream()
                .map(User::getId)
                .collect(Collectors.toList()));
        
        if (comment.getPost() != null) dto.setPostId(comment.getPost().getId());
        if (comment.getShortVideo() != null) dto.setShortVideoId(comment.getShortVideo().getId());
        
        return dto;
    }
}