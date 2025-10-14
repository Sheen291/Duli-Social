package com.duli.duli_social.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.duli.duli_social.models.Post;
//JpaRepository dùng để làm việc với database mà không cần viết SQL thủ công
//(tự động sinh ra các hàm cơ bản như findAll, findById, save, delete...)
public interface PostRepository extends JpaRepository<Post, Integer>{

    @Query("select p from Post p where p.user.id=:userId")
    List<Post> findPostByUserId(Integer userId);

}
