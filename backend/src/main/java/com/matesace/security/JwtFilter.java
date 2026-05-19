package com.matesace.security;

import com.matesace.repository.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final TokenBlacklistService blacklist;

    public JwtFilter(JwtUtil jwtUtil, UserRepository userRepository, TokenBlacklistService blacklist) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.blacklist = blacklist;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }

        String token = header.substring(7);
        if (!jwtUtil.isValid(token) || blacklist.isRevoked(token)) {
            chain.doFilter(req, res);
            return;
        }

        Claims claims = jwtUtil.parse(token);
        String email = claims.getSubject();
        String role  = claims.get("role", String.class);

        userRepository.findByEmail(email).ifPresent(user -> {
            var auth = new UsernamePasswordAuthenticationToken(
                    user, null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role)));
            SecurityContextHolder.getContext().setAuthentication(auth);
        });

        chain.doFilter(req, res);
    }
}
