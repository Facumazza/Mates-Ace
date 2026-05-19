package com.matesace.service;

import com.matesace.dto.AuthResponse;
import com.matesace.dto.LoginRequest;
import com.matesace.dto.RegisterRequest;
import com.matesace.entity.User;
import com.matesace.repository.UserRepository;
import com.matesace.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtUtil jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public AuthResponse register(RegisterRequest req) {
        if (users.existsByEmail(req.email().toLowerCase().trim()))
            throw new IllegalArgumentException("Ya existe una cuenta con ese email.");

        User user = new User();
        user.setName(req.name().trim());
        user.setEmail(req.email().toLowerCase().trim());
        user.setPassword(encoder.encode(req.password()));
        user.setRole("USER");
        user = users.save(user);

        return toResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = users.findByEmail(req.email().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Email o contraseña incorrectos."));
        if (!encoder.matches(req.password(), user.getPassword()))
            throw new IllegalArgumentException("Email o contraseña incorrectos.");
        return toResponse(user);
    }

    public AuthResponse updateName(User user, String name) {
        user.setName(name.trim());
        user = users.save(user);
        return toResponse(user);
    }

    private AuthResponse toResponse(User user) {
        String token = jwt.generate(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, new AuthResponse.UserDto(
                user.getId(), user.getName(), user.getEmail(), user.getRole()));
    }
}
