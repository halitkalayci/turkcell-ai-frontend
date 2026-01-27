import * as categoriesApi from '@/api/categories.api';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api/categories.types';

/**
 * Service layer for categories - business logic and API delegation
 */
export const categoriesService = {
  /**
   * Get all categories
   */
  async getAllCategories(): Promise<Category[]> {
    return await categoriesApi.listCategories();
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    return await categoriesApi.getCategoryById(id);
  },

  /**
   * Create new category
   */
  async createCategory(request: CreateCategoryRequest): Promise<Category> {
    // Validate name length (2-50 characters)
    if (request.name.length < 2 || request.name.length > 50) {
      throw new Error('Category name must be between 2 and 50 characters');
    }

    return await categoriesApi.createCategory(request);
  },

  /**
   * Update category
   */
  async updateCategory(id: string, request: UpdateCategoryRequest): Promise<Category> {
    // Validate name length (2-50 characters)
    if (request.name.length < 2 || request.name.length > 50) {
      throw new Error('Category name must be between 2 and 50 characters');
    }

    return await categoriesApi.updateCategory(id, request);
  },

  /**
   * Delete category
   */
  async deleteCategory(id: string): Promise<void> {
    return await categoriesApi.deleteCategory(id);
  },
};
