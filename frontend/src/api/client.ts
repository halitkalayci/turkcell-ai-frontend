/**
 * HTTP Client
 * API Layer - Base HTTP client configuration
 * 
 * Responsibilities:
 * - Wraps native fetch API
 * - Handles base URL configuration
 * - Parses JSON responses
 * - Handles HTTP errors
 * 
 * NO business logic allowed in this layer.
 * NO React imports allowed.
 */

import type { ErrorResponse } from '@/types/api';

/**
 * Base URL for API requests
 * Configured via VITE_API_BASE_URL environment variable
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Custom error class for HTTP errors
 */
export class HttpError extends Error {
  status: number;
  statusText: string;
  errorResponse?: ErrorResponse;

  constructor(
    status: number,
    statusText: string,
    errorResponse?: ErrorResponse
  ) {
    super(errorResponse?.message || statusText);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.errorResponse = errorResponse;
  }
}

/**
 * HTTP Client with typed methods
 */
export const httpClient = {
  /**
   * Perform GET request
   * @param url - Endpoint URL (relative to BASE_URL)
   * @param params - Optional query parameters
   * @returns Parsed JSON response
   */
  async get<T>(url: string, params?: Record<string, string | number | undefined>): Promise<T> {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString() : '';
    
    const fullUrl = `${BASE_URL}${url}${queryString}`;
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null) as ErrorResponse | null;
        throw new HttpError(response.status, response.statusText, errorResponse || undefined);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      // Network errors or other fetch failures
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Perform POST request
   * @param url - Endpoint URL (relative to BASE_URL)
   * @param data - Request body
   * @returns Parsed JSON response
   */
  async post<T>(url: string, data: unknown): Promise<T> {
    const fullUrl = `${BASE_URL}${url}`;
    
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null) as ErrorResponse | null;
        throw new HttpError(response.status, response.statusText, errorResponse || undefined);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Perform PUT request
   * @param url - Endpoint URL (relative to BASE_URL)
   * @param data - Request body
   * @returns Parsed JSON response
   */
  async put<T>(url: string, data: unknown): Promise<T> {
    const fullUrl = `${BASE_URL}${url}`;
    
    try {
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null) as ErrorResponse | null;
        throw new HttpError(response.status, response.statusText, errorResponse || undefined);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Perform PATCH request
   * @param url - Endpoint URL (relative to BASE_URL)
   * @param data - Request body
   * @returns Parsed JSON response
   */
  async patch<T>(url: string, data: unknown): Promise<T> {
    const fullUrl = `${BASE_URL}${url}`;
    
    try {
      const response = await fetch(fullUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null) as ErrorResponse | null;
        throw new HttpError(response.status, response.statusText, errorResponse || undefined);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Perform DELETE request
   * @param url - Endpoint URL (relative to BASE_URL)
   * @returns void for 204, or parsed JSON for other success codes
   */
  async delete<T = void>(url: string): Promise<T> {
    const fullUrl = `${BASE_URL}${url}`;
    
    try {
      const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null) as ErrorResponse | null;
        throw new HttpError(response.status, response.statusText, errorResponse || undefined);
      }

      // 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};
