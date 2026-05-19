package com.matesace.controller;

import com.matesace.dto.CheckoutRequest;
import com.matesace.entity.User;
import com.matesace.service.CheckoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/mp")
    public ResponseEntity<?> createPreference(@RequestBody CheckoutRequest req,
                                              @AuthenticationPrincipal User user) {
        try {
            Map<String, Object> result = checkoutService.createOrderAndPreference(req, user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/transferencia")
    public ResponseEntity<?> createTransferOrder(@RequestBody CheckoutRequest req,
                                                 @AuthenticationPrincipal User user) {
        try {
            Map<String, Object> result = checkoutService.createTransferOrder(req, user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> webhook(@RequestBody Map<String, Object> body) {
        try {
            String type = (String) body.get("type");
            if (!"payment".equals(type)) return ResponseEntity.ok().build();

            @SuppressWarnings("unchecked")
            Map<String, Object> data = (Map<String, Object>) body.get("data");
            if (data == null) return ResponseEntity.ok().build();

            String paymentId = String.valueOf(data.get("id"));
            checkoutService.processPaymentWebhook(paymentId);
        } catch (Exception ignored) {
            // Always return 200 so MP doesn't retry indefinitely
        }
        return ResponseEntity.ok().build();
    }
}
