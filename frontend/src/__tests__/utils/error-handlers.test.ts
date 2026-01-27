import { describe, it, expect } from 'vitest';
import {
  transformErrorMessage,
  extractFieldErrors,
  isNetworkError,
  isValidationError,
  isServerError,
} from '@/utils/error-handlers';
import { HttpError } from '@/api/client';
import type { ErrorResponse } from '@/types/api';

describe('utils/error-handlers', () => {
  describe('transformErrorMessage - HttpError mapping', () => {
    it('uses errorResponse.message for 400 and 422 when available', () => {
      const er400: ErrorResponse = { message: 'Bad request' };
      const er422: ErrorResponse = { message: 'Validation failed' };
      expect(transformErrorMessage(new HttpError(400, 'Bad Request', er400))).toBe('Bad request');
      expect(transformErrorMessage(new HttpError(422, 'Unprocessable Entity', er422))).toBe('Validation failed');
    });

    it('falls back to default messages for 400 and 422 when message missing', () => {
      expect(transformErrorMessage(new HttpError(400, 'Bad Request'))).toBe('Invalid request. Please check your input.');
      expect(transformErrorMessage(new HttpError(422, 'Unprocessable Entity'))).toBe('Validation failed. Please check your input.');
    });

    it('maps auth and permission errors', () => {
      expect(transformErrorMessage(new HttpError(401, 'Unauthorized'))).toBe('Authentication required. Please log in.');
      expect(transformErrorMessage(new HttpError(403, 'Forbidden'))).toBe('You do not have permission to perform this action.');
    });

    it('maps not found with capitalized context', () => {
      expect(transformErrorMessage(new HttpError(404, 'Not Found'), 'products')).toBe('Products not found. Please try again later.');
    });

    it('maps conflict, rate limit, server and gateway errors', () => {
      expect(transformErrorMessage(new HttpError(409, 'Conflict'))).toBe('This action conflicts with existing data. Please refresh and try again.');
      expect(transformErrorMessage(new HttpError(429, 'Too Many Requests'))).toBe('Too many requests. Please wait a moment and try again.');
      expect(transformErrorMessage(new HttpError(500, 'Internal Server Error'))).toBe('Server error. Please contact support if the problem persists.');
      expect(transformErrorMessage(new HttpError(502, 'Bad Gateway'))).toBe('Service temporarily unavailable. Please try again later.');
      expect(transformErrorMessage(new HttpError(503, 'Service Unavailable'))).toBe('Service temporarily unavailable. Please try again later.');
      expect(transformErrorMessage(new HttpError(504, 'Gateway Timeout'))).toBe('Request timeout. Please check your connection and try again.');
    });

    it('uses default message when provided or generic fallback', () => {
      const er: ErrorResponse = { message: 'Custom message' };
      expect(transformErrorMessage(new HttpError(418, "I'm a teapot", er), 'orders')).toBe('Custom message');
      expect(transformErrorMessage(new HttpError(418, "I'm a teapot"), 'orders')).toBe('Failed to load orders. Please try again.');
    });
  });

  describe('transformErrorMessage - generic Error mapping', () => {
    it('maps network-related errors', () => {
      expect(transformErrorMessage(new Error('Network error'))).toBe('Unable to connect to server. Please check your connection.');
      expect(transformErrorMessage(new Error('Failed to fetch'))).toBe('Unable to connect to server. Please check your connection.');
    });

    it('maps timeout errors', () => {
      expect(transformErrorMessage(new Error('Timeout waiting for response'))).toBe('Request timed out. Please try again.');
      expect(transformErrorMessage(new Error('timed out'))).toBe('Request timed out. Please try again.');
    });

    it('maps abort and CORS errors', () => {
      expect(transformErrorMessage(new Error('Request abort'))).toBe('Request was cancelled. Please try again.');
      expect(transformErrorMessage(new Error('CORS blocked'))).toBe('Connection blocked by security policy. Please contact support.');
    });

    it('maps JSON/parse errors', () => {
      expect(transformErrorMessage(new Error('JSON parse error'))).toBe('Invalid response format. Please contact support.');
      expect(transformErrorMessage(new Error('parse failure'))).toBe('Invalid response format. Please contact support.');
    });

    it('falls back to generic message with context', () => {
      expect(transformErrorMessage(new Error('Something unexpected'), 'data')).toBe('Failed to load data. Please try again.');
    });
  });

  describe('transformErrorMessage - unknown error', () => {
    it('returns generic unexpected error message', () => {
      expect(transformErrorMessage({})).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('extractFieldErrors', () => {
    it('returns empty object when not HttpError or no details', () => {
      expect(extractFieldErrors(new Error('x'))).toEqual({});
      const heNoDetails = new HttpError(422, 'Unprocessable Entity');
      expect(extractFieldErrors(heNoDetails)).toEqual({});
    });

    it('extracts field errors from HttpError errorResponse.details', () => {
      const er: ErrorResponse = {
        message: 'Validation failed',
        details: [
          { field: 'email', message: 'Invalid email format' },
          { field: 'password', message: 'Password too short' },
        ],
      };
      const he = new HttpError(422, 'Unprocessable Entity', er);
      expect(extractFieldErrors(he)).toEqual({
        email: 'Invalid email format',
        password: 'Password too short',
      });
    });
  });

  describe('type guard helpers', () => {
    it('isNetworkError detects network/fetch/connection in message', () => {
      expect(isNetworkError(new Error('network issue'))).toBe(true);
      expect(isNetworkError(new Error('fetch failed'))).toBe(true);
      expect(isNetworkError(new Error('connection lost'))).toBe(true);
      expect(isNetworkError(new Error('other'))).toBe(false);
      expect(isNetworkError('not-an-error' as unknown)).toBe(false);
    });

    it('isValidationError detects 4xx HttpError', () => {
      expect(isValidationError(new HttpError(400, 'Bad Request'))).toBe(true);
      expect(isValidationError(new HttpError(404, 'Not Found'))).toBe(true);
      expect(isValidationError(new HttpError(500, 'Server Error'))).toBe(false);
      expect(isValidationError(new Error('other'))).toBe(false);
    });

    it('isServerError detects 5xx HttpError', () => {
      expect(isServerError(new HttpError(500, 'Server Error'))).toBe(true);
      expect(isServerError(new HttpError(503, 'Service Unavailable'))).toBe(true);
      expect(isServerError(new HttpError(404, 'Not Found'))).toBe(false);
      expect(isServerError(new Error('other'))).toBe(false);
    });
  });
});
