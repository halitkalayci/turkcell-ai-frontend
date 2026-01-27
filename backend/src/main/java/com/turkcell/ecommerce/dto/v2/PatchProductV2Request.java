package com.turkcell.ecommerce.dto.v2;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatchProductV2Request {

    private String sku;

    @Size(min = 3, max = 120)
    private String name;

    @Size(max = 2000)
    private String description;

    @DecimalMin(value = "0.0", inclusive = true)
    private Double price;

    @Size(min = 3, max = 3)
    private String currency;

    private Boolean inStock;

    // Optional new fields in v2
    private String imageUrl;

    @DecimalMin(value = "0.0", inclusive = true)
    @DecimalMax(value = "100.0", inclusive = true)
    private Double discountPercent;

    @DecimalMin(value = "0.0", inclusive = true)
    @DecimalMax(value = "5.0", inclusive = true)
    private Double rating;
}