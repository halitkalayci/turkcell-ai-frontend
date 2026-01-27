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

    it('handles edge cases', () => {
      expect(calculatePageStartIndex(0, 1)).toBe(1);
      expect(calculatePageStartIndex(10, 100)).toBe(1001);
    });
  });

  describe('calculatePageEndIndex', () => {
    it('calculates 1-based end index and clamps to total', () => {
      expect(calculatePageEndIndex(0, 10, 25)).toBe(10);
      expect(calculatePageEndIndex(2, 10, 25)).toBe(25);
      expect(calculatePageEndIndex(1, 10, 15)).toBe(15);
    });

    it('handles zero total items', () => {
      expect(calculatePageEndIndex(0, 10, 0)).toBe(0);
      expect(calculatePageEndIndex(1, 10, 0)).toBe(0);
    });

    it('handles single item', () => {
      expect(calculatePageEndIndex(0, 10, 1)).toBe(1);
    });
  });

  describe('shouldShowPagination', () => {
    it('returns true for multiple pages', () => {
      expect(shouldShowPagination(1)).toBe(false);
      expect(shouldShowPagination(2)).toBe(true);
      expect(shouldShowPagination(0)).toBe(false);
    });

    it('handles large page counts', () => {
      expect(shouldShowPagination(100)).toBe(true);
      expect(shouldShowPagination(1000)).toBe(true);
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

    it('handles single page scenario', () => {
      expect(generatePageRange(0, 1, 5)).toEqual([0]);
    });

    it('handles maxButtons larger than total pages', () => {
      expect(generatePageRange(1, 3, 10)).toEqual([0, 1, 2]);
    });

    it('handles zero-based page indexing correctly', () => {
      expect(generatePageRange(0, 5, 3)).toEqual([0, 1, 2]);
      expect(generatePageRange(4, 5, 3)).toEqual([2, 3, 4]);
    });
  });

  describe('formatPaginationInfo', () => {
    it('formats human-readable pagination text', () => {
      expect(formatPaginationInfo(0, 10, 25)).toBe('Showing 1-10 of 25');
      expect(formatPaginationInfo(2, 10, 25)).toBe('Showing 21-25 of 25');
    });

    it('handles zero items', () => {
      expect(formatPaginationInfo(0, 10, 0)).toBe('Showing 0-0 of 0');
    });

    it('handles single item', () => {
      expect(formatPaginationInfo(0, 10, 1)).toBe('Showing 1-1 of 1');
    });

    it('handles first page correctly', () => {
      expect(formatPaginationInfo(0, 5, 20)).toBe('Showing 1-5 of 20');
    });

    it('handles last page correctly', () => {
      expect(formatPaginationInfo(3, 5, 18)).toBe('Showing 16-18 of 18');
    });
  });
});
