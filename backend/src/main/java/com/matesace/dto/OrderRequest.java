package com.matesace.dto;

import java.util.List;

public record OrderRequest(List<ItemDto> items, Double total, String channel,
                           String shippingFirstName, String shippingLastName,
                           String shippingPhone, String shippingAddress) {
    public record ItemDto(
        String productId, String productName, Double productPrice,
        Integer quantity, Double subtotal, String variant
    ) {}
}
