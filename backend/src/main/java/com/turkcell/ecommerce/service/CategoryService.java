package com.turkcell.ecommerce.service;

import com.turkcell.ecommerce.dto.CategoryResponse;
import com.turkcell.ecommerce.dto.CreateCategoryRequest;
import com.turkcell.ecommerce.dto.UpdateCategoryRequest;
import com.turkcell.ecommerce.entity.CategoryEntity;
import com.turkcell.ecommerce.exception.CategoryHasProductsException;
import com.turkcell.ecommerce.exception.DuplicateCategoryNameException;
import com.turkcell.ecommerce.exception.ResourceNotFoundException;
import com.turkcell.ecommerce.repository.CategoryRepository;
import com.turkcell.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for category business logic
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    /**
     * Get all categories
     */
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get category by ID
     */
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return toResponse(category);
    }

    /**
     * Create new category
     */
    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        // Check for duplicate name
        if (categoryRepository.existsByName(request.getName())) {
            throw new DuplicateCategoryNameException("Category with name '" + request.getName() + "' already exists");
        }

        CategoryEntity category = new CategoryEntity();
        category.setName(request.getName());

        CategoryEntity saved = categoryRepository.save(category);
        return toResponse(saved);
    }

    /**
     * Update category
     */
    @Transactional
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        // Check for duplicate name (excluding current category)
        if (categoryRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw new DuplicateCategoryNameException("Category with name '" + request.getName() + "' already exists");
        }

        category.setName(request.getName());
        CategoryEntity updated = categoryRepository.save(category);
        return toResponse(updated);
    }

    /**
     * Delete category (with protection if products exist)
     */
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }

        // Check if category has products
        if (productRepository.existsByCategoryId(id)) {
            throw new CategoryHasProductsException("Cannot delete category with id " + id + " because it has products");
        }

        categoryRepository.deleteById(id);
    }

    /**
     * Convert entity to response DTO
     */
    private CategoryResponse toResponse(CategoryEntity entity) {
        return CategoryResponse.builder()
                .id(String.valueOf(entity.getId()))
                .name(entity.getName())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
