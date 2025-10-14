package com.duli.duli_social.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.duli.duli_social.repository.UserRepository;
import org.hibernate.type.descriptor.java.LocalDateTimeJavaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duli.duli_social.models.Post;
import com.duli.duli_social.models.User;
import com.duli.duli_social.repository.PostRepository;

@Service
public class PostServiceImplementation implements PostService{

    private final UserRepository userRepository;
    //do đã dùng repository extend từ jpa nên sẽ không cần viết lệnh sql, chỉ cần gọi postRepository rồi dùng method là được
    @Autowired
    PostRepository postRepository;

    @Autowired
    UserService userService;

    @Autowired
    UserRepository usRepository;

    PostServiceImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Post createPost(Post post, Integer userId) throws Exception {

        User user = userService.findUserById(userId);

        Post newPost=new Post();
        newPost.setCaption(post.getCaption());
        newPost.setImage(post.getImage());
        newPost.setVideo(post.getVideo());
        newPost.setUser(user);
        newPost.setCreatedAt(LocalDateTime.now());
        return postRepository.save(newPost);
    }

    @Override
    @Transactional
    public String deletePost(Integer postId, Integer userId) throws Exception {
        Post post=findPostById(postId);
        User user=userService.findUserById(userId);
        
        if(post.getUser().getId()!=user.getId()) {
            throw new Exception("cant delete because this post's not yours");
        }
        //phải xóa hết ở các bảng liên quan (users_saves_post) vì nếu không xóa thì khi xóa post, danh sách saved của user sẽ trỏ vào 1 post không tồn tại
        userRepository.unsavePostFromAllUsers(postId);

        postRepository.delete(post);
        return "post deleted successfully";
    }

    @Override
    public List<Post> findPostByUserId(Integer userId) throws Exception {
        
        return postRepository.findPostByUserId(userId);
    }

    @Override
    public Post findPostById(Integer postId) throws Exception {
        //do findById trong jpa trả về Optional<Post> mà không trả về trực tiếp dữ liệu dạng Post nên phải đặt là thế
        //ưu điểm là tránh null
        Optional<Post> otp=postRepository.findById(postId);
        //thêm vào cho chắc
        if(otp.isEmpty()) {
            throw new Exception("post not found with id " + postId);
        }
        return otp.get();
    }

    @Override
    public List<Post> findAllPost() {
        
        return postRepository.findAll();
    }

    @Override
    public Post savePost(Integer postId, Integer userId) throws Exception {
        Post post=findPostById(postId);
        User user=userService.findUserById(userId);
        if(user.getSavedPost().contains(post)) {
            user.getSavedPost().remove(post);
        }
        else 
            user.getSavedPost().add(post);
        
        userRepository.save(user);
        return post;
    }

    @Override
    public Post likePost(Integer postId, Integer userId) throws Exception {        
        Post post=findPostById(postId);
        User user=userService.findUserById(userId);
        if(post.getLikedUser().contains(user)) {
            post.getLikedUser().remove(user);
        }
        else {
            post.getLikedUser().add(user);
        }
        
        return postRepository.save(post);
    }

}
