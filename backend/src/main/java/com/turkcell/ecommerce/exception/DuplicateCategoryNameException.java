package com.turkcell.ecommerce.exception;

/**
 * Exception thrown when trying to create/update a category with a duplicate name
 */
public class DuplicateCategoryNameException extends RuntimeException {
    public DuplicateCategoryNameException(String message) {
        super(message);
    }
}
