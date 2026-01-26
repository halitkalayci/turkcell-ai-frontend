/**
 * API Types Barrel Export
 * 
 * Single source of truth for all API-related types.
 * These types are derived from OpenAPI specification.
 */

// Common types (errors, shared models)
export type { ErrorResponse, ErrorDetail } from './common.types';

// Product types
export type {
  Product,
  ProductResponse,
  ProductPageResponse,
  ListProductsParams,
} from './products.types';
