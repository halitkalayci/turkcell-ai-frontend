import { http, HttpResponse, delay } from 'msw';
import { mockProductsV1, mockProductsV2 } from '@/__tests__/setup/mocks/products.mock';
import { mockProductsV3 } from '@/__tests__/setup/mocks/products.v3.mock';
import { mockCategories } from '@/__tests__/setup/mocks/categories.mock';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api/categories.types';

// Base URL from env (fallback to development default)
// IMPORTANT: Must match client.ts default (8080) for tests to work with MSW
const BASE_URL = (process.env.VITE_API_BASE_URL as string) || 'http://localhost:8080';

// Configuration for simulating delays (useful for loading state testing)
const ENABLE_DELAY = false; // Set to true to simulate network delay
const DELAY_MS = 100; // Delay in milliseconds

// Helper to build paginated responses (matches OpenAPI schema)
const buildPaginatedResponse = <T,>(items: T[], page = 0, size = 10) => ({
  items,
  page,
  size,
  totalElements: items.length,
  totalPages: Math.ceil(items.length / size),
});

export const handlers = [
  // v1: GET /api/v1/products (relative path)
  http.get('/api/v1/products', async ({ request }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    
    return HttpResponse.json(buildPaginatedResponse(mockProductsV1, page, size));
  }),

  // v1: GET /api/v1/products (absolute path with BASE_URL)
  http.get(`${BASE_URL}/api/v1/products`, async ({ request }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    
    return HttpResponse.json(buildPaginatedResponse(mockProductsV1, page, size));
  }),

  // v2: GET /api/v2/products (relative path)
  http.get('/api/v2/products', async ({ request }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    
    return HttpResponse.json(buildPaginatedResponse(mockProductsV2, page, size));
  }),

  // v2: GET /api/v2/products (absolute path with BASE_URL)
  http.get(`${BASE_URL}/api/v2/products`, async ({ request }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    
    return HttpResponse.json(buildPaginatedResponse(mockProductsV2, page, size));
  }),

  // v1: GET /api/v1/categories (list)
  http.get('/api/v1/categories', async () => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    return HttpResponse.json(mockCategories);
  }),

  http.get(`${BASE_URL}/api/v1/categories`, async () => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    return HttpResponse.json(mockCategories);
  }),

  // v1: GET /api/v1/categories/:id (by id)
  http.get('/api/v1/categories/:id', async ({ params }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const { id } = params;
    const category = mockCategories.find(c => c.id === id);
    
    if (!category) {
      return HttpResponse.json(
        { message: `Category with id ${id} not found`, timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(category);
  }),

  http.get(`${BASE_URL}/api/v1/categories/:id`, async ({ params }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const { id } = params;
    const category = mockCategories.find(c => c.id === id);
    
    if (!category) {
      return HttpResponse.json(
        { message: `Category with id ${id} not found`, timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(category);
  }),

  // v1: POST /api/v1/categories (create)
  http.post('/api/v1/categories', async ({ request }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const body = await request.json() as CreateCategoryRequest;
    
    // Check duplicate name
    const exists = mockCategories.some(c => c.name === body.name);
    if (exists) {
      return HttpResponse.json(
        { message: 'Bu isimde bir kategori zaten mevcut', timestamp: new Date().toISOString() },
        { status: 409 }
      );
    }
    
    const newCategory: Category = {
      id: String(mockCategories.length + 1),
      name: body.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockCategories.push(newCategory);
    return HttpResponse.json(newCategory, { status: 201 });
  }),

  http.post(`${BASE_URL}/api/v1/categories`, async ({ request }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const body = await request.json() as CreateCategoryRequest;
    
    // Check duplicate name
    const exists = mockCategories.some(c => c.name === body.name);
    if (exists) {
      return HttpResponse.json(
        { message: 'Bu isimde bir kategori zaten mevcut', timestamp: new Date().toISOString() },
        { status: 409 }
      );
    }
    
    const newCategory: Category = {
      id: String(mockCategories.length + 1),
      name: body.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockCategories.push(newCategory);
    return HttpResponse.json(newCategory, { status: 201 });
  }),

  // v1: PUT /api/v1/categories/:id (update)
  http.put('/api/v1/categories/:id', async ({ params, request }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const { id } = params;
    const body = await request.json() as UpdateCategoryRequest;
    
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { message: `Category with id ${id} not found`, timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }
    
    // Check duplicate name (exclude current category)
    const duplicateExists = mockCategories.some(c => c.id !== id && c.name === body.name);
    if (duplicateExists) {
      return HttpResponse.json(
        { message: 'Bu isimde bir kategori zaten mevcut', timestamp: new Date().toISOString() },
        { status: 409 }
      );
    }
    
    mockCategories[index] = {
      ...mockCategories[index],
      name: body.name,
      updatedAt: new Date().toISOString(),
    };
    
    return HttpResponse.json(mockCategories[index]);
  }),

  http.put(`${BASE_URL}/api/v1/categories/:id`, async ({ params, request }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const { id } = params;
    const body = await request.json() as UpdateCategoryRequest;
    
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { message: `Category with id ${id} not found`, timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }
    
    // Check duplicate name (exclude current category)
    const duplicateExists = mockCategories.some(c => c.id !== id && c.name === body.name);
    if (duplicateExists) {
      return HttpResponse.json(
        { message: 'Bu isimde bir kategori zaten mevcut', timestamp: new Date().toISOString() },
        { status: 409 }
      );
    }
    
    mockCategories[index] = {
      ...mockCategories[index],
      name: body.name,
      updatedAt: new Date().toISOString(),
    };
    
    return HttpResponse.json(mockCategories[index]);
  }),

  // v1: DELETE /api/v1/categories/:id
  http.delete('/api/v1/categories/:id', async ({ params }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const { id } = params;
    const index = mockCategories.findIndex(c => c.id === id);
    
    if (index === -1) {
      return HttpResponse.json(
        { message: `Category with id ${id} not found`, timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }
    
    // Check if category has products
    const hasProducts = mockProductsV3.some(p => p.category.id === id);
    if (hasProducts) {
      return HttpResponse.json(
        { message: 'Cannot delete category that has products', timestamp: new Date().toISOString() },
        { status: 409 }
      );
    }
    
    mockCategories.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${BASE_URL}/api/v1/categories/:id`, async ({ params }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const { id } = params;
    const index = mockCategories.findIndex(c => c.id === id);
    
    if (index === -1) {
      return HttpResponse.json(
        { message: `Category with id ${id} not found`, timestamp: new Date().toISOString() },
        { status: 404 }
      );
    }
    
    // Check if category has products
    const hasProducts = mockProductsV3.some(p => p.category.id === id);
    if (hasProducts) {
      return HttpResponse.json(
        { message: 'Cannot delete category that has products', timestamp: new Date().toISOString() },
        { status: 409 }
      );
    }
    
    mockCategories.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // v3: GET /api/v3/products (with category filter)
  http.get('/api/v3/products', async ({ request }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    const categoryId = url.searchParams.get('categoryId');
    
    let filteredProducts = mockProductsV3;
    if (categoryId) {
      filteredProducts = mockProductsV3.filter(p => p.category.id === categoryId);
    }
    
    return HttpResponse.json(buildPaginatedResponse(filteredProducts, page, size));
  }),

  http.get(`${BASE_URL}/api/v3/products`, async ({ request }) => {
    if (ENABLE_DELAY) await delay(DELAY_MS);
    
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    const categoryId = url.searchParams.get('categoryId');
    
    let filteredProducts = mockProductsV3;
    if (categoryId) {
      filteredProducts = mockProductsV3.filter(p => p.category.id === categoryId);
    }
    
    return HttpResponse.json(buildPaginatedResponse(filteredProducts, page, size));
  }),
];
