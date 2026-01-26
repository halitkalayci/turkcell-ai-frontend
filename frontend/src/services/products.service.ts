/**
 * Products Service
 * Business Layer - Product business logic
 * 
 * Responsibilities:
 * - Orchestrates API calls
 * - Implements business rules and validation
 * - Transforms data for UI consumption
 * - Future: Caching, optimistic updates, data aggregation
 * 
 * NO React imports allowed in this layer.
 * NO direct HTTP calls (must use API layer).
 */

import { listProducts } from '@/api/products.api';
import type { ProductPageResponse, ListProductsParams } from '@/types/api';

/**
 * Options for fetching products
 * Extends API params for future business-level options
 */
export interface GetProductsOptions extends ListProductsParams {
  // Future: Add business-level options here
  // e.g., includeOutOfStock?: boolean
  // e.g., cacheStrategy?: 'cache-first' | 'network-only'
}

/**
 * Product Service
 * Encapsulates all product-related business operations
 */
export const productService = {
  /**
   * Get all products with pagination and filtering
   * 
   * @param options - Query options (page, size, sort, search)
   * @returns Paginated product list
   * 
   * Future enhancements:
   * - Client-side caching
   * - Filtering out-of-stock products
   * - Price formatting/currency conversion
   * - Analytics tracking
   */
  getAllProducts: async (options?: GetProductsOptions): Promise<ProductPageResponse> => {
    // For now, directly delegate to API layer
    // Future: Add caching, validation, transformation here
    return await listProducts(options);
  },

  /**
   * Future method: Get only in-stock products
   * Example of business logic that would live in this layer
   */
  // getInStockProducts: async (options?: GetProductsOptions): Promise<ProductPageResponse> => {
  //   const response = await listProducts(options);
  //   return {
  //     ...response,
  //     items: response.items.filter(product => product.inStock),
  //     totalElements: response.items.filter(product => product.inStock).length,
  //   };
  // },
};
