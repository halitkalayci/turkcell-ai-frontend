/**
 * Product API Types
 * Source: /docs/openapi/products-v1.yaml (components/schemas)
 * 
 * These types mirror the OpenAPI specification exactly.
 * DO NOT modify without updating the OpenAPI spec first.
 * 
 * Missing Fields (for future backend implementation):
 * - imageUrl?: string (product image URL)
 * - discountPercentage?: number (discount percentage for badge)
 * - oldPrice?: number (original price before discount)
 * - rating?: number (product rating 0-5)
 * - reviewCount?: number (number of reviews)
 */

/**
 * Product represents a product entity
 * OpenAPI: components/schemas/Product
 */
export interface Product {
  /** Unique product identifier */
  id: string;
  /** Optional SKU (Stock Keeping Unit) */
  sku?: string | null;
  /** Product name (3-120 characters) */
  name: string;
  /** Product description (max 2000 characters) */
  description?: string | null;
  /** Product price (minimum 0) */
  price: number;
  /** ISO 4217 currency code (e.g., USD, EUR) */
  currency: string;
  /** Whether the product is in stock */
  inStock: boolean;
  /** ISO 8601 date-time when product was created */
  createdAt: string;
  /** ISO 8601 date-time when product was last updated */
  updatedAt: string;
  
  // TODO: Add these fields when backend support is ready
  // imageUrl?: string;
  // discountPercentage?: number;
  // oldPrice?: number;
  // rating?: number;
  // reviewCount?: number;
}

/**
 * ProductResponse wraps a single product
 * OpenAPI: components/schemas/ProductResponse
 */
export interface ProductResponse {
  product: Product;
}

/**
 * ProductPageResponse represents paginated product list
 * OpenAPI: components/schemas/ProductPageResponse
 */
export interface ProductPageResponse {
  /** Array of products for current page */
  items: Product[];
  /** Zero-based page index */
  page: number;
  /** Number of items per page */
  size: number;
  /** Total number of products across all pages */
  totalElements: number;
  /** Total number of pages */
  totalPages: number;
}

/**
 * Query parameters for listing products
 * OpenAPI: paths./products.get.parameters
 */
export interface ListProductsParams extends Record<string, string | number | undefined> {
  /** Zero-based page index (default: 0) */
  page?: number;
  /** Page size (1-100, default: 10) */
  size?: number;
  /** Sort format: field,asc|desc (e.g., "createdAt,desc") */
  sort?: string;
  /** Optional text search query for name/description */
  q?: string;
}
