/**
 * Common API Types
 * Source: /docs/openapi/products-v1.yaml (components/schemas)
 * 
 * These types mirror the OpenAPI specification exactly.
 * DO NOT modify without updating the OpenAPI spec first.
 */

/**
 * ErrorDetail represents a field-level validation error
 * OpenAPI: components/schemas/ErrorDetail
 */
export interface ErrorDetail {
  /** Field name that caused the error */
  field: string;
  /** Human-readable error message for this field */
  message: string;
}

/**
 * ErrorResponse represents the standard error response format
 * OpenAPI: components/schemas/ErrorResponse
 */
export interface ErrorResponse {
  /** Main error message */
  message: string;
  /** Optional list of field-level errors (for validation failures) */
  details?: ErrorDetail[] | null;
  /** Optional correlation/trace ID for debugging */
  traceId?: string | null;
}
