package com.matesace.service;

import com.matesace.entity.Review;
import com.matesace.entity.User;
import com.matesace.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    private final ReviewRepository repo;

    public ReviewService(ReviewRepository repo) { this.repo = repo; }

    public List<Review> getAll() {
        return repo.findByHiddenFalseOrderByCreatedAtDesc();
    }

    public List<Review> getAllForAdmin() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    public List<Review> getByProduct(String productId) {
        return repo.findByProductIdAndHiddenFalseOrderByCreatedAtDesc(productId);
    }

    public Map<String, Object> getSummary() {
        long count = repo.findByHiddenFalseOrderByCreatedAtDesc().size();
        Double avg = repo.averageRating();
        return Map.of(
            "count", count,
            "average", avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0
        );
    }

    public Map<String, Object> getSummaryByProduct(String productId) {
        long count = repo.findByProductIdAndHiddenFalseOrderByCreatedAtDesc(productId).size();
        Double avg = repo.averageRatingByProductId(productId);
        return Map.of(
            "count", count,
            "average", avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0
        );
    }

    public Review toggleHidden(Long id) {
        Review review = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Reseña no encontrada."));
        review.setHidden(!review.isHidden());
        return repo.save(review);
    }

    public Review create(User user, int rating, String comment, String productId) {
        if (repo.existsByUserId(user.getId())) throw new IllegalArgumentException("Ya dejaste una reseña.");
        if (rating < 1 || rating > 5) throw new IllegalArgumentException("La calificación debe ser entre 1 y 5.");
        if (comment == null || comment.isBlank()) throw new IllegalArgumentException("El comentario no puede estar vacío.");
        if (comment.length() > 1000) throw new IllegalArgumentException("El comentario es demasiado largo.");

        Review review = new Review();
        review.setUserId(user.getId());
        review.setUserName(user.getName());
        review.setRating(rating);
        review.setComment(comment.trim());
        review.setProductId(productId);
        return repo.save(review);
    }
}
