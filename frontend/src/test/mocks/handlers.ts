import { http, HttpResponse, delay } from 'msw';
import { mockProductsV1, mockProductsV2 } from '@/__tests__/setup/mocks/products.mock';

// Base URL from env (fallback to development default)
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
];
