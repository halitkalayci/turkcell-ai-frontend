package com.turkcell.ecommerce.controller;

import com.turkcell.ecommerce.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.OffsetDateTime;
import java.util.Collections;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Products", description = "Product management")
public class ProductController {

    @GetMapping
    @Operation(
            summary = "List products (paginated)",
            description = "Retrieve a paginated list of products with optional filtering and sorting"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Products retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ProductPageResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request parameters",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity<ProductPageResponse> listProducts(
            @Parameter(description = "Zero-based page index")
            @RequestParam(defaultValue = "0") Integer page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") Integer size,
            @Parameter(description = "Sort format `field,asc|desc` (e.g. `createdAt,desc`)")
            @RequestParam(required = false) String sort,
            @Parameter(description = "Optional text search query (name/description)")
            @RequestParam(required = false) String q
    ) {
        // TODO: Implement business logic
        ProductPageResponse response = ProductPageResponse.builder()
                .items(Collections.emptyList())
                .page(page)
                .size(size)
                .totalElements(0L)
                .totalPages(0)
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(
            summary = "Create a product",
            description = "Create a new product in the system"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Product created",
                    content = @Content(schema = @Schema(implementation = ProductResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation failed",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Conflict (e.g., duplicate SKU if enforced)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request
    ) {
        // TODO: Implement business logic
        Product product = Product.builder()
                .id("prd_temp")
                .sku(request.getSku())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .currency(request.getCurrency())
                .inStock(request.getInStock())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        ProductResponse response = ProductResponse.builder()
                .product(product)
                .build();

        return ResponseEntity
                .created(URI.create("/api/v1/products/" + product.getId()))
                .body(response);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get product by id",
            description = "Retrieve a specific product by its unique identifier"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Product found",
                    content = @Content(schema = @Schema(implementation = ProductResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity<ProductResponse> getProductById(
            @Parameter(description = "Product ID", example = "prd_123")
            @PathVariable String id
    ) {
        // TODO: Implement business logic
        Product product = Product.builder()
                .id(id)
                .name("Sample Product")
                .price(99.99)
                .currency("USD")
                .inStock(true)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        ProductResponse response = ProductResponse.builder()
                .product(product)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Replace product (full update)",
            description = "Replace an existing product with new data (full update)"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Product updated",
                    content = @Content(schema = @Schema(implementation = ProductResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation failed",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Conflict (e.g., duplicate SKU if enforced)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity<ProductResponse> replaceProduct(
            @Parameter(description = "Product ID", example = "prd_123")
            @PathVariable String id,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        // TODO: Implement business logic
        Product product = Product.builder()
                .id(id)
                .sku(request.getSku())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .currency(request.getCurrency())
                .inStock(request.getInStock())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        ProductResponse response = ProductResponse.builder()
                .product(product)
                .build();

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    @Operation(
            summary = "Update product (partial update)",
            description = "Partially update an existing product (only provided fields will be updated)"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Product updated",
                    content = @Content(schema = @Schema(implementation = ProductResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation failed",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity<ProductResponse> patchProduct(
            @Parameter(description = "Product ID", example = "prd_123")
            @PathVariable String id,
            @Valid @RequestBody PatchProductRequest request
    ) {
        // TODO: Implement business logic
        Product product = Product.builder()
                .id(id)
                .name(request.getName() != null ? request.getName() : "Sample Product")
                .price(request.getPrice() != null ? request.getPrice() : 99.99)
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .inStock(request.getInStock() != null ? request.getInStock() : true)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        ProductResponse response = ProductResponse.builder()
                .product(product)
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete product",
            description = "Delete a product by its unique identifier"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Product deleted successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "Product ID", example = "prd_123")
            @PathVariable String id
    ) {
        // TODO: Implement business logic
        return ResponseEntity.noContent().build();
    }
}
