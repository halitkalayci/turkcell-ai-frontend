package com.turkcell.ecommerce.service;

import com.turkcell.ecommerce.dto.v3.*;
import com.turkcell.ecommerce.entity.CategoryEntity;
import com.turkcell.ecommerce.entity.ProductEntity;
import com.turkcell.ecommerce.exception.ResourceNotFoundException;
import com.turkcell.ecommerce.repository.CategoryRepository;
import com.turkcell.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for Product V3 business logic (with category support)
 */
@Service
@RequiredArgsConstructor
public class ProductServiceV3 {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Get all products with pagination and optional filtering
     */
    @Transactional(readOnly = true)
    public ProductPageResponseV3 getAllProducts(Integer page, Integer size, String sort, String query, Long categoryId) {
        Pageable pageable = createPageable(page, size, sort);

        Page<ProductEntity> productPage;
        if (query != null || categoryId != null) {
            productPage = productRepository.findByQueryAndCategoryId(query, categoryId, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        return ProductPageResponseV3.builder()
                .items(productPage.getContent().stream()
                        .map(this::toProductV3)
                        .toList())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();
    }

    /**
     * Get product by ID
     */
    @Transactional(readOnly = true)
    public ProductResponseV3 getProductById(Long id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return ProductResponseV3.builder()
                .product(toProductV3(product))
                .build();
    }

    /**
     * Create new product
     */
    @Transactional
    public ProductResponseV3 createProduct(CreateProductV3Request request) {
        // Validate category exists
        CategoryEntity category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        ProductEntity product = ProductEntity.builder()
                .sku(request.getSku())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .currency(request.getCurrency())
                .inStock(request.getInStock())
                .imageUrl(request.getImageUrl())
                .discountPercent(request.getDiscountPercent())
                .rating(request.getRating())
                .category(category)
                .build();

        ProductEntity saved = productRepository.save(product);
        return ProductResponseV3.builder()
                .product(toProductV3(saved))
                .build();
    }

    /**
     * Update product (full update)
     */
    @Transactional
    public ProductResponseV3 updateProduct(Long id, UpdateProductV3Request request) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Validate category exists
        CategoryEntity category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCurrency(request.getCurrency());
        product.setInStock(request.getInStock());
        product.setImageUrl(request.getImageUrl());
        product.setDiscountPercent(request.getDiscountPercent());
        product.setRating(request.getRating());
        product.setCategory(category);

        ProductEntity updated = productRepository.save(product);
        return ProductResponseV3.builder()
                .product(toProductV3(updated))
                .build();
    }

    /**
     * Patch product (partial update)
     */
    @Transactional
    public ProductResponseV3 patchProduct(Long id, PatchProductV3Request request) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (request.getSku() != null) {
            product.setSku(request.getSku());
        }
        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getCurrency() != null) {
            product.setCurrency(request.getCurrency());
        }
        if (request.getInStock() != null) {
            product.setInStock(request.getInStock());
        }
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }
        if (request.getDiscountPercent() != null) {
            product.setDiscountPercent(request.getDiscountPercent());
        }
        if (request.getRating() != null) {
            product.setRating(request.getRating());
        }
        if (request.getCategoryId() != null) {
            CategoryEntity category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        ProductEntity updated = productRepository.save(product);
        return ProductResponseV3.builder()
                .product(toProductV3(updated))
                .build();
    }

    /**
     * Delete product
     */
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    /**
     * Convert entity to ProductV3 DTO
     */
    private ProductV3 toProductV3(ProductEntity entity) {
        return ProductV3.builder()
                .id(String.valueOf(entity.getId()))
                .sku(entity.getSku())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .currency(entity.getCurrency())
                .inStock(entity.getInStock())
                .imageUrl(entity.getImageUrl())
                .discountPercent(entity.getDiscountPercent())
                .rating(entity.getRating())
                .category(CategoryRefV3.builder()
                        .id(String.valueOf(entity.getCategory().getId()))
                        .name(entity.getCategory().getName())
                        .build())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    /**
     * Create pageable with sort
     */
    private Pageable createPageable(Integer page, Integer size, String sortParam) {
        if (sortParam != null && !sortParam.isEmpty()) {
            String[] sortParts = sortParam.split(",");
            String field = sortParts[0];
            Sort.Direction direction = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc")
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            return PageRequest.of(page, size, Sort.by(direction, field));
        }
        return PageRequest.of(page, size);
    }
}
