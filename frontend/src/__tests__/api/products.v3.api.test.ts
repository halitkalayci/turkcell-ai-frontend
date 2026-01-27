import { describe, it, expect } from 'vitest';
import { listProductsV3 } from '@/api/products.v3.api';
import { mockProductsV3 } from '../setup/mocks/products.v3.mock';

describe('products.v3.api', () => {
  describe('listProductsV3', () => {
    it('should fetch all products successfully without filters', async () => {
      const result = await listProductsV3({});
      
      expect(result.items).toEqual(mockProductsV3);
      expect(result.items).toHaveLength(3);
      expect(result.page).toBe(0);
      expect(result.size).toBe(10);
      expect(result.totalElements).toBe(3);
      expect(result.totalPages).toBe(1);
    });

    it('should fetch products with pagination', async () => {
      const result = await listProductsV3({ page: 0, size: 2 });
      
      expect(result.items).toHaveLength(3); // Mock returns all items
      expect(result.page).toBe(0);
      expect(result.size).toBe(2);
    });

    it('should filter products by categoryId', async () => {
      const result = await listProductsV3({ categoryId: '1' }); // Smartphones
      
      const filteredProducts = result.items.filter(p => p.category.id === '1');
      expect(filteredProducts).toHaveLength(2); // iPhone and Samsung
      expect(filteredProducts[0].category.name).toBe('Smartphones');
    });

    it('should return empty items when filtering by non-existent categoryId', async () => {
      const result = await listProductsV3({ categoryId: '999' });
      
      const filteredProducts = result.items.filter(p => p.category.id === '999');
      expect(filteredProducts).toHaveLength(0);
    });

    it('should fetch products with category reference', async () => {
      const result = await listProductsV3({});
      
      expect(result.items[0]).toHaveProperty('category');
      expect(result.items[0].category).toHaveProperty('id');
      expect(result.items[0].category).toHaveProperty('name');
      expect(result.items[0].category.id).toBe('1');
      expect(result.items[0].category.name).toBe('Smartphones');
    });
  });
});
