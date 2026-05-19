package com.matesace.service;

import com.matesace.entity.WishlistItem;
import com.matesace.repository.WishlistItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistItemRepository repo;

    public WishlistService(WishlistItemRepository repo) { this.repo = repo; }

    public List<String> get(Long userId) {
        return repo.findByUserId(userId).stream()
                .map(WishlistItem::getProductId)
                .collect(Collectors.toList());
    }

    public void add(Long userId, String productId) {
        if (repo.findByUserIdAndProductId(userId, productId).isEmpty()) {
            WishlistItem item = new WishlistItem();
            item.setUserId(userId);
            item.setProductId(productId);
            repo.save(item);
        }
    }

    @Transactional
    public void remove(Long userId, String productId) {
        repo.deleteByUserIdAndProductId(userId, productId);
    }
}
