package com.matesace.controller;

import com.matesace.entity.User;
import com.matesace.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService service;

    public ReviewController(ReviewService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(service.getByProduct(productId));
    }

    @GetMapping("/summary")
    public ResponseEntity<?> summary() {
        return ResponseEntity.ok(service.getSummary());
    }

    @GetMapping("/summary/product/{productId}")
    public ResponseEntity<?> summaryByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(service.getSummaryByProduct(productId));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllForAdmin() {
        return ResponseEntity.ok(service.getAllForAdmin());
    }

    @PatchMapping("/{id}/hidden")
    public ResponseEntity<?> toggleHidden(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.toggleHidden(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal User user,
                                    @RequestBody Map<String, Object> body) {
        if (user == null) return ResponseEntity.status(401).build();
        try {
            int rating = ((Number) body.get("rating")).intValue();
            String comment = (String) body.get("comment");
            String productId = body.get("productId") != null ? String.valueOf(body.get("productId")) : null;
            return ResponseEntity.ok(service.create(user, rating, comment, productId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
