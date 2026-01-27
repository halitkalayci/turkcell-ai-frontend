package com.turkcell.ecommerce.dto.v2;

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
public class ProductPageResponseV2 {

    @NotNull
    private List<ProductV2> items;

    @NotNull
    private Integer page;

    @NotNull
    private Integer size;

    @NotNull
    private Long totalElements;

    @NotNull
    private Integer totalPages;
}