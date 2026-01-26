/**
 * Error Handling Utilities
 * Business Layer - Error transformation and mapping
 * 
 * Responsibilities:
 * - Transform technical errors to user-friendly messages
 * - Map HTTP status codes to actionable messages
 * - Provide consistent error messaging across the app
 * 
 * NO React imports allowed.
 * NO HTTP calls allowed.
 */

import { HttpError } from '@/api/client';

/**
 * Transform technical errors to user-friendly messages
 * 
 * @param error - The error object to transform
 * @param context - Optional context for more specific messages (e.g., 'products', 'orders')
 * @returns User-friendly error message
 * 
 * @example
 * transformErrorMessage(new Error('Network error')) 
 * // 'Unable to connect to server. Please check your connection.'
 * 
 * transformErrorMessage(new HttpError(404, 'Not Found'), 'products')
 * // 'Products not found. Please try again later.'
 */
export function transformErrorMessage(
  error: unknown,
  context?: string
): string {
  // Handle HttpError instances (from our API client)
  if (error instanceof HttpError) {
    return mapHttpErrorToMessage(error, context);
  }

  // Handle generic Error instances
  if (error instanceof Error) {
    return mapGenericErrorToMessage(error, context);
  }

  // Fallback for unknown error types
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Map HTTP errors to user-friendly messages
 * 
 * @param error - HttpError instance
 * @param context - Optional context for specific messages
 * @returns User-friendly error message
 */
function mapHttpErrorToMessage(error: HttpError, context?: string): string {
  const resourceName = context || 'resource';

  switch (error.status) {
    case 400:
      return error.errorResponse?.message || 'Invalid request. Please check your input.';
    
    case 401:
      return 'Authentication required. Please log in.';
    
    case 403:
      return 'You do not have permission to perform this action.';
    
    case 404:
      return `${capitalize(resourceName)} not found. Please try again later.`;
    
    case 409:
      return 'This action conflicts with existing data. Please refresh and try again.';
    
    case 422:
      return error.errorResponse?.message || 'Validation failed. Please check your input.';
    
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    
    case 500:
      return 'Server error. Please contact support if the problem persists.';
    
    case 502:
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    
    case 504:
      return 'Request timeout. Please check your connection and try again.';
    
    default:
      return error.errorResponse?.message || `Failed to load ${resourceName}. Please try again.`;
  }
}

/**
 * Map generic errors to user-friendly messages
 * 
 * @param error - Generic Error instance
 * @param context - Optional context for specific messages
 * @returns User-friendly error message
 */
function mapGenericErrorToMessage(error: Error, context?: string): string {
  const message = error.message.toLowerCase();
  const resourceName = context || 'data';

  // Network-related errors
  if (message.includes('network error') || message.includes('failed to fetch')) {
    return 'Unable to connect to server. Please check your connection.';
  }

  // Timeout errors
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'Request timed out. Please try again.';
  }

  // Abort errors
  if (message.includes('abort')) {
    return 'Request was cancelled. Please try again.';
  }

  // CORS errors
  if (message.includes('cors')) {
    return 'Connection blocked by security policy. Please contact support.';
  }

  // JSON parsing errors
  if (message.includes('json') || message.includes('parse')) {
    return 'Invalid response format. Please contact support.';
  }

  // Generic fallback
  return `Failed to load ${resourceName}. Please try again.`;
}

/**
 * Capitalize first letter of a string
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Extract field-level errors from validation error response
 * 
 * @param error - Error object
 * @returns Map of field names to error messages
 * 
 * @example
 * const fieldErrors = extractFieldErrors(error);
 * // { 'email': 'Invalid email format', 'password': 'Password too short' }
 */
export function extractFieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof HttpError)) {
    return {};
  }

  const details = error.errorResponse?.details;
  if (!details || !Array.isArray(details)) {
    return {};
  }

  return details.reduce((acc, detail) => {
    acc[detail.field] = detail.message;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Check if error is a network-related error
 * 
 * @param error - Error object to check
 * @returns True if error is network-related
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connection')
    );
  }
  return false;
}

/**
 * Check if error is a validation error (4xx status)
 * 
 * @param error - Error object to check
 * @returns True if error is validation-related
 */
export function isValidationError(error: unknown): boolean {
  if (error instanceof HttpError) {
    return error.status >= 400 && error.status < 500;
  }
  return false;
}

/**
 * Check if error is a server error (5xx status)
 * 
 * @param error - Error object to check
 * @returns True if error is server-related
 */
export function isServerError(error: unknown): boolean {
  if (error instanceof HttpError) {
    return error.status >= 500 && error.status < 600;
  }
  return false;
}
