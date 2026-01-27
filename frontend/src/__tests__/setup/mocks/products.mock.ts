import type { Product, ProductV2, ErrorResponse } from '@/types/api';

/**
 * Mock data for v1 products
 */
export const mockProductsV1: Product[] = [
  {
    id: '1',
    sku: 'IPH15-128-BLK',
    name: 'iPhone 15',
    description: 'Latest iPhone with A17 chip and USB-C',
    price: 999.99,
    currency: 'USD',
    inStock: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    sku: 'PIX9-256-WHT',
    name: 'Pixel 9',
    description: 'Google Pixel 9 with Tensor G4',
    price: 799.99,
    currency: 'USD',
    inStock: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    sku: 'GAL-S24-512-GRY',
    name: 'Galaxy S24',
    description: 'Samsung Galaxy S24 Ultra',
    price: 1199.99,
    currency: 'USD',
    inStock: false,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

/**
 * Mock data for v2 products (with additional fields)
 */
export const mockProductsV2: ProductV2[] = [
  {
    id: '1',
    sku: 'IPH15-128-BLK',
    name: 'iPhone 15',
    description: 'Latest iPhone with A17 chip and USB-C',
    price: 999.99,
    currency: 'USD',
    inStock: true,
    rating: 4.5,
    imageUrl: 'https://example.com/iphone15.jpg',
    discountPercent: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    sku: 'PIX9-256-WHT',
    name: 'Pixel 9',
    description: 'Google Pixel 9 with Tensor G4',
    price: 799.99,
    currency: 'USD',
    inStock: true,
    rating: 4.3,
    imageUrl: 'https://example.com/pixel9.jpg',
    discountPercent: 10,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    sku: 'GAL-S24-512-GRY',
    name: 'Galaxy S24',
    description: 'Samsung Galaxy S24 Ultra',
    price: 1199.99,
    currency: 'USD',
    inStock: false,
    rating: 4.7,
    imageUrl: 'https://example.com/galaxy-s24.jpg',
    discountPercent: null,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

/**
 * Mock paginated response for v1
 */
export const mockPaginatedResponseV1 = {
  items: mockProductsV1,
  page: 0,
  size: 10,
  totalElements: 3,
  totalPages: 1,
};

/**
 * Mock paginated response for v2
 */
export const mockPaginatedResponseV2 = {
  items: mockProductsV2,
  page: 0,
  size: 10,
  totalElements: 3,
  totalPages: 1,
};

/**
 * Mock empty paginated response
 */
export const mockEmptyResponse = {
  items: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
};

/**
 * Mock error responses
 */
export const mockErrorResponse: ErrorResponse = {
  message: 'Internal server error',
  details: [],
};

export const mockValidationErrorResponse: ErrorResponse = {
  message: 'Validation failed',
  details: [
    { field: 'name', message: 'Name is required' },
    { field: 'price', message: 'Price must be positive' },
  ],
};

export const mockNotFoundErrorResponse: ErrorResponse = {
  message: 'Product not found',
  details: [],
};
