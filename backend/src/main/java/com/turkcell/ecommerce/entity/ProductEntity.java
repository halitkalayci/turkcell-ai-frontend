package com.turkcell.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String sku;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(nullable = false)
    private Boolean inStock;

    // V2 fields
    private String imageUrl;

    private Double discountPercent;

    private Double rating;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
