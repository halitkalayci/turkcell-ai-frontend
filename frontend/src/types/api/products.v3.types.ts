/**
 * Product V3 API types (OpenAPI mirror from products-v3.yaml)
 */

export interface CategoryRef {
  id: string;
  name: string;
}

export interface ProductV3 {
  id: string;
  sku?: string | null;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  inStock: boolean;
  imageUrl?: string | null;
  discountPercent?: number | null;
  rating?: number | null;
  category: CategoryRef;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductV3Request {
  sku?: string | null;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  inStock: boolean;
  imageUrl: string;
  discountPercent: number;
  rating: number;
  categoryId: string;
}

export interface UpdateProductV3Request {
  sku?: string | null;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  inStock: boolean;
  imageUrl: string;
  discountPercent: number;
  rating: number;
  categoryId: string;
}

export interface PatchProductV3Request {
  sku?: string | null;
  name?: string;
  description?: string | null;
  price?: number;
  currency?: string;
  inStock?: boolean;
  imageUrl?: string | null;
  discountPercent?: number | null;
  rating?: number | null;
  categoryId?: string;
}

export interface ProductResponseV3 {
  product: ProductV3;
}

export interface ProductPageResponseV3 {
  items: ProductV3[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
