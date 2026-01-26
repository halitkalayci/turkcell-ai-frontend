package com.turkcell.ecommerce.controller;

import com.turkcell.ecommerce.dto.*;
import com.turkcell.ecommerce.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Products", description = "Product management")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

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
        ProductPageResponse response = productService.listProducts(page, size, sort, q);
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
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity
                .created(URI.create("/api/v1/products/" + response.getProduct().getId()))
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
        ProductResponse response = productService.getProductById(id);
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
        ProductResponse response = productService.replaceProduct(id, request);
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
        ProductResponse response = productService.patchProduct(id, request);
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
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}