package com.turkcell.ecommerce.dto.v3;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Category reference DTO for V3 products
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRefV3 {
    private String id;
    private String name;
}
