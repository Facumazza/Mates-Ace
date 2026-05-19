package com.matesace.dto;

import java.util.List;

public record ProductRequest(
    String name, String slug, String category, String subcategory,
    String description, Double price, Double originalPrice,
    List<String> images, List<String> features, String variantsJson,
    String badge, Boolean inStock, Integer stock, Double weight, String dimensions
) {}
