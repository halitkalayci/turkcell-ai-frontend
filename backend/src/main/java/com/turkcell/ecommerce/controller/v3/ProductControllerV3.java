package com.turkcell.ecommerce.controller.v3;

import com.turkcell.ecommerce.dto.v3.*;
import com.turkcell.ecommerce.service.ProductServiceV3;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Product operations (v3) - with category support
 */
@RestController
@RequestMapping("/api/v3/products")
@RequiredArgsConstructor
@Tag(name = "Products V3", description = "Product management (v3) with required category")
public class ProductControllerV3 {

    private final ProductServiceV3 productService;

    @GetMapping
    @Operation(summary = "List products (paginated, with category filter)")
    public ResponseEntity<ProductPageResponseV3> listProducts(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long categoryId) {
        ProductPageResponseV3 response = productService.getAllProducts(page, size, sort, q, categoryId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ProductResponseV3> getProductById(@PathVariable Long id) {
        ProductResponseV3 response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create a new product")
    public ResponseEntity<ProductResponseV3> createProduct(@Valid @RequestBody CreateProductV3Request request) {
        ProductResponseV3 response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Replace product (full update)")
    public ResponseEntity<ProductResponseV3> replaceProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductV3Request request) {
        ProductResponseV3 response = productService.updateProduct(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update product (partial update)")
    public ResponseEntity<ProductResponseV3> patchProduct(
            @PathVariable Long id,
            @Valid @RequestBody PatchProductV3Request request) {
        ProductResponseV3 response = productService.patchProduct(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
