import { httpClient } from './client';
import type {
  ProductPageResponseV3,
  ProductResponseV3,
  CreateProductV3Request,
  UpdateProductV3Request,
  PatchProductV3Request,
} from '@/types/api/products.v3.types';

export interface ListProductsV3Params {
  page?: number;
  size?: number;
  sort?: string;
  q?: string;
  categoryId?: string;
}

/**
 * List products (v3) with pagination and optional category filter
 */
export async function listProductsV3(params?: ListProductsV3Params): Promise<ProductPageResponseV3> {
  return httpClient.get<ProductPageResponseV3>('/api/v3/products', params);
}

/**
 * Get product by ID (v3)
 */
export async function getProductByIdV3(id: string): Promise<ProductResponseV3> {
  return httpClient.get<ProductResponseV3>(`/api/v3/products/${id}`);
}

/**
 * Create a new product (v3)
 */
export async function createProductV3(request: CreateProductV3Request): Promise<ProductResponseV3> {
  return httpClient.post<ProductResponseV3>('/api/v3/products', request);
}

/**
 * Replace product (full update) (v3)
 */
export async function replaceProductV3(id: string, request: UpdateProductV3Request): Promise<ProductResponseV3> {
  return httpClient.put<ProductResponseV3>(`/api/v3/products/${id}`, request);
}

/**
 * Update product (partial update) (v3)
 */
export async function patchProductV3(id: string, request: PatchProductV3Request): Promise<ProductResponseV3> {
  return httpClient.patch<ProductResponseV3>(`/api/v3/products/${id}`, request);
}

/**
 * Delete product (v3)
 */
export async function deleteProductV3(id: string): Promise<void> {
  return httpClient.delete(`/api/v3/products/${id}`);
}
