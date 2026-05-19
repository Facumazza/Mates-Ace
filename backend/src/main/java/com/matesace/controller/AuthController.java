package com.matesace.controller;

import com.matesace.dto.AuthResponse;
import com.matesace.dto.LoginRequest;
import com.matesace.dto.RegisterRequest;
import com.matesace.entity.User;
import com.matesace.security.JwtUtil;
import com.matesace.security.RateLimiterService;
import com.matesace.security.TokenBlacklistService;
import com.matesace.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;
    private final RateLimiterService rateLimiter;
    private final TokenBlacklistService blacklist;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService service, RateLimiterService rateLimiter,
                          TokenBlacklistService blacklist, JwtUtil jwtUtil) {
        this.service = service;
        this.rateLimiter = rateLimiter;
        this.blacklist = blacklist;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(HttpServletRequest req, @RequestBody RegisterRequest body) {
        if (!rateLimiter.tryConsume("register:" + req.getRemoteAddr()))
            return ResponseEntity.status(429).body(Map.of("error", "Demasiados intentos. Esperá un minuto."));
        try { return ResponseEntity.ok(service.register(body)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(HttpServletRequest req, @RequestBody LoginRequest body) {
        if (!rateLimiter.tryConsume("login:" + req.getRemoteAddr()))
            return ResponseEntity.status(429).body(Map.of("error", "Demasiados intentos. Esperá un minuto."));
        try { return ResponseEntity.ok(service.login(body)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest req) {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.isValid(token)) {
                blacklist.revoke(token, jwtUtil.getExpiration(token));
            }
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(new AuthResponse.UserDto(
                user.getId(), user.getName(), user.getEmail(), user.getRole()));
    }

    @PatchMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User user,
                                           @RequestBody Map<String, String> body) {
        if (user == null) return ResponseEntity.status(401).build();
        try { return ResponseEntity.ok(service.updateName(user, body.get("name"))); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }
}
