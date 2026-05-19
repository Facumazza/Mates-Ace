package com.matesace.service;

import com.matesace.dto.OrderRequest;
import com.matesace.entity.Order;
import com.matesace.entity.OrderItem;
import com.matesace.entity.User;
import com.matesace.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository repo;
    private final EmailService emailService;

    public OrderService(OrderRepository repo, EmailService emailService) {
        this.repo = repo;
        this.emailService = emailService;
    }

    public Order create(OrderRequest req, User user) {
        Order order = new Order();
        order.setUserId(user.getId());
        order.setTotal(req.total());
        order.setChannel(req.channel());
        order.setStatus("pendiente");
        order.setShippingFirstName(req.shippingFirstName());
        order.setShippingLastName(req.shippingLastName());
        order.setShippingPhone(req.shippingPhone());
        order.setShippingAddress(req.shippingAddress());

        List<OrderItem> items = req.items().stream().map(i -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(i.productId());
            item.setProductName(i.productName());
            item.setProductPrice(i.productPrice());
            item.setQuantity(i.quantity());
            item.setSubtotal(i.subtotal());
            item.setVariant(i.variant());
            return item;
        }).collect(Collectors.toList());

        order.setItems(items);
        return repo.save(order);
    }

    public List<Order> getByUser(Long userId) {
        return repo.findByUserIdOrderByDateDesc(userId);
    }

    public List<Order> getAll() {
        return repo.findAllByOrderByDateDesc();
    }

    private static final Set<String> VALID_STATUSES = Set.of("pendiente", "procesando", "enviado", "completado", "cancelado");

    public Order updateStatus(Long id, String status) {
        if (!VALID_STATUSES.contains(status))
            throw new IllegalArgumentException("Estado inválido: " + status);
        Order order = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada."));
        order.setStatus(status);
        Order saved = repo.save(order);
        emailService.sendStatusUpdate(saved);
        return saved;
    }
}
