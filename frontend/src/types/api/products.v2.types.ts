/**
 * Product V2 API Types
 * Source: /docs/openapi/products-v2.yaml (components/schemas)
 *
 * These types mirror the OpenAPI v2 specification exactly.
 * DO NOT modify without updating the OpenAPI spec first.
 */

/**
 * ProductV2 represents a product entity (v2)
 * OpenAPI: components/schemas/ProductV2
 */
export interface ProductV2 {
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
  /** Product image URL */
  imageUrl?: string | null;
  /** Discount percentage (0-100) */
  discountPercent?: number | null;
  /** Product rating (0-5) */
  rating?: number | null;
  /** ISO 8601 date-time when product was created */
  createdAt: string;
  /** ISO 8601 date-time when product was last updated */
  updatedAt: string;
}

/**
 * ProductResponseV2 wraps a single product (v2)
 * OpenAPI: components/schemas/ProductResponseV2
 */
export interface ProductResponseV2 {
  product: ProductV2;
}

/**
 * ProductPageResponseV2 represents paginated product list (v2)
 * OpenAPI: components/schemas/ProductPageResponseV2
 */
export interface ProductPageResponseV2 {
  /** Array of products for current page */
  items: ProductV2[];
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
 * Query parameters for listing products (v2)
 * OpenAPI: paths./products.get.parameters
 */
export interface ListProductsV2Params extends Record<string, string | number | undefined> {
  /** Zero-based page index (default: 0) */
  page?: number;
  /** Page size (1-100, default: 10) */
  size?: number;
  /** Sort format: field,asc|desc (e.g., "createdAt,desc") */
  sort?: string;
  /** Optional text search query for name/description */
  q?: string;
}

/**
 * CreateProductV2Request - required fields for creating a product (v2)
 * OpenAPI: components/schemas/CreateProductV2Request
 */
export interface CreateProductV2Request {
  sku?: string | null;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  inStock: boolean;
  imageUrl: string;
  discountPercent: number;
  rating: number;
}

/**
 * UpdateProductV2Request - required fields for replacing a product (v2)
 * OpenAPI: components/schemas/UpdateProductV2Request
 */
export interface UpdateProductV2Request {
  sku?: string | null;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  inStock: boolean;
  imageUrl: string;
  discountPercent: number;
  rating: number;
}

/**
 * PatchProductV2Request - optional fields for patching a product (v2)
 * OpenAPI: components/schemas/PatchProductV2Request
 */
export interface PatchProductV2Request {
  sku?: string | null;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
  inStock?: boolean | null;
  imageUrl?: string | null;
  discountPercent?: number | null;
  rating?: number | null;
}
