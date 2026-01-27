/**
 * Pagination Utility Functions
 * 
 * Reusable functions for pagination calculations and formatting.
 * These utilities are framework-agnostic and easily testable.
 */

/**
 * Calculate the starting item number for current page (1-based)
 * 
 * @param page - Zero-based page index
 * @param size - Number of items per page
 * @returns 1-based starting item number
 * 
 * @example
 * calculatePageStartIndex(0, 10) // 1 (first page)
 * calculatePageStartIndex(1, 10) // 11 (second page)
 */
export function calculatePageStartIndex(page: number, size: number): number {
  return page * size + 1;
}

/**
 * Calculate the ending item number for current page (1-based)
 * 
 * @param page - Zero-based page index
 * @param size - Number of items per page
 * @param totalElements - Total number of items across all pages
 * @returns 1-based ending item number
 * 
 * @example
 * calculatePageEndIndex(0, 10, 25) // 10 (first page)
 * calculatePageEndIndex(2, 10, 25) // 25 (last page with fewer items)
 */
export function calculatePageEndIndex(
  page: number,
  size: number,
  totalElements: number
): number {
  return Math.min((page + 1) * size, totalElements);
}

/**
 * Check if pagination controls should be shown
 * 
 * @param totalPages - Total number of pages
 * @returns True if pagination controls should be displayed
 * 
 * @example
 * shouldShowPagination(1) // false (only one page)
 * shouldShowPagination(5) // true (multiple pages)
 */
export function shouldShowPagination(totalPages: number): boolean {
  return totalPages > 1;
}

/**
 * Generate page range for pagination controls
 * 
 * @param currentPage - Current page (zero-based)
 * @param totalPages - Total number of pages
 * @param maxVisible - Maximum number of visible page buttons (default: 5)
 * @returns Array of page numbers to display
 * 
 * @example
 * generatePageRange(2, 10, 5) // [1, 2, 3, 4, 5]
 * generatePageRange(8, 10, 5) // [6, 7, 8, 9, 10]
 */
export function generatePageRange(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] {
  const halfVisible = Math.floor(maxVisible / 2);
  let start = Math.max(0, currentPage - halfVisible);
  let end = Math.min(totalPages, start + maxVisible);

  // Adjust start if we're near the end
  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }

  return Array.from({ length: end - start }, (_, i) => start + i);
}

/**
 * Format pagination info as human-readable text
 * 
 * @param page - Zero-based page index
 * @param size - Number of items per page
 * @param totalElements - Total number of items
 * @returns Formatted pagination text
 * 
 * @example
 * formatPaginationInfo(0, 10, 25) // "Showing 1-10 of 25"
 * formatPaginationInfo(2, 10, 25) // "Showing 21-25 of 25"
 * formatPaginationInfo(0, 10, 0) // "Showing 0-0 of 0"
 */
export function formatPaginationInfo(
  page: number,
  size: number,
  totalElements: number
): string {
  // Handle zero items case
  if (totalElements === 0) {
    return `Showing 0-0 of 0`;
  }
  
  const start = calculatePageStartIndex(page, size);
  const end = calculatePageEndIndex(page, size, totalElements);
  return `Showing ${start}-${end} of ${totalElements}`;
}
