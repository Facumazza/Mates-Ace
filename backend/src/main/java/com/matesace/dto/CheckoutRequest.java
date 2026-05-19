package com.matesace.dto;

import java.util.List;

public record CheckoutRequest(
        List<CheckoutItem> items,
        String shippingFirstName,
        String shippingLastName,
        String shippingPhone,
        String shippingAddress
) {
    public record CheckoutItem(String name, String productId, int quantity, double unitPrice, String variant) {}
}
