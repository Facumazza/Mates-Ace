package com.matesace.service;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import com.matesace.dto.CheckoutRequest;
import com.matesace.entity.Order;
import com.matesace.entity.OrderItem;
import com.matesace.entity.User;
import com.matesace.repository.OrderRepository;
import com.matesace.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class CheckoutService {

    @Value("${mp.access-token}")
    private String accessToken;

    @Value("${mp.success-url}")
    private String successUrl;

    @Value("${mp.failure-url}")
    private String failureUrl;

    @Value("${mp.pending-url}")
    private String pendingUrl;

    @Value("${bank.cvu:}")
    private String bankCvu;

    @Value("${bank.alias:}")
    private String bankAlias;

    @Value("${bank.name:}")
    private String bankName;

    @Value("${bank.holder:}")
    private String bankHolder;

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final EmailService emailService;

    public CheckoutService(ProductRepository productRepository, OrderRepository orderRepository, EmailService emailService) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.emailService = emailService;
    }

    private record Resolved(CheckoutRequest.CheckoutItem item, double price) {}

    public Map<String, Object> createOrderAndPreference(CheckoutRequest req, User user) throws Exception {
        MercadoPagoConfig.setAccessToken(accessToken);

        List<Resolved> resolved = req.items().stream()
                .map(i -> new Resolved(i, resolvePrice(i)))
                .toList();

        // Validate stock before creating order
        for (Resolved r : resolved) {
            if (r.item().productId() == null) continue;
            try {
                long id = Long.parseLong(r.item().productId());
                productRepository.findById(id).ifPresent(p -> {
                    if (p.getStock() != null && p.getStock() < r.item().quantity()) {
                        throw new IllegalStateException(
                            "Stock insuficiente para \"" + p.getName() + "\". Disponible: " + p.getStock());
                    }
                });
            } catch (NumberFormatException ignored) {}
        }

        double total = resolved.stream().mapToDouble(r -> r.price() * r.item().quantity()).sum();

        Order order = new Order();
        if (user != null) order.setUserId(user.getId());
        order.setTotal(total);
        order.setChannel("mercadopago");
        order.setStatus("pendiente");
        order.setShippingEmail(req.shippingEmail());
        order.setShippingFirstName(req.shippingFirstName());
        order.setShippingLastName(req.shippingLastName());
        order.setShippingPhone(req.shippingPhone());
        order.setShippingAddress(req.shippingAddress());

        List<OrderItem> orderItems = resolved.stream().map(r -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(r.item().productId());
            item.setProductName(r.item().name());
            item.setProductPrice(r.price());
            item.setQuantity(r.item().quantity());
            item.setSubtotal(r.price() * r.item().quantity());
            item.setVariant(r.item().variant());
            return item;
        }).toList();

        order.setItems(orderItems);
        Order saved = orderRepository.save(order);

        List<PreferenceItemRequest> mpItems = resolved.stream()
                .map(r -> PreferenceItemRequest.builder()
                        .title(r.item().name())
                        .quantity(r.item().quantity())
                        .unitPrice(BigDecimal.valueOf(r.price()))
                        .currencyId("ARS")
                        .build())
                .toList();

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success(successUrl)
                .failure(failureUrl)
                .pending(pendingUrl)
                .build();

        PreferenceRequest preferenceReq = PreferenceRequest.builder()
                .items(mpItems)
                .backUrls(backUrls)
                .externalReference(String.valueOf(saved.getId()))
                .autoReturn("approved")
                .build();

        Preference preference = new PreferenceClient().create(preferenceReq);

        saved.setPreferenceId(preference.getId());
        orderRepository.save(saved);

        return Map.of("url", preference.getInitPoint(), "orderId", saved.getId());
    }

    public void processPaymentWebhook(String paymentId) throws Exception {
        MercadoPagoConfig.setAccessToken(accessToken);
        Payment payment = new PaymentClient().get(Long.parseLong(paymentId));

        String externalRef = payment.getExternalReference();
        if (externalRef == null || externalRef.isEmpty()) return;

        String orderStatus = switch (payment.getStatus()) {
            case "approved" -> "procesando";
            case "rejected", "cancelled", "refunded", "charged_back" -> "cancelado";
            default -> "pendiente";
        };

        orderRepository.findById(Long.parseLong(externalRef)).ifPresent(order -> {
            order.setStatus(orderStatus);
            orderRepository.save(order);
            if ("procesando".equals(orderStatus)) {
                decreaseStock(order);
                emailService.sendOrderConfirmation(order);
            }
        });
    }

    private void decreaseStock(Order order) {
        if (order.getItems() == null) return;
        for (OrderItem item : order.getItems()) {
            if (item.getProductId() == null) continue;
            try {
                long productId = Long.parseLong(item.getProductId());
                productRepository.findById(productId).ifPresent(product -> {
                    if (product.getStock() != null) {
                        int newStock = Math.max(0, product.getStock() - item.getQuantity());
                        product.setStock(newStock);
                        if (newStock == 0) product.setInStock(false);
                        productRepository.save(product);
                    }
                });
            } catch (NumberFormatException ignored) {}
        }
    }

    public Map<String, Object> createTransferOrder(CheckoutRequest req, User user) {
        List<Resolved> resolved = req.items().stream()
                .map(i -> new Resolved(i, resolvePrice(i)))
                .toList();

        for (Resolved r : resolved) {
            if (r.item().productId() == null) continue;
            try {
                long id = Long.parseLong(r.item().productId());
                productRepository.findById(id).ifPresent(p -> {
                    if (p.getStock() != null && p.getStock() < r.item().quantity()) {
                        throw new IllegalStateException(
                            "Stock insuficiente para \"" + p.getName() + "\". Disponible: " + p.getStock());
                    }
                });
            } catch (NumberFormatException ignored) {}
        }

        double total = resolved.stream().mapToDouble(r -> r.price() * r.item().quantity()).sum();

        Order order = new Order();
        if (user != null) order.setUserId(user.getId());
        order.setTotal(total);
        order.setChannel("transferencia");
        order.setStatus("pendiente_transferencia");
        order.setShippingEmail(req.shippingEmail());
        order.setShippingFirstName(req.shippingFirstName());
        order.setShippingLastName(req.shippingLastName());
        order.setShippingPhone(req.shippingPhone());
        order.setShippingAddress(req.shippingAddress());

        List<OrderItem> orderItems = resolved.stream().map(r -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(r.item().productId());
            item.setProductName(r.item().name());
            item.setProductPrice(r.price());
            item.setQuantity(r.item().quantity());
            item.setSubtotal(r.price() * r.item().quantity());
            item.setVariant(r.item().variant());
            return item;
        }).toList();

        order.setItems(orderItems);
        Order saved = orderRepository.save(order);

        Map<String, Object> bankInfo = Map.of(
            "cvu",    bankCvu,
            "alias",  bankAlias,
            "bank",   bankName,
            "holder", bankHolder
        );

        emailService.sendTransferInstructions(saved, bankInfo);

        return Map.of("orderId", saved.getId(), "total", total, "bankInfo", bankInfo);
    }

    private double resolvePrice(CheckoutRequest.CheckoutItem item) {
        if (item.productId() != null) {
            try {
                long id = Long.parseLong(item.productId());
                return productRepository.findById(id)
                        .map(p -> p.getPrice())
                        .orElse(item.unitPrice());
            } catch (NumberFormatException ignored) {}
        }
        return item.unitPrice();
    }
}
