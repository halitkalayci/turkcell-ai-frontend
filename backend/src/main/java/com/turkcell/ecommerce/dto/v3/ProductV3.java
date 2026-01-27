package com.turkcell.ecommerce.dto.v3;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

/**
 * Product V3 DTO (with category)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductV3 {
    private String id;
    private String sku;
    private String name;
    private String description;
    private Double price;
    private String currency;
    private Boolean inStock;
    private String imageUrl;
    private Double discountPercent;
    private Double rating;
    private CategoryRefV3 category;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
