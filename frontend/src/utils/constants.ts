/**
 * Application Constants
 * 
 * Centralized constants for the application.
 * Avoids magic numbers and improves maintainability.
 */

// =============================================================================
// API Configuration
// =============================================================================

/**
 * API Base URL
 * Configured via VITE_API_BASE_URL environment variable
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// =============================================================================
// Pagination
// =============================================================================

/**
 * Default page size for paginated lists
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * Minimum allowed page size
 */
export const MIN_PAGE_SIZE = 1;

/**
 * Maximum allowed page size
 */
export const MAX_PAGE_SIZE = 100;

/**
 * Default page index (zero-based)
 */
export const DEFAULT_PAGE_INDEX = 0;

// =============================================================================
// Text Truncation
// =============================================================================

/**
 * Maximum length for product description before truncation
 */
export const MAX_DESCRIPTION_LENGTH = 120;

/**
 * Maximum length for product title before truncation
 */
export const MAX_TITLE_LENGTH = 50;

/**
 * Maximum length for general text snippets
 */
export const MAX_TEXT_SNIPPET_LENGTH = 100;

// =============================================================================
// UI Timeouts
// =============================================================================

/**
 * Debounce delay for search input (milliseconds)
 */
export const SEARCH_DEBOUNCE_DELAY = 300;

/**
 * Toast notification duration (milliseconds)
 */
export const TOAST_DURATION = 3000;

/**
 * API request timeout (milliseconds)
 */
export const API_TIMEOUT = 30000;

// =============================================================================
// Validation
// =============================================================================

/**
 * Minimum product name length
 */
export const MIN_PRODUCT_NAME_LENGTH = 3;

/**
 * Maximum product name length
 */
export const MAX_PRODUCT_NAME_LENGTH = 120;

/**
 * Maximum product description length
 */
export const MAX_PRODUCT_DESCRIPTION_LENGTH = 2000;

/**
 * Minimum product price
 */
export const MIN_PRODUCT_PRICE = 0;

// =============================================================================
// Product Display
// =============================================================================

/**
 * Maximum rating value for star renderings (0-5 scale)
 */
export const MAX_RATING = 5;

/**
 * Maximum discount percentage allowed (0-100)
 */
export const MAX_DISCOUNT_PERCENT = 100;

/**
 * Default placeholder image URL for products without image
 */
export const DEFAULT_PRODUCT_IMAGE = 'https://placehold.co/600x400/EEE/31343C';
