import { describe, it, expect } from 'vitest';
import { 
  truncateText,
  formatPrice,
  formatDate,
  formatRating,
  formatDiscount,
} from '@/utils/formatters';

describe('utils/formatters', () => {
  describe('truncateText', () => {
    it('returns empty string for null/undefined/empty', () => {
      expect(truncateText(null, 10)).toBe('');
      expect(truncateText(undefined, 10)).toBe('');
      expect(truncateText('', 10)).toBe('');
    });

    it('returns original when length <= maxLength', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
      expect(truncateText('Hello', 5)).toBe('Hello');
    });

    it('truncates and adds ellipsis when length > maxLength', () => {
      expect(truncateText('HelloWorld', 5)).toBe('Hello...');
      expect(truncateText('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 3)).toBe('ABC...');
    });
  });

  describe('formatPrice', () => {
    it('formats price with two decimals and currency', () => {
      expect(formatPrice(99.99, 'USD')).toBe('99.99 USD');
      expect(formatPrice(1234.5, 'TRY')).toBe('1234.50 TRY');
      expect(formatPrice(0, 'EUR')).toBe('0.00 EUR');
    });
  });

  describe('formatDate', () => {
    it('formats date string to locale string', () => {
      const input = '2024-01-15';
      expect(formatDate(input)).toBe(new Date(input).toLocaleDateString());
    });
    it('formats Date object to locale string', () => {
      const now = new Date();
      expect(formatDate(now)).toBe(now.toLocaleDateString());
    });
  });

  describe('formatRating', () => {
    it('ceil rounds and clamps between 0 and max', () => {
      expect(formatRating(3.2)).toBe('4/5');
      expect(formatRating(4.7)).toBe('5/5');
      expect(formatRating(-1)).toBe('0/5');
      expect(formatRating(5.2)).toBe('5/5');
    });
    it('supports custom max value', () => {
      expect(formatRating(9.1, 10)).toBe('10/10');
      expect(formatRating(-0.1, 10)).toBe('0/10');
    });
  });

  describe('formatDiscount', () => {
    it('rounds to nearest integer and appends % OFF', () => {
      expect(formatDiscount(10)).toBe('10% OFF');
      expect(formatDiscount(25.5)).toBe('26% OFF');
      expect(formatDiscount(99.4)).toBe('99% OFF');
      expect(formatDiscount(100)).toBe('100% OFF');
    });
  });
});
