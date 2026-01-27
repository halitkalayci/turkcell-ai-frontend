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
public class CreateProductV2Request {

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

    // Required new fields in v2
    @NotNull
    private String imageUrl;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    @DecimalMax(value = "100.0", inclusive = true)
    private Double discountPercent;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    @DecimalMax(value = "5.0", inclusive = true)
    private Double rating;
}