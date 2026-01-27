import { describe, it, expect } from 'vitest';
import { categoriesService } from '@/services/categories.service';
import { mockCategories } from '../setup/mocks/categories.mock';
import { MIN_CATEGORY_NAME_LENGTH, MAX_CATEGORY_NAME_LENGTH } from '@/utils/constants';

describe('categories.service', () => {
  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const result = await categoriesService.getAllCategories();
      
      expect(result).toEqual(mockCategories);
      expect(result).toHaveLength(5);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      const result = await categoriesService.getCategoryById('1');
      
      expect(result).toEqual(mockCategories[0]);
      expect(result.id).toBe('1');
    });

    it('should throw error for non-existent category', async () => {
      await expect(categoriesService.getCategoryById('999')).rejects.toThrow();
    });
  });

  describe('createCategory', () => {
    it('should create a category with valid name', async () => {
      const newCategory = { name: 'Test Category' };
      const result = await categoriesService.createCategory(newCategory);
      
      expect(result).toHaveProperty('id');
      expect(result.name).toBe('Test Category');
    });

    it('should throw error when name is too short', async () => {
      const invalidCategory = { name: 'A' }; // Less than MIN_CATEGORY_NAME_LENGTH (2)
      
      await expect(categoriesService.createCategory(invalidCategory)).rejects.toThrow(
        'Category name must be between 2 and 50 characters'
      );
    });

    it('should throw error when name is too long', async () => {
      const invalidCategory = { name: 'A'.repeat(MAX_CATEGORY_NAME_LENGTH + 1) }; // More than MAX (50)
      
      await expect(categoriesService.createCategory(invalidCategory)).rejects.toThrow(
        'Category name must be between 2 and 50 characters'
      );
    });

    it('should throw error when name is empty', async () => {
      const invalidCategory = { name: '' };
      
      await expect(categoriesService.createCategory(invalidCategory)).rejects.toThrow(
        'Category name must be between 2 and 50 characters'
      );
    });

    it('should accept name with exactly MIN_CATEGORY_NAME_LENGTH characters', async () => {
      const validCategory = { name: 'AB' }; // Exactly 2 characters
      const result = await categoriesService.createCategory(validCategory);
      
      expect(result.name).toBe('AB');
    });

    it('should accept name with exactly MAX_CATEGORY_NAME_LENGTH characters', async () => {
      const validCategory = { name: 'A'.repeat(MAX_CATEGORY_NAME_LENGTH) }; // Exactly 50 characters
      const result = await categoriesService.createCategory(validCategory);
      
      expect(result.name).toHaveLength(MAX_CATEGORY_NAME_LENGTH);
    });
  });

  describe('updateCategory', () => {
    it('should update a category with valid name', async () => {
      const updates = { name: 'Updated Category' };
      const result = await categoriesService.updateCategory('1', updates);
      
      expect(result.id).toBe('1');
      expect(result.name).toBe('Updated Category');
    });

    it('should throw error when update name is too short', async () => {
      const invalidUpdates = { name: 'X' };
      
      await expect(categoriesService.updateCategory('1', invalidUpdates)).rejects.toThrow(
        'Category name must be between 2 and 50 characters'
      );
    });

    it('should throw error when update name is too long', async () => {
      const invalidUpdates = { name: 'X'.repeat(MAX_CATEGORY_NAME_LENGTH + 1) };
      
      await expect(categoriesService.updateCategory('1', invalidUpdates)).rejects.toThrow(
        'Category name must be between 2 and 50 characters'
      );
    });

    it('should throw error for non-existent category', async () => {
      const updates = { name: 'Valid Name' };
      
      await expect(categoriesService.updateCategory('999', updates)).rejects.toThrow();
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category successfully', async () => {
      // Category id='5' has no products
      await expect(categoriesService.deleteCategory('5')).resolves.toBeUndefined();
    });

    it('should throw error when deleting non-existent category', async () => {
      await expect(categoriesService.deleteCategory('999')).rejects.toThrow();
    });

    it('should throw error when category has products', async () => {
      // Category id='1' has products
      await expect(categoriesService.deleteCategory('1')).rejects.toThrow();
    });
  });
});
