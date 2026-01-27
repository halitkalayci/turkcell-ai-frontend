/**
 * Products Service (v2)
 * Business Layer - Product v2 business logic
 * 
 * Responsibilities:
 * - Orchestrates API calls
 * - Implements business rules and validation
 * - Transforms data for UI consumption
 * 
 * NO React imports allowed in this layer.
 * NO direct HTTP calls (must use API layer).
 */

import { listProductsV2 } from '@/api/products.v2.api';
import type { ProductPageResponseV2, ListProductsV2Params } from '@/types/api';

/**
 * Options for fetching products (v2)
 * Extends API params for future business-level options
 */
export interface GetProductsV2Options extends ListProductsV2Params {
  // Future: Add business-level options here
}

/**
 * Product V2 Service
 * Encapsulates all product-related business operations (v2)
 */
export const productV2Service = {
  /**
   * Get all products with pagination and filtering (v2)
   * 
   * @param options - Query options (page, size, sort, search)
   * @returns Paginated product list (v2)
   */
  getAllProductsV2: async (options?: GetProductsV2Options): Promise<ProductPageResponseV2> => {
    return await listProductsV2(options);
  },
};
