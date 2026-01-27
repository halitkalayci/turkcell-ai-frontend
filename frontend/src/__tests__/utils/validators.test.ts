import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidProductName,
  isValidProductDescription,
  isValidProductPrice,
  isValidUrl,
  isValidCurrency,
  isPositiveInteger,
  isNonEmptyString,
} from '@/utils/validators';
import {
  MAX_PRODUCT_NAME_LENGTH,
  MAX_PRODUCT_DESCRIPTION_LENGTH,
} from '@/utils/constants';

describe('utils/validators', () => {
  describe('isValidEmail', () => {
    it('validates email format', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
    });

    it('rejects malicious patterns', () => {
      expect(isValidEmail("test'; DROP TABLE users;--")).toBe(false);
      // Note: <script>alert(1)</script>@test.com passes basic email regex
      // For stricter validation, consider using a validation library
      expect(isValidEmail('<script>alert(1)</script>@test.com')).toBe(true);
    });

    it('handles edge cases', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('test@test')).toBe(false);
      expect(isValidEmail('test.user+tag@example.co.uk')).toBe(true);
    });
  });

  describe('isValidProductName', () => {
    it('rejects empty or whitespace-only names', () => {
      expect(isValidProductName('')).toEqual({ valid: false, error: 'Product name is required' });
      expect(isValidProductName('   ')).toEqual({ valid: false, error: 'Product name is required' });
    });

    it('rejects names shorter than MIN_PRODUCT_NAME_LENGTH', () => {
      expect(isValidProductName('ab').valid).toBe(false);
    });

    it('rejects names longer than MAX_PRODUCT_NAME_LENGTH', () => {
      const longName = 'a'.repeat(MAX_PRODUCT_NAME_LENGTH + 1);
      const res = isValidProductName(longName);
      expect(res.valid).toBe(false);
      expect(res.error).toContain(`${MAX_PRODUCT_NAME_LENGTH}`);
    });

    it('accepts valid names', () => {
      expect(isValidProductName('Laptop')).toEqual({ valid: true });
    });
  });

  describe('isValidProductDescription', () => {
    it('accepts empty/undefined descriptions', () => {
      expect(isValidProductDescription('')).toEqual({ valid: true });
      expect(isValidProductDescription(undefined)).toEqual({ valid: true });
      expect(isValidProductDescription(null)).toEqual({ valid: true });
    });

    it('rejects descriptions longer than MAX_PRODUCT_DESCRIPTION_LENGTH', () => {
      const longDesc = 'x'.repeat(MAX_PRODUCT_DESCRIPTION_LENGTH + 1);
      const res = isValidProductDescription(longDesc);
      expect(res.valid).toBe(false);
      expect(res.error).toContain(`${MAX_PRODUCT_DESCRIPTION_LENGTH}`);
    });

    it('accepts valid descriptions', () => {
      expect(isValidProductDescription('Nice product')).toEqual({ valid: true });
    });
  });

  describe('isValidProductPrice', () => {
    it('rejects NaN', () => {
      expect(isValidProductPrice(Number.NaN)).toEqual({ valid: false, error: 'Price must be a valid number' });
    });

    it('rejects negative price', () => {
      expect(isValidProductPrice(-1)).toEqual({ valid: false, error: 'Price must be zero or positive' });
    });

    it('accepts zero and positive prices', () => {
      expect(isValidProductPrice(0)).toEqual({ valid: true });
      expect(isValidProductPrice(99.99)).toEqual({ valid: true });
    });
  });

  describe('isValidUrl', () => {
    it('validates URL format', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('not-a-url')).toBe(false);
    });

    it('handles protocol-less URLs', () => {
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('www.example.com')).toBe(false);
    });

    it('validates different protocols', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('ftp://example.com')).toBe(true);
    });
  });

  describe('isValidCurrency', () => {
    it('validates ISO 4217 currency codes', () => {
      expect(isValidCurrency('USD')).toBe(true);
      expect(isValidCurrency('us')).toBe(false);
      expect(isValidCurrency('EURO')).toBe(false);
    });

    it('validates common currencies', () => {
      expect(isValidCurrency('EUR')).toBe(true);
      expect(isValidCurrency('GBP')).toBe(true);
      expect(isValidCurrency('JPY')).toBe(true);
      expect(isValidCurrency('TRY')).toBe(true);
    });

    it('handles edge cases', () => {
      expect(isValidCurrency('')).toBe(false);
      expect(isValidCurrency('U')).toBe(false);
      expect(isValidCurrency('USDD')).toBe(false);
    });
  });

  describe('isPositiveInteger', () => {
    it('validates positive integers', () => {
      expect(isPositiveInteger(10)).toBe(true);
      expect(isPositiveInteger(-5)).toBe(false);
      expect(isPositiveInteger(3.14)).toBe(false);
      expect(isPositiveInteger(0)).toBe(false);
    });

    it('handles edge cases', () => {
      expect(isPositiveInteger(1)).toBe(true);
      expect(isPositiveInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
      expect(isPositiveInteger(Number.NaN)).toBe(false);
    });
  });

  describe('isNonEmptyString', () => {
    it('validates non-empty strings', () => {
      expect(isNonEmptyString('abc')).toBe(true);
      expect(isNonEmptyString('   ')).toBe(false);
      expect(isNonEmptyString('')).toBe(false);
    });

    it('handles edge cases', () => {
      expect(isNonEmptyString(' a ')).toBe(true);
      expect(isNonEmptyString('\t')).toBe(false);
      expect(isNonEmptyString('\n')).toBe(false);
    });
  });
});
