package com.turkcell.ecommerce.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductPageResponse {

    @NotNull
    private List<Product> items;

    @NotNull
    private Integer page;

    @NotNull
    private Integer size;

    @NotNull
    private Long totalElements;

    @NotNull
    private Integer totalPages;
}
