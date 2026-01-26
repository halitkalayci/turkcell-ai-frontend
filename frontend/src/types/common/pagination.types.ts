/**
 * Common Pagination Types
 * 
 * Shared pagination types used across multiple components and hooks.
 * These types are framework-agnostic and reusable.
 */

/**
 * Pagination metadata information
 * Used for displaying pagination state in UI
 */
export interface PaginationInfo {
  /** Zero-based page index */
  page: number;
  /** Number of items per page */
  size: number;
  /** Total number of items across all pages */
  totalElements: number;
  /** Total number of pages */
  totalPages: number;
}

/**
 * Pagination query parameters
 * Used for API requests
 */
export interface PaginationParams {
  /** Zero-based page index (default: 0) */
  page?: number;
  /** Page size (1-100, default: 10) */
  size?: number;
}
