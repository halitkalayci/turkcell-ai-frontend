/**
 * Products API Client
 * API Layer - Products endpoint operations
 * 
 * Responsibilities:
 * - Implements product CRUD operations
 * - Maps to OpenAPI operationIds
 * - Returns raw API responses (no transformation)
 * 
 * NO business logic allowed in this layer.
 * NO React imports allowed.
 */

import { httpClient } from './client';
import type { ProductPageResponse, ListProductsParams } from '@/types/api';

/**
 * List products with pagination and search
 * OpenAPI operationId: listProducts
 * 
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Paginated list of products
 */
export async function listProducts(
  params?: ListProductsParams
): Promise<ProductPageResponse> {
  return httpClient.get<ProductPageResponse>('/api/v1/products', params);
}
