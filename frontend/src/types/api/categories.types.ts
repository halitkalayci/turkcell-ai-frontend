/**
 * Category API types (OpenAPI mirror from categories-v1.yaml)
 */

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}
