package com.turkcell.ecommerce.controller;

import com.turkcell.ecommerce.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.OffsetDateTime;
import java.util.Collections;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @GetMapping
    public ResponseEntity<ProductPageResponse> listProducts(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String q
    ) {
        // TODO: Implement business logic
        ProductPageResponse response = ProductPageResponse.builder()
                .items(Collections.emptyList())
                .page(page)
                .size(size)
                .totalElements(0L)
                .totalPages(0)
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request
    ) {
        // TODO: Implement business logic
        Product product = Product.builder()
                .id("prd_temp")
                .sku(request.getSku())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .currency(request.getCurrency())
                .inStock(request.getInStock())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        ProductResponse response = ProductResponse.builder()
                .product(product)
                .build();

        return ResponseEntity
                .created(URI.create("/api/v1/products/" + product.getId()))
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(
            @PathVariable String id
    ) {
        // TODO: Implement business logic
        Product product = Product.builder()
                .id(id)
                .name("Sample Product")
                .price(99.99)
                .currency("USD")
                .inStock(true)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        ProductResponse response = ProductResponse.builder()
                .product(product)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> replaceProduct(
            @PathVariable String id,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        // TODO: Implement business logic
        Product product = Product.builder()
                .id(id)
                .sku(request.getSku())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .currency(request.getCurrency())
                .inStock(request.getInStock())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        ProductResponse response = ProductResponse.builder()
                .product(product)
                .build();

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProductResponse> patchProduct(
            @PathVariable String id,
            @Valid @RequestBody PatchProductRequest request
    ) {
        // TODO: Implement business logic
        Product product = Product.builder()
                .id(id)
                .name(request.getName() != null ? request.getName() : "Sample Product")
                .price(request.getPrice() != null ? request.getPrice() : 99.99)
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .inStock(request.getInStock() != null ? request.getInStock() : true)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        ProductResponse response = ProductResponse.builder()
                .product(product)
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable String id
    ) {
        // TODO: Implement business logic
        return ResponseEntity.noContent().build();
    }
}
