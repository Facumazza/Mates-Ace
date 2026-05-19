package com.matesace.repository;

import com.matesace.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUserId(Long userId);
    Optional<WishlistItem> findByUserIdAndProductId(Long userId, String productId);
    void deleteByUserIdAndProductId(Long userId, String productId);
}
