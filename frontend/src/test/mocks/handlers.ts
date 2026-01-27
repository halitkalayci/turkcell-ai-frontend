import { http, HttpResponse } from 'msw';

// Base URL from env (fallback to development default)
const BASE_URL = (process.env.VITE_API_BASE_URL as string) || 'http://localhost:8080';

// Shared sample products for v1
const sampleProductsV1 = [
  {
    id: 'prd_001',
    sku: 'SKU-IPH15-BLK',
    name: 'iPhone 15',
    description: 'Latest Apple iPhone',
    price: 999.99,
    currency: 'USD',
    inStock: true,
    createdAt: '2026-01-26T10:00:00Z',
    updatedAt: '2026-01-26T10:30:00Z',
  },
  {
    id: 'prd_002',
    sku: null,
    name: 'Pixel 9',
    description: 'Newest Google Pixel',
    price: 799.0,
    currency: 'USD',
    inStock: true,
    createdAt: '2026-01-26T11:00:00Z',
    updatedAt: '2026-01-26T11:30:00Z',
  },
];

// Shared sample products for v2
const sampleProductsV2 = [
  {
    id: 'prd_101',
    sku: 'SKU-IPH15-BLK',
    name: 'iPhone 15',
    description: 'Latest Apple iPhone',
    price: 999.99,
    currency: 'USD',
    inStock: true,
    imageUrl: 'https://cdn.example.com/products/prd_101.jpg',
    discountPercent: 10.0,
    rating: 4.5,
    createdAt: '2026-01-26T10:00:00Z',
    updatedAt: '2026-01-26T10:30:00Z',
  },
  {
    id: 'prd_102',
    sku: null,
    name: 'Pixel 9',
    description: 'Newest Google Pixel',
    price: 799.0,
    currency: 'USD',
    inStock: true,
    imageUrl: 'https://cdn.example.com/products/prd_102.jpg',
    discountPercent: null,
    rating: 4.2,
    createdAt: '2026-01-26T11:00:00Z',
    updatedAt: '2026-01-26T11:30:00Z',
  },
];

// Helper to build paginated responses
const buildPage = <T,>(items: T[], page = 0, size = 10) => ({
  items,
  page,
  size,
  totalElements: items.length,
  totalPages: 1,
});

export const handlers = [
  // v1: relative path to match any origin
  http.get('/api/v1/products', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    return HttpResponse.json(buildPage(sampleProductsV1, page, size));
  }),
  // v1: absolute path using BASE_URL for completeness
  http.get(`${BASE_URL}/api/v1/products`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    return HttpResponse.json(buildPage(sampleProductsV1, page, size));
  }),

  // v2: relative path
  http.get('/api/v2/products', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    return HttpResponse.json(buildPage(sampleProductsV2, page, size));
  }),
  // v2: absolute path using BASE_URL
  http.get(`${BASE_URL}/api/v2/products`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    return HttpResponse.json(buildPage(sampleProductsV2, page, size));
  }),
];
