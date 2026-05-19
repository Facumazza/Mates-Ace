package com.matesace.security;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class RateLimiterService {

    private static final int MAX_REQUESTS = 5;
    private static final long WINDOW_MS = 60_000;

    // key (ip:endpoint) → [windowStart, count]
    private final ConcurrentHashMap<String, long[]> buckets = new ConcurrentHashMap<>();

    public RateLimiterService() {
        Executors.newSingleThreadScheduledExecutor()
                .scheduleAtFixedRate(this::cleanup, WINDOW_MS, WINDOW_MS, TimeUnit.MILLISECONDS);
    }

    public boolean tryConsume(String key) {
        long now = System.currentTimeMillis();
        long[] bucket = buckets.compute(key, (k, b) -> {
            if (b == null || now - b[0] >= WINDOW_MS) {
                return new long[]{now, 1};
            }
            b[1]++;
            return b;
        });
        return bucket[1] <= MAX_REQUESTS;
    }

    private void cleanup() {
        long now = System.currentTimeMillis();
        buckets.entrySet().removeIf(e -> now - e.getValue()[0] >= WINDOW_MS);
    }
}
