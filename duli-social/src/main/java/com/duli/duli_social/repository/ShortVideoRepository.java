package com.duli.duli_social.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.duli.duli_social.models.ShortVideo;

public interface ShortVideoRepository extends JpaRepository<ShortVideo, Long> {

    // Lấy video của 1 user cụ thể (có phân trang)
    @Query("SELECT sv FROM ShortVideo sv WHERE sv.user.id = :userId ORDER BY sv.createdAt DESC")
    Page<ShortVideo> findShortVideoByUserId(@Param("userId") Long userId, Pageable pageable);
    
    // Lấy tất cả video (Reels Feed) - Sắp xếp mới nhất trước
    @Query("SELECT sv FROM ShortVideo sv ORDER BY sv.createdAt DESC")
    Page<ShortVideo> findAllShortVideos(Pageable pageable);
}