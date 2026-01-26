package com.turkcell.ecommerce.service;

import com.turkcell.ecommerce.dto.*;
import com.turkcell.ecommerce.entity.ProductEntity;
import com.turkcell.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public ProductPageResponse listProducts(Integer page, Integer size, String sort, String q) {
        Pageable pageable = createPageable(page, size, sort);
        Page<ProductEntity> productPage = productRepository.findByQuery(q, pageable);

        return ProductPageResponse.builder()
                .items(productPage.getContent().stream()
                        .map(this::toDto)
                        .toList())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();
    }

    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        ProductEntity entity = ProductEntity.builder()
                .sku(request.getSku())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .currency(request.getCurrency())
                .inStock(request.getInStock())
                .build();

        ProductEntity saved = productRepository.save(entity);
        return ProductResponse.builder()
                .product(toDto(saved))
                .build();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(String id) {
        ProductEntity entity = findProductById(id);
        return ProductResponse.builder()
                .product(toDto(entity))
                .build();
    }

    @Transactional
    public ProductResponse replaceProduct(String id, UpdateProductRequest request) {
        ProductEntity entity = findProductById(id);
        entity.setSku(request.getSku());
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setPrice(request.getPrice());
        entity.setCurrency(request.getCurrency());
        entity.setInStock(request.getInStock());

        ProductEntity updated = productRepository.save(entity);
        return ProductResponse.builder()
                .product(toDto(updated))
                .build();
    }

    @Transactional
    public ProductResponse patchProduct(String id, PatchProductRequest request) {
        ProductEntity entity = findProductById(id);

        if (request.getSku() != null) {
            entity.setSku(request.getSku());
        }
        if (request.getName() != null) {
            entity.setName(request.getName());
        }
        if (request.getDescription() != null) {
            entity.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            entity.setPrice(request.getPrice());
        }
        if (request.getCurrency() != null) {
            entity.setCurrency(request.getCurrency());
        }
        if (request.getInStock() != null) {
            entity.setInStock(request.getInStock());
        }

        ProductEntity updated = productRepository.save(entity);
        return ProductResponse.builder()
                .product(toDto(updated))
                .build();
    }

    @Transactional
    public void deleteProduct(String id) {
        ProductEntity entity = findProductById(id);
        productRepository.delete(entity);
    }

    private ProductEntity findProductById(String id) {
        Long productId;
        try {
            productId = Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }

        return productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    private Product toDto(ProductEntity entity) {
        return Product.builder()
                .id("prd_" + entity.getId())
                .sku(entity.getSku())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .currency(entity.getCurrency())
                .inStock(entity.getInStock())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private Pageable createPageable(Integer page, Integer size, String sort) {
        if (sort != null && !sort.isBlank()) {
            String[] sortParts = sort.split(",");
            String field = sortParts[0];
            Sort.Direction direction = sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1])
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            return PageRequest.of(page, size, Sort.by(direction, field));
        }
        return PageRequest.of(page, size);
    }
}
