package com.turkcell.ecommerce.controller.v2;

import com.turkcell.ecommerce.dto.ErrorResponse;
import com.turkcell.ecommerce.dto.v2.*;
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
@RequestMapping("/api/v2/products")
@Tag(name = "Products", description = "Product management (v2)")
@RequiredArgsConstructor
public class ProductControllerV2 {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "List products (paginated)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Products retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ProductPageResponseV2.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<ProductPageResponseV2> listProductsV2(
            @Parameter(description = "Zero-based page index")
            @RequestParam(defaultValue = "0") Integer page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") Integer size,
            @Parameter(description = "Sort format `field,asc|desc` (e.g. `createdAt,desc`)")
            @RequestParam(required = false) String sort,
            @Parameter(description = "Optional text search query (name/description)")
            @RequestParam(required = false) String q
    ) {
        ProductPageResponseV2 response = productService.listProductsV2(page, size, sort, q);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create a product (v2)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Product created",
                    content = @Content(schema = @Schema(implementation = ProductResponseV2.class))),
            @ApiResponse(responseCode = "400", description = "Validation failed",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Conflict (e.g., duplicate SKU if enforced)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<ProductResponseV2> createProductV2(
            @Valid @RequestBody CreateProductV2Request request
    ) {
        ProductResponseV2 response = productService.createProductV2(request);
        return ResponseEntity
                .created(URI.create("/api/v2/products/" + response.getProduct().getId()))
                .body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by id (v2)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product found",
                    content = @Content(schema = @Schema(implementation = ProductResponseV2.class))),
            @ApiResponse(responseCode = "404", description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<ProductResponseV2> getProductByIdV2(
            @Parameter(description = "Product ID", example = "prd_123")
            @PathVariable String id
    ) {
        ProductResponseV2 response = productService.getProductByIdV2(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Replace product (full update) (v2)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product updated",
                    content = @Content(schema = @Schema(implementation = ProductResponseV2.class))),
            @ApiResponse(responseCode = "400", description = "Validation failed",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Conflict (e.g., duplicate SKU if enforced)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<ProductResponseV2> replaceProductV2(
            @Parameter(description = "Product ID", example = "prd_123")
            @PathVariable String id,
            @Valid @RequestBody UpdateProductV2Request request
    ) {
        ProductResponseV2 response = productService.replaceProductV2(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update product (partial update) (v2)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product updated",
                    content = @Content(schema = @Schema(implementation = ProductResponseV2.class))),
            @ApiResponse(responseCode = "400", description = "Validation failed",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<ProductResponseV2> patchProductV2(
            @Parameter(description = "Product ID", example = "prd_123")
            @PathVariable String id,
            @Valid @RequestBody PatchProductV2Request request
    ) {
        ProductResponseV2 response = productService.patchProductV2(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product (v2)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<Void> deleteProductV2(
            @Parameter(description = "Product ID", example = "prd_123")
            @PathVariable String id
    ) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}