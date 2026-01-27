package com.turkcell.ecommerce.repository;

import com.turkcell.ecommerce.entity.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

    @Query("SELECT p FROM ProductEntity p WHERE " +
            "(:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<ProductEntity> findByQuery(@Param("query") String query, Pageable pageable);

    /**
     * Check if any products exist for a category (for delete protection)
     */
    boolean existsByCategoryId(Long categoryId);

    /**
     * Find products by category ID with pagination
     */
    Page<ProductEntity> findByCategoryId(Long categoryId, Pageable pageable);

    /**
     * Find products by query and category ID
     */
    @Query("SELECT p FROM ProductEntity p WHERE " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<ProductEntity> findByQueryAndCategoryId(@Param("query") String query,
                                                   @Param("categoryId") Long categoryId,
                                                   Pageable pageable);
}
