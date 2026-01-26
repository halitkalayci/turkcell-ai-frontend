/**
 * ProductCard Component
 * UI Layer - Presentational component for displaying a single product
 * 
 * Responsibilities:
 * - Render product information
 * - Display price, stock status, description
 * - Pure presentational (no state, no API calls, no services)
 * 
 * NO service calls allowed.
 * NO API calls allowed.
 * NO business logic (just render props).
 */

import type { Product } from '@/types/api';
import { truncateText, formatPrice, formatDate } from '@/utils/formatters';
import { MAX_DESCRIPTION_LENGTH } from '@/utils/constants';

/**
 * ProductCard props
 */
export interface ProductCardProps {
  /** Product data to display */
  product: Product;
}

/**
 * ProductCard component displays a single product
 * 
 * @example
 * ```tsx
 * <ProductCard product={product} />
 * ```
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      {/* Product Header */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        {product.sku && (
          <p className="text-sm text-gray-500">
            SKU: {product.sku}
          </p>
        )}
      </div>

      {/* Product Description */}
      {product.description && (
        <p className="text-gray-700 mb-4 text-sm leading-relaxed">
          {truncateText(product.description, MAX_DESCRIPTION_LENGTH)}
        </p>
      )}

      {/* Price and Stock Status */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price, product.currency)}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Updated: {formatDate(product.updatedAt)}
          </span>
        </div>

        {/* Stock Badge */}
        <div>
          {product.inStock ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
