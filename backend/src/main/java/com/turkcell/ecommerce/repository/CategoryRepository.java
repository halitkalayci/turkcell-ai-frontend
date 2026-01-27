package com.turkcell.ecommerce.repository;

import com.turkcell.ecommerce.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Category entity
 */
@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

    /**
     * Check if category exists by name
     */
    boolean existsByName(String name);

    /**
     * Find category by name
     */
    Optional<CategoryEntity> findByName(String name);

    /**
     * Check if category exists by name excluding specific id (for update)
     */
    boolean existsByNameAndIdNot(String name, Long id);
}
