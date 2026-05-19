package com.matesace.controller;

import com.matesace.entity.User;
import com.matesace.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService service;

    public WishlistController(WishlistService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<?> get(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(Map.of("items", service.get(user.getId())));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> add(@PathVariable String productId,
                                 @AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        service.add(user.getId(), productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> remove(@PathVariable String productId,
                                    @AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        service.remove(user.getId(), productId);
        return ResponseEntity.ok().build();
    }
}
