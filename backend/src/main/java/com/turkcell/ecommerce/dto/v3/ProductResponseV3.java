package com.turkcell.ecommerce.dto.v3;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response wrapper for single product (v3)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseV3 {
    private ProductV3 product;
}
