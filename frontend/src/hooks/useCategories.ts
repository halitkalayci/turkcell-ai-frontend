import { useState, useEffect } from 'react';
import { categoriesService } from '@/services/categories.service';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api/categories.types';

interface UseCategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook for managing category list state
 */
export function useCategories(): UseCategoriesState {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoriesService.getAllCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { categories, loading, error, refetch };
}

interface UseCategoryMutationsResult {
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  createCategory: (request: CreateCategoryRequest) => Promise<Category>;
  updateCategory: (id: string, request: UpdateCategoryRequest) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
}

/**
 * Hook for category mutations (create, update, delete)
 */
export function useCategoryMutations(): UseCategoryMutationsResult {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const createCategory = async (request: CreateCategoryRequest): Promise<Category> => {
    setCreating(true);
    try {
      const category = await categoriesService.createCategory(request);
      return category;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create category';
      // Transform backend errors to user-friendly messages
      if (message.includes('already exists')) {
        throw new Error('Bu isimde bir kategori zaten mevcut');
      }
      throw new Error(message);
    } finally {
      setCreating(false);
    }
  };

  const updateCategory = async (id: string, request: UpdateCategoryRequest): Promise<Category> => {
    setUpdating(true);
    try {
      const category = await categoriesService.updateCategory(id, request);
      return category;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update category';
      // Transform backend errors to user-friendly messages
      if (message.includes('already exists')) {
        throw new Error('Bu isimde bir kategori zaten mevcut');
      }
      throw new Error(message);
    } finally {
      setUpdating(false);
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    setDeleting(true);
    try {
      await categoriesService.deleteCategory(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete category';
      // Transform backend errors to user-friendly messages
      if (message.includes('has products')) {
        throw new Error('Bu kategoriye ait ürünler var, önce ürünleri taşıyın veya silin');
      }
      throw new Error(message);
    } finally {
      setDeleting(false);
    }
  };

  return { creating, updating, deleting, createCategory, updateCategory, deleteCategory };
}
