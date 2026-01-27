import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useCategories, useCategoryMutations } from '@/hooks/useCategories';
import { mockCategories } from '../setup/mocks/categories.mock';

describe('useCategories', () => {
  describe('useCategories hook', () => {
    it('should fetch categories successfully', async () => {
      const { result } = renderHook(() => useCategories());
      
      expect(result.current.loading).toBe(true);
      expect(result.current.categories).toEqual([]);
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.error).toBeNull();
    });

    it('should refetch categories when refetchTrigger changes', async () => {
      const { result, rerender } = renderHook(() => useCategories());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      const initialCategories = result.current.categories;
      expect(initialCategories).toEqual(mockCategories);
      
      // Trigger refetch
      act(() => {
        result.current.refetch();
      });
      
      rerender();
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.categories).toEqual(mockCategories);
    });
  });

  describe('useCategoryMutations hook', () => {
    beforeEach(() => {
      // Reset mock categories
      while (mockCategories.length > 5) {
        mockCategories.pop();
      }
    });

    it('should create a new category successfully', async () => {
      const { result } = renderHook(() => useCategoryMutations());
      
      expect(result.current.creating).toBe(false);
      
      const newCategory = { name: 'New Test Category' };
      const createdCategory = await result.current.createCategory(newCategory);
      
      expect(createdCategory).toHaveProperty('id');
      expect(createdCategory.name).toBe('New Test Category');
      expect(result.current.creating).toBe(false);
    });

    it('should transform duplicate name error to Turkish', async () => {
      const { result } = renderHook(() => useCategoryMutations());
      
      const duplicateCategory = { name: 'Smartphones' }; // Already exists
      
      await expect(result.current.createCategory(duplicateCategory)).rejects.toThrow('Bu isimde bir kategori zaten mevcut');
    });

    it('should update a category successfully', async () => {
      const { result } = renderHook(() => useCategoryMutations());
      
      const updates = { name: 'Updated Category Name' };
      const updatedCategory = await result.current.updateCategory('1', updates);
      
      expect(updatedCategory.id).toBe('1');
      expect(updatedCategory.name).toBe('Updated Category Name');
      expect(result.current.updating).toBe(false);
    });

    it('should delete a category successfully', async () => {
      const { result } = renderHook(() => useCategoryMutations());
      
      await expect(result.current.deleteCategory('5')).resolves.toBeUndefined();
      expect(result.current.deleting).toBe(false);
    });

    it('should transform category has products error to Turkish', async () => {
      const { result } = renderHook(() => useCategoryMutations());
      
      await expect(result.current.deleteCategory('1')).rejects.toThrow('Bu kategoriye ait ürünler var, önce ürünleri taşıyın veya silin');
    });

    it('should transform not found error to Turkish', async () => {
      const { result } = renderHook(() => useCategoryMutations());
      
      const updates = { name: 'Test' };
      await expect(result.current.updateCategory('999', updates)).rejects.toThrow('Category with id 999 not found');
    });

    it('should handle consecutive operations correctly', async () => {
      const { result } = renderHook(() => useCategoryMutations());
      
      // First operation - create
      const created = await result.current.createCategory({ name: 'First Category' });
      expect(created.name).toBe('First Category');
      expect(result.current.creating).toBe(false);
      
      // Second operation - update
      const updated = await result.current.updateCategory(created.id, { name: 'Updated First' });
      expect(updated.name).toBe('Updated First');
      expect(result.current.updating).toBe(false);
    });
  });
});
