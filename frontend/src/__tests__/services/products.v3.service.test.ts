import { describe, it, expect } from 'vitest';
import { productsV3Service } from '@/services/products.v3.service';
import { mockProductsV3 } from '../setup/mocks/products.v3.mock';

describe('products.v3.service', () => {
  describe('getAllProducts', () => {
    it('should return all products without filters', async () => {
      const result = await productsV3Service.getAllProducts({});
      
      expect(result.items).toEqual(mockProductsV3);
      expect(result.items).toHaveLength(3);
    });

    it('should return products with pagination params', async () => {
      const result = await productsV3Service.getAllProducts({ page: 0, size: 2 });
      
      expect(result.page).toBe(0);
      expect(result.size).toBe(2);
    });

    it('should filter products by categoryId', async () => {
      const result = await productsV3Service.getAllProducts({ categoryId: '1' });
      
      const filteredProducts = result.items.filter(p => p.category.id === '1');
      expect(filteredProducts).toHaveLength(2);
      expect(filteredProducts.every(p => p.category.id === '1')).toBe(true);
    });

    it('should return products with category reference', async () => {
      const result = await productsV3Service.getAllProducts({});
      
      expect(result.items[0]).toHaveProperty('category');
      expect(result.items[0].category).toHaveProperty('id');
      expect(result.items[0].category).toHaveProperty('name');
    });
  });
});
