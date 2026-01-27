/**
 * ProductListV2 Component
 * UI Layer - Container component for displaying list of products (v2)
 * 
 * Responsibilities:
 * - Use useProductsV2 hook for data
 * - Render loading, error, empty, and success states
 * - Display grid of ProductCardV2 components
 * - Show pagination information
 * 
 * NO service calls allowed (use hooks only).
 * NO API calls allowed.
 * NO business logic (just render data from hook).
 */

import { useProductsV2 } from '@/hooks/useProductsV2';
import { ProductCardV2 } from './ProductCardV2';
import { calculatePageStartIndex, calculatePageEndIndex } from '@/utils/pagination';

/**
 * ProductListV2 component displays paginated list of products (v2)
 * 
 * Handles all view states:
 * - Loading: Shows loading spinner
 * - Error: Shows error message with retry button
 * - Empty: Shows "no products" message
 * - Success: Shows grid of products with pagination info
 * 
 * @example
 * ```tsx
 * <ProductListV2 />
 * ```
 */
export function ProductListV2() {
  const { products, pagination, loading, error, refetch } = useProductsV2();

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600 text-sm">Loading products...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-red-600 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Error Loading Products
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={refetch}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          className="w-24 h-24 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No Products Found
        </h3>
        <p className="text-sm text-gray-500">
          There are no products available at the moment.
        </p>
      </div>
    );
  }

  // Success State - Products Grid
  return (
    <div className="w-full">
      {/* Pagination Info */}
      {pagination && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-semibold text-gray-900">
              {calculatePageStartIndex(pagination.page, pagination.size)}
            </span>
            {' - '}
            <span className="font-semibold text-gray-900">
              {calculatePageEndIndex(pagination.page, pagination.size, pagination.totalElements)}
            </span>
            {' of '}
            <span className="font-semibold text-gray-900">
              {pagination.totalElements}
            </span>
            {' products'}
          </p>
          <button
            onClick={refetch}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
            aria-label="Refresh products"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCardV2 key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Info (Bottom) */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 text-center text-xs text-gray-500">
          Page {pagination.page + 1} of {pagination.totalPages}
        </div>
      )}
    </div>
  );
}
