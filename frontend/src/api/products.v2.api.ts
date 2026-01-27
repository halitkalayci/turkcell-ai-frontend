/**
 * Products API Client (v2)
 * API Layer - Products v2 endpoint operations
 * 
 * Responsibilities:
 * - Implements product v2 CRUD operations
 * - Maps to OpenAPI v2 operationIds
 * - Returns raw API responses (no transformation)
 * 
 * NO business logic allowed in this layer.
 * NO React imports allowed.
 */

import { httpClient } from './client';
import type { ProductPageResponseV2, ListProductsV2Params } from '@/types/api';

/**
 * List products with pagination and search (v2)
 * OpenAPI operationId: listProductsV2
 * 
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Paginated list of products (v2)
 */
export async function listProductsV2(
  params?: ListProductsV2Params
): Promise<ProductPageResponseV2> {
  return httpClient.get<ProductPageResponseV2>('/api/v2/products', params);
}
