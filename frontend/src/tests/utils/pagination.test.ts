import { describe, it, expect } from 'vitest';
import {
  calculatePageStartIndex,
  calculatePageEndIndex,
  shouldShowPagination,
  generatePageRange,
  formatPaginationInfo,
} from '@/utils/pagination';

describe('utils/pagination', () => {
  describe('calculatePageStartIndex', () => {
    it('calculates 1-based start index', () => {
      expect(calculatePageStartIndex(0, 10)).toBe(1);
      expect(calculatePageStartIndex(1, 10)).toBe(11);
      expect(calculatePageStartIndex(2, 5)).toBe(11);
    });
  });

  describe('calculatePageEndIndex', () => {
    it('calculates 1-based end index and clamps to total', () => {
      expect(calculatePageEndIndex(0, 10, 25)).toBe(10);
      expect(calculatePageEndIndex(2, 10, 25)).toBe(25);
      expect(calculatePageEndIndex(1, 10, 15)).toBe(20 - 5);
    });
  });

  describe('shouldShowPagination', () => {
    it('returns true for multiple pages', () => {
      expect(shouldShowPagination(1)).toBe(false);
      expect(shouldShowPagination(2)).toBe(true);
      expect(shouldShowPagination(0)).toBe(false);
    });
  });

  describe('generatePageRange', () => {
    it('generates range centered around current page when possible', () => {
      expect(generatePageRange(2, 10, 5)).toEqual([0, 1, 2, 3, 4]);
      expect(generatePageRange(0, 3, 5)).toEqual([0, 1, 2]);
    });
    it('adjusts start when near the end', () => {
      expect(generatePageRange(8, 10, 5)).toEqual([5, 6, 7, 8, 9]);
    });
  });

  describe('formatPaginationInfo', () => {
    it('formats human-readable pagination text', () => {
      expect(formatPaginationInfo(0, 10, 25)).toBe('Showing 1-10 of 25');
      expect(formatPaginationInfo(2, 10, 25)).toBe('Showing 21-25 of 25');
    });
  });
});
