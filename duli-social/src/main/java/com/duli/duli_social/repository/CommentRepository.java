package com.duli.duli_social.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.duli.duli_social.models.Comment;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    
}
