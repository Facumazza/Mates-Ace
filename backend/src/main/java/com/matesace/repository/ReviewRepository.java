package com.matesace.repository;

import com.matesace.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByOrderByCreatedAtDesc();
    List<Review> findByProductIdOrderByCreatedAtDesc(String productId);
    List<Review> findByProductIdIsNullOrderByCreatedAtDesc();
    boolean existsByUserId(Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r")
    Double averageRating();

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId")
    Double averageRatingByProductId(String productId);
}
