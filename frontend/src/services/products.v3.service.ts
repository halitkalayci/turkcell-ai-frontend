import * as productsApi from '@/api/products.v3.api';
import type { ListProductsV3Params } from '@/api/products.v3.api';
import type {
  ProductPageResponseV3,
  ProductResponseV3,
  CreateProductV3Request,
  UpdateProductV3Request,
  PatchProductV3Request,
} from '@/types/api/products.v3.types';

/**
 * Service layer for products V3 - business logic and API delegation
 */
export const productsV3Service = {
  /**
   * Get all products with pagination and filters
   */
  async getAllProducts(params?: ListProductsV3Params): Promise<ProductPageResponseV3> {
    return await productsApi.listProductsV3(params);
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<ProductResponseV3> {
    return await productsApi.getProductByIdV3(id);
  },

  /**
   * Create new product
   */
  async createProduct(request: CreateProductV3Request): Promise<ProductResponseV3> {
    // Validate categoryId is provided
    if (!request.categoryId) {
      throw new Error('Category is required for creating a product');
    }

    return await productsApi.createProductV3(request);
  },

  /**
   * Update product (full update)
   */
  async updateProduct(id: string, request: UpdateProductV3Request): Promise<ProductResponseV3> {
    // Validate categoryId is provided
    if (!request.categoryId) {
      throw new Error('Category is required for updating a product');
    }

    return await productsApi.replaceProductV3(id, request);
  },

  /**
   * Patch product (partial update)
   */
  async patchProduct(id: string, request: PatchProductV3Request): Promise<ProductResponseV3> {
    return await productsApi.patchProductV3(id, request);
  },

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<void> {
    return await productsApi.deleteProductV3(id);
  },
};
