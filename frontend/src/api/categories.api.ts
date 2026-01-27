import { httpClient } from './client';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api/categories.types';

/**
 * List all categories
 */
export async function listCategories(): Promise<Category[]> {
  return httpClient.get<Category[]>('/api/v1/categories');
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string): Promise<Category> {
  return httpClient.get<Category>(`/api/v1/categories/${id}`);
}

/**
 * Create a new category
 */
export async function createCategory(request: CreateCategoryRequest): Promise<Category> {
  return httpClient.post<Category>('/api/v1/categories', request);
}

/**
 * Update category
 */
export async function updateCategory(id: string, request: UpdateCategoryRequest): Promise<Category> {
  return httpClient.put<Category>(`/api/v1/categories/${id}`, request);
}

/**
 * Delete category
 */
export async function deleteCategory(id: string): Promise<void> {
  return httpClient.delete(`/api/v1/categories/${id}`);
}
