import type { ProductV3 } from '@/types/api/products.v3.types';
import { formatPrice, formatRating, formatDiscount } from '@/utils/formatters';
import { DEFAULT_PRODUCT_IMAGE, MAX_RATING } from '@/utils/constants';
import { CategoryBadge } from '@/components/categories/CategoryBadge';

/**
 * ProductCardV3 props
 */
export interface ProductCardV3Props {
  /** Product data to display (v3 with category) */
  product: ProductV3;
  /** Optional callback when add to cart is clicked */
  onAddToCart?: (product: ProductV3) => void;
}

/**
 * ProductCardV3 component displays a single product with category
 */
export function ProductCardV3({ product, onAddToCart }: ProductCardV3Props) {
  const imgSrc = product.imageUrl ?? DEFAULT_PRODUCT_IMAGE;
  const hasDiscount = product.discountPercent != null && product.discountPercent > 0;
  const ratingValue = Math.ceil(product.rating ?? 0);
  const ratingClamped = Math.min(Math.max(ratingValue, 0), MAX_RATING);

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Product Image with Discount Badge */}
      <div className="relative w-full h-64 bg-gray-100">
        {/* Discount Badge (conditional) */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-md">
            {formatDiscount(product.discountPercent!)}
          </div>
        )}
        
        {/* Product Image */}
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
          }}
        />
      </div>

      {/* Product Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <CategoryBadge category={product.category} />
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>

        {/* Rating Section */}
        <div className="flex items-center gap-2 mb-4">
          {/* Star Icons */}
          <div className="flex gap-0.5">
            {Array.from({ length: MAX_RATING }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < ratingClamped ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="bg-yellow-400 text-gray-900 text-xs font-semibold px-2 py-0.5 rounded">
            {formatRating(product.rating ?? 0)}
          </span>
        </div>

        {/* Stock Badge & Add to Cart Button */}
        <div className="flex items-center justify-between gap-4">
          {/* Stock Badge */}
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              product.inStock
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={!product.inStock}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              product.inStock
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
