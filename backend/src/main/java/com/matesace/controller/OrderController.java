package com.matesace.controller;

import com.matesace.dto.OrderRequest;
import com.matesace.entity.User;
import com.matesace.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody OrderRequest req,
                                    @AuthenticationPrincipal User user) {
        try { return ResponseEntity.ok(service.create(req, user)); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    @GetMapping("/mine")
    public ResponseEntity<?> mine(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getByUser(user.getId()));
    }

    @GetMapping
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody Map<String, String> body) {
        try { return ResponseEntity.ok(service.updateStatus(id, body.get("status"))); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }
}
