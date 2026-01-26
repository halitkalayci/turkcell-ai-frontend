/**
 * ProductCard Component
 * UI Layer - Presentational component for displaying a single product
 * 
 * Design Reference: docs/frontend/references/product_card_reference.png
 * 
 * Responsibilities:
 * - Render product information following reference design
 * - Display image, discount badge, price, rating, and add to cart button
 * - Pure presentational (no state, no API calls, no services)
 * 
 * NO service calls allowed.
 * NO API calls allowed.
 * NO business logic (just render props).
 */

import type { Product } from '@/types/api';
import { formatPrice } from '@/utils/formatters';

/**
 * ProductCard props
 */
export interface ProductCardProps {
  /** Product data to display */
  product: Product;
  /** Optional callback when add to cart is clicked */
  onAddToCart?: (product: Product) => void;
}

/**
 * ProductCard component displays a single product
 * Follows design reference: product_card_reference.png
 * 
 * @example
 * ```tsx
 * <ProductCard product={product} onAddToCart={handleAddToCart} />
 * ```
 */
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Mock data for missing backend fields (as per styleguide 4.1)
  const mockDiscount = null; // Will be: product.discountPercentage when backend adds it
  const mockOldPrice = null; // Will be: product.oldPrice when backend adds it
  const mockRating = null; // Will be: product.rating when backend adds it

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Product Image with Discount Badge */}
      <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center">
        {/* Discount Badge (conditional - shown only if discount exists) */}
        {mockDiscount && (
          <div className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-md">
            {mockDiscount}% OFF
          </div>
        )}
        
        {/* Product Image Placeholder */}
        <svg
          className="w-20 h-20 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Product Content */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price, product.currency)}
          </span>
          {mockOldPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(mockOldPrice, product.currency)}
            </span>
          )}
        </div>

        {/* Rating Section (conditional) */}
        {mockRating && (
          <div className="flex items-center gap-2 mb-4">
            {/* Star Icons */}
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="bg-yellow-400 text-gray-900 text-xs font-semibold px-2 py-0.5 rounded">
              {mockRating}
            </span>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart?.(product)}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          aria-label={`Add ${product.name} to cart`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Add to cart
        </button>
      </div>
    </article>
  );
}
