package com.matesace.security;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    // token → expiration timestamp (ms)
    private final ConcurrentHashMap<String, Long> revoked = new ConcurrentHashMap<>();

    public void revoke(String token, long expiresAt) {
        revoked.put(token, expiresAt);
    }

    public boolean isRevoked(String token) {
        Long exp = revoked.get(token);
        if (exp == null) return false;
        if (exp < System.currentTimeMillis()) {
            revoked.remove(token);
            return false;
        }
        return true;
    }
}
