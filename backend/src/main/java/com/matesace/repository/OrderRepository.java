package com.matesace.repository;

import com.matesace.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByDateDesc(Long userId);
    List<Order> findAllByOrderByDateDesc();
}
