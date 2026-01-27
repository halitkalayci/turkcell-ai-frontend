package com.turkcell.ecommerce.exception;

/**
 * Exception thrown when trying to delete a category that has products
 */
public class CategoryHasProductsException extends RuntimeException {
    public CategoryHasProductsException(String message) {
        super(message);
    }
}
