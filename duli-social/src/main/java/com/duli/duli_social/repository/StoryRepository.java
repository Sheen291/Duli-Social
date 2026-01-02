package com.duli.duli_social.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.duli.duli_social.models.Story;

public interface StoryRepository extends JpaRepository<Story, Long> {

    List<Story> findByUserIdAndCreatedAtAfter(Long userId, LocalDateTime timestamp);
    
    @Query("SELECT s FROM Story s WHERE s.user.id IN :usersId AND s.createdAt > :time")
    List<Story> findStoryByUserIds(@Param("usersId") List<Long> usersId, @Param("time") LocalDateTime time);
}