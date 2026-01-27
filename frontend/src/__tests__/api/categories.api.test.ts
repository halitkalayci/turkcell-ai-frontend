import { describe, it, expect, beforeEach } from 'vitest';
import { 
  listCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '@/api/categories.api';
import { mockCategories } from '../setup/mocks/categories.mock';

describe('categories.api', () => {
  describe('listCategories', () => {
    it('should fetch all categories successfully', async () => {
      const result = await listCategories();
      
      expect(result).toEqual(mockCategories);
      expect(result).toHaveLength(5);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('createdAt');
      expect(result[0]).toHaveProperty('updatedAt');
    });
  });

  describe('getCategoryById', () => {
    it('should fetch a category by id successfully', async () => {
      const result = await getCategoryById('1');
      
      expect(result).toEqual(mockCategories[0]);
      expect(result.id).toBe('1');
      expect(result.name).toBe('Smartphones');
    });

    it('should throw 404 error when category not found', async () => {
      await expect(getCategoryById('999')).rejects.toThrow();
    });
  });

  describe('createCategory', () => {
    beforeEach(() => {
      // Reset mock categories to initial state by removing added items
      while (mockCategories.length > 5) {
        mockCategories.pop();
      }
    });

    it('should create a new category successfully', async () => {
      const newCategory = { name: 'New Category' };
      const result = await createCategory(newCategory);
      
      expect(result).toHaveProperty('id');
      expect(result.name).toBe('New Category');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should throw 409 error when category name already exists', async () => {
      const duplicateCategory = { name: 'Smartphones' }; // Already exists in mockCategories
      
      await expect(createCategory(duplicateCategory)).rejects.toThrow();
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category successfully', async () => {
      const updates = { name: 'Updated Smartphones' };
      const result = await updateCategory('1', updates);
      
      expect(result.id).toBe('1');
      expect(result.name).toBe('Updated Smartphones');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should throw 404 error when updating non-existent category', async () => {
      const updates = { name: 'Updated Name' };
      
      await expect(updateCategory('999', updates)).rejects.toThrow();
    });

    it('should throw 409 error when updating to an existing category name', async () => {
      const updates = { name: 'Laptops' }; // Already exists for id='2'
      
      await expect(updateCategory('1', updates)).rejects.toThrow();
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category successfully when it has no products', async () => {
      // Category id='5' (Audio) has no products in mockProductsV3
      await expect(deleteCategory('5')).resolves.toBeUndefined();
    });

    it('should throw 404 error when deleting non-existent category', async () => {
      await expect(deleteCategory('999')).rejects.toThrow();
    });

    it('should throw 409 error when category has products', async () => {
      // Category id='1' (Smartphones) has products in mockProductsV3
      await expect(deleteCategory('1')).rejects.toThrow();
    });
  });
});
