package com.turkcell.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

/**
 * Response DTO for Category
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private String id;
    private String name;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
