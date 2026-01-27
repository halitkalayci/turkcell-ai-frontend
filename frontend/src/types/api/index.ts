/**
 * API Types Barrel Export
 * 
 * Single source of truth for all API-related types.
 * These types are derived from OpenAPI specification.
 */

// Common types (errors, shared models)
export type { ErrorResponse, ErrorDetail } from './common.types';

// Product v1 types
export type {
  Product,
  ProductResponse,
  ProductPageResponse,
  ListProductsParams,
} from './products.types';

// Product v2 types
export type {
  ProductV2,
  ProductResponseV2,
  ProductPageResponseV2,
  ListProductsV2Params,
  CreateProductV2Request,
  UpdateProductV2Request,
  PatchProductV2Request,
} from './products.v2.types';
