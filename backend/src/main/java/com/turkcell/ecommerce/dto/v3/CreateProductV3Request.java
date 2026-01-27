package com.turkcell.ecommerce.dto.v3;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a product (v3)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductV3Request {

    private String sku;

    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 120, message = "Product name must be between 3 and 120 characters")
    private String name;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", message = "Price must be at least 0")
    private Double price;

    @NotBlank(message = "Currency is required")
    @Size(min = 3, max = 3, message = "Currency must be exactly 3 characters (ISO 4217)")
    private String currency;

    @NotNull(message = "InStock status is required")
    private Boolean inStock;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @NotNull(message = "Discount percent is required")
    @DecimalMin(value = "0.0", message = "Discount percent must be at least 0")
    @DecimalMax(value = "100.0", message = "Discount percent cannot exceed 100")
    private Double discountPercent;

    @NotNull(message = "Rating is required")
    @DecimalMin(value = "0.0", message = "Rating must be at least 0")
    @DecimalMax(value = "5.0", message = "Rating cannot exceed 5")
    private Double rating;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}
