package com.turkcell.ecommerce.dto.v3;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Paginated response for products (v3)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductPageResponseV3 {
    private List<ProductV3> items;
    private Integer page;
    private Integer size;
    private Long totalElements;
    private Integer totalPages;
}
