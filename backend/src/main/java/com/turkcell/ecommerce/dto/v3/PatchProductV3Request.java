package com.turkcell.ecommerce.dto.v3;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for partial update of product (v3)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatchProductV3Request {

    private String sku;

    @Size(min = 3, max = 120, message = "Product name must be between 3 and 120 characters")
    private String name;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @DecimalMin(value = "0.0", message = "Price must be at least 0")
    private Double price;

    @Size(min = 3, max = 3, message = "Currency must be exactly 3 characters (ISO 4217)")
    private String currency;

    private Boolean inStock;

    private String imageUrl;

    @DecimalMin(value = "0.0", message = "Discount percent must be at least 0")
    @DecimalMax(value = "100.0", message = "Discount percent cannot exceed 100")
    private Double discountPercent;

    @DecimalMin(value = "0.0", message = "Rating must be at least 0")
    @DecimalMax(value = "5.0", message = "Rating cannot exceed 5")
    private Double rating;

    private Long categoryId;
}
