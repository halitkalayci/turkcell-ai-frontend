/**
 * Validation Utility Functions
 * 
 * Reusable validation functions for form inputs and data.
 * These utilities are framework-agnostic and easily testable.
 */

import {
  MIN_PRODUCT_NAME_LENGTH,
  MAX_PRODUCT_NAME_LENGTH,
  MAX_PRODUCT_DESCRIPTION_LENGTH,
  MIN_PRODUCT_PRICE,
} from './constants';

/**
 * Validate email format
 * 
 * @param email - Email address to validate
 * @returns True if email format is valid
 * 
 * @example
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid-email') // false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate product name
 * 
 * @param name - Product name to validate
 * @returns Object with validation result and error message
 * 
 * @example
 * isValidProductName('Laptop') // { valid: true }
 * isValidProductName('A') // { valid: false, error: 'Name too short' }
 */
export function isValidProductName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Product name is required' };
  }

  if (name.length < MIN_PRODUCT_NAME_LENGTH) {
    return {
      valid: false,
      error: `Product name must be at least ${MIN_PRODUCT_NAME_LENGTH} characters`,
    };
  }

  if (name.length > MAX_PRODUCT_NAME_LENGTH) {
    return {
      valid: false,
      error: `Product name must not exceed ${MAX_PRODUCT_NAME_LENGTH} characters`,
    };
  }

  return { valid: true };
}

/**
 * Validate product description
 * 
 * @param description - Product description to validate
 * @returns Object with validation result and error message
 */
export function isValidProductDescription(
  description: string | null | undefined
): { valid: boolean; error?: string } {
  // Description is optional
  if (!description || description.trim().length === 0) {
    return { valid: true };
  }

  if (description.length > MAX_PRODUCT_DESCRIPTION_LENGTH) {
    return {
      valid: false,
      error: `Description must not exceed ${MAX_PRODUCT_DESCRIPTION_LENGTH} characters`,
    };
  }

  return { valid: true };
}

/**
 * Validate product price
 * 
 * @param price - Product price to validate
 * @returns Object with validation result and error message
 * 
 * @example
 * isValidProductPrice(99.99) // { valid: true }
 * isValidProductPrice(-10) // { valid: false, error: 'Price must be positive' }
 */
export function isValidProductPrice(price: number): { valid: boolean; error?: string } {
  if (isNaN(price)) {
    return { valid: false, error: 'Price must be a valid number' };
  }

  if (price < MIN_PRODUCT_PRICE) {
    return { valid: false, error: 'Price must be zero or positive' };
  }

  return { valid: true };
}

/**
 * Validate URL format
 * 
 * @param url - URL to validate
 * @returns True if URL format is valid
 * 
 * @example
 * isValidUrl('https://example.com') // true
 * isValidUrl('not-a-url') // false
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate currency code (ISO 4217)
 * 
 * @param currency - Currency code to validate (e.g., 'USD', 'EUR')
 * @returns True if currency code format is valid
 * 
 * @example
 * isValidCurrency('USD') // true
 * isValidCurrency('us') // false
 */
export function isValidCurrency(currency: string): boolean {
  const currencyRegex = /^[A-Z]{3}$/;
  return currencyRegex.test(currency);
}

/**
 * Validate positive integer
 * 
 * @param value - Value to validate
 * @returns True if value is a positive integer
 * 
 * @example
 * isPositiveInteger(10) // true
 * isPositiveInteger(-5) // false
 * isPositiveInteger(3.14) // false
 */
export function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

/**
 * Validate non-empty string
 * 
 * @param value - String to validate
 * @returns True if string is not empty or whitespace-only
 */
export function isNonEmptyString(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}
