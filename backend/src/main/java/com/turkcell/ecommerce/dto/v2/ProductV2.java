package com.turkcell.ecommerce.dto.v2;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductV2 {

    @NotNull
    private String id;

    private String sku;

    @NotNull
    @Size(min = 3, max = 120)
    private String name;

    @Size(max = 2000)
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private Double price;

    @NotNull
    @Size(min = 3, max = 3)
    private String currency;

    @NotNull
    private Boolean inStock;

    // New v2 fields (not marked @NotNull to allow legacy/null data)
    private String imageUrl;

    @DecimalMin(value = "0.0", inclusive = true)
    @DecimalMax(value = "100.0", inclusive = true)
    private Double discountPercent;

    @DecimalMin(value = "0.0", inclusive = true)
    @DecimalMax(value = "5.0", inclusive = true)
    private Double rating;

    @NotNull
    private OffsetDateTime createdAt;

    @NotNull
    private OffsetDateTime updatedAt;
}