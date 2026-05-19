package com.matesace.service;

import com.matesace.dto.ProductRequest;
import com.matesace.entity.Product;
import com.matesace.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) { this.repo = repo; }

    public List<Product> getAll() { return repo.findAll(); }

    public Product getBySlug(String slug) {
        return repo.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado."));
    }

    public Product create(ProductRequest req) {
        return repo.save(map(new Product(), req));
    }

    public Product update(Long id, ProductRequest req) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado."));
        return repo.save(map(p, req));
    }

    public void delete(Long id) { repo.deleteById(id); }

    private Product map(Product p, ProductRequest req) {
        p.setName(req.name());
        p.setSlug(req.slug() != null && !req.slug().isBlank() ? req.slug() : slugify(req.name()));
        p.setCategory(req.category());
        p.setSubcategory(req.subcategory());
        p.setDescription(req.description());
        p.setPrice(req.price());
        p.setOriginalPrice(req.originalPrice());
        p.setImages(req.images());
        p.setFeatures(req.features());
        p.setVariantsJson(req.variantsJson());
        p.setBadge(req.badge());
        p.setInStock(req.inStock() != null ? req.inStock() : true);
        p.setStock(req.stock());
        p.setWeight(req.weight());
        p.setDimensions(req.dimensions());
        return p;
    }

    private String slugify(String name) {
        return name.toLowerCase()
                .replaceAll("[áàäâã]", "a").replaceAll("[éèëê]", "e")
                .replaceAll("[íìïî]", "i").replaceAll("[óòöôõ]", "o")
                .replaceAll("[úùüû]", "u").replaceAll("[ñ]", "n")
                .replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-").trim();
    }
}
