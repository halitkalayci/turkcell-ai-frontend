# Type System & SSOT (Single Source of Truth)

## Core Principle

**OpenAPI spec (`/docs/openapi/*.yaml`) tüm API type'larının tek kaynağıdır.**

Frontend'te API ile ilgili hiçbir type inline veya alternatif isimle tanımlanmamalıdır.

---

## Type Directory Structure

```
src/types/
├── api/                      # OpenAPI-derived types (SSOT)
│   ├── products.types.ts     # Product, CreateProductRequest, vb.
│   ├── common.types.ts       # ErrorResponse, ErrorDetail
│   └── index.ts              # Barrel export
├── domain/                   # Frontend-only domain models
│   ├── ui-state.types.ts     # Form state, modal state
│   └── view-models.types.ts  # UI-specific transformations
└── common/                   # Utility types
    ├── result.types.ts       # Result<T>, AsyncState<T>
    └── pagination.types.ts   # Generic pagination helpers
```

### Katman Sorumluluları

| Dizin           | Ne İçerir                          | Kim Kullanır           |
|-----------------|-------------------------------------|------------------------|
| `types/api/`    | OpenAPI schemas (1:1 mapping)      | API, Services, Hooks   |
| `types/domain/` | UI-specific models (non-API)       | Components, Hooks      |
| `types/common/` | Generic utilities (Result, Maybe)  | Tüm katmanlar          |

---

## OpenAPI → TypeScript Mapping Rules

### 1. Exact Name Matching

OpenAPI schema isimleri **aynen** TypeScript'e aktarılmalıdır.

| OpenAPI Schema          | TypeScript Interface         | ✅/❌ |
|-------------------------|------------------------------|-------|
| `Product`               | `Product`                    | ✅    |
| `Product`               | `ProductDTO`                 | ❌    |
| `Product`               | `IProduct`                   | ❌    |
| `CreateProductRequest`  | `CreateProductRequest`       | ✅    |
| `CreateProductRequest`  | `CreateProductDto`           | ❌    |
| `ErrorResponse`         | `ErrorResponse`              | ✅    |
| `ErrorResponse`         | `ApiError`                   | ❌    |

**Kural:** OpenAPI'deki isim ne ise, TypeScript interface'i de aynı olmalı.

---

### 2. Field Type Conversion

| OpenAPI Type       | TypeScript Type            | Notes                              |
|--------------------|----------------------------|------------------------------------|
| `string`           | `string`                   |                                    |
| `integer`          | `number`                   |                                    |
| `number` (double)  | `number`                   |                                    |
| `boolean`          | `boolean`                  |                                    |
| `string` (date-time) | `string`                 | ISO 8601 format                    |
| `array`            | `T[]`                      | Array of T                         |
| `object`           | `{ [key: string]: T }`     | Record type                        |
| `nullable: true`   | `T \| null`                | Union with null                    |
| `required: false`  | `T \| undefined` (`T?`)    | Optional property                  |

---

### 3. Example: products.types.ts ✅

```typescript
/**
 * API Type definitions derived from /docs/openapi/products-v1.yaml
 * 
 * ⚠️ DO NOT MODIFY MANUALLY
 * These types must match OpenAPI schema exactly.
 * Any changes should be made in the OpenAPI spec first.
 */

// ---------- Core Models ----------

/**
 * Product entity (matches OpenAPI Product schema)
 */
export interface Product {
  id: string;
  sku?: string | null;                // nullable in OpenAPI
  name: string;
  description?: string | null;        // nullable + optional
  price: number;
  currency: string;
  inStock: boolean;
  createdAt: string;                  // date-time → string (ISO 8601)
  updatedAt: string;
}

// ---------- Requests ----------

/**
 * Request body for creating a product
 * POST /api/v1/products
 */
export interface CreateProductRequest {
  sku?: string | null;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  inStock: boolean;
}

/**
 * Request body for full product update
 * PUT /api/v1/products/{id}
 */
export interface UpdateProductRequest {
  sku?: string | null;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  inStock: boolean;
}

/**
 * Request body for partial product update
 * PATCH /api/v1/products/{id}
 */
export interface PatchProductRequest {
  sku?: string | null;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
  inStock?: boolean | null;
}

// ---------- Responses ----------

/**
 * Single product response wrapper
 * Returned by: createProduct, getProductById, replaceProduct, patchProduct
 */
export interface ProductResponse {
  product: Product;
}

/**
 * Paginated product list response
 * Returned by: listProducts
 */
export interface ProductPageResponse {
  items: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// ---------- Query Parameters ----------

/**
 * Query parameters for listProducts endpoint
 * GET /api/v1/products?page=0&size=10&sort=createdAt,desc&q=iphone
 */
export interface ListProductsParams {
  page?: number;          // default: 0
  size?: number;          // default: 10, max: 100
  sort?: string;          // format: "field,asc|desc"
  q?: string;             // search query
}
```

---

### 4. Example: common.types.ts ✅

```typescript
/**
 * Common API types from OpenAPI spec
 */

/**
 * Standard error response structure
 * Returned by all endpoints on error (4xx, 5xx)
 */
export interface ErrorResponse {
  message: string;
  details?: ErrorDetail[] | null;
  traceId?: string | null;
}

/**
 * Field-level validation error detail
 */
export interface ErrorDetail {
  field: string;
  message: string;
}
```

---

## Frontend-Only Domain Types

**Kural:** Backend'den gelmeyen, sadece UI'da kullanılan tipler `types/domain/` altında tanımlanır.

### Example: domain/ui-state.types.ts

```typescript
/**
 * Frontend-only UI state types
 * These types are NOT derived from OpenAPI
 */

/**
 * Generic async operation state
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Product form state (UI-specific)
 */
export interface ProductFormState {
  name: string;
  description: string;
  price: string;          // string for input field
  currency: string;
  inStock: boolean;
  isDirty: boolean;       // form modified?
  isSubmitting: boolean;
}

/**
 * Product list filter state (UI-specific)
 */
export interface ProductFilters {
  search: string;
  inStockOnly: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: 'name' | 'price' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}
```

---

## Common Utility Types

**Kural:** Generic, reusable type'lar `types/common/` altında tanımlanır.

### Example: common/result.types.ts

```typescript
/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Maybe type (like Option in Rust)
 */
export type Maybe<T> = T | null | undefined;

/**
 * Generic pagination metadata
 */
export interface PaginationMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

---

## Type Import Guidelines

### ✅ Correct Imports

```typescript
// API Layer
import type { Product, CreateProductRequest } from '@/types/api/products.types';

// Business Layer
import type { Product } from '@/types/api/products.types';
import type { Result } from '@/types/common/result.types';

// State Layer
import type { Product } from '@/types/api/products.types';
import type { AsyncState } from '@/types/domain/ui-state.types';

// UI Layer
import type { Product } from '@/types/api/products.types';
import type { ProductFormState } from '@/types/domain/ui-state.types';
```

### ❌ Anti-Patterns

```typescript
// ❌ YANLIŞ: Inline type tanımı (API type'ı component'te)
export function ProductCard({ product }: { product: { id: string; name: string } }) {
  // ...
}

// ❌ YANLIŞ: Alternative isim kullanma
export interface ProductDTO {  // OpenAPI'de "Product" var
  id: string;
  // ...
}

// ❌ YANLIŞ: API type'ını modifiye etme
import type { Product as ApiProduct } from '@/types/api';
export interface Product extends ApiProduct {
  isSelected: boolean;  // UI state'i API type'ına karıştırma
}

// ✅ DOĞRU: Ayrı UI type oluştur
import type { Product } from '@/types/api/products.types';
export interface ProductViewModel {
  product: Product;
  isSelected: boolean;
}
```

---

## Type Generation Workflow

### Option 1: Manual Mirroring (Current)

1. OpenAPI spec'i aç: `/docs/openapi/products-v1.yaml`
2. Schema'ları bul: `components/schemas`
3. TypeScript interface'lerine dönüştür
4. `src/types/api/` altına kaydet

**장點:**
- Dependency yok
- Tam kontrol

**단점:**
- Manuel senkronizasyon gerekli
- Hata riski

### Option 2: Code Generation (Future - Approval Required)

```bash
# Örnek: openapi-typescript kullanımı (henüz eklenmedi)
npx openapi-typescript docs/openapi/products-v1.yaml -o src/types/api/products.types.ts
```

**Approval gerekir çünkü:**
- Yeni dependency ekler
- Build sürecini değiştirir
- AGENTS.md Section 2.2'ye göre yasak (izinsiz)

---

## SSOT Validation Checklist

PR öncesi kontrol edin:

- [ ] Tüm API type'ları `src/types/api/` altında
- [ ] OpenAPI schema isimleri **aynen** kullanılmış
- [ ] Hiçbir component/hook/service'de inline API type yok
- [ ] `ProductDTO`, `IProduct` gibi alternatif isimler kullanılmamış
- [ ] Nullable field'lar `T | null` ile işaretlenmiş
- [ ] Optional field'lar `T?` ile işaretlenmiş
- [ ] date-time field'lar `string` olarak tanımlanmış
- [ ] Frontend-only type'lar `types/domain/` altında
- [ ] Generic utility type'lar `types/common/` altında

---

## ESLint Rules (Önerilen)

```javascript
// eslint.config.js
export default [
  {
    files: ['src/types/api/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSInterfaceDeclaration[id.name=/DTO$/]',
          message: 'API types should not use "DTO" suffix. Use exact OpenAPI schema names.'
        },
        {
          selector: 'TSInterfaceDeclaration[id.name=/^I[A-Z]/]',
          message: 'API types should not use "I" prefix. Use exact OpenAPI schema names.'
        }
      ]
    }
  },
  {
    files: ['src/components/**', 'src/pages/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-inline-type-declarations': 'warn'  // Custom rule (plugin gerekir)
    }
  }
];
```

---

## FAQ

### Q: OpenAPI'de olmayan bir field'ı type'a ekleyebilir miyim?
**A:** ❌ **Hayır.** API type'ları OpenAPI ile 1:1 eşleşmeli. Ekstra field gerekiyorsa `types/domain/` altında yeni tip oluştur:

```typescript
// ✅ DOĞRU
import type { Product } from '@/types/api/products.types';

export interface ProductViewModel {
  product: Product;
  isSelected: boolean;  // UI-specific field
}
```

### Q: Backend date field'ı `Date` objesine çevirebilir miyim?
**A:** ❌ **API type'ında hayır.** API type'ı `string` olmalı. Transformation business layer'da yapılır:

```typescript
// types/api/products.types.ts
export interface Product {
  createdAt: string;  // ✅ ISO 8601 string
}

// services/products.service.ts
export class ProductService {
  static async getAll(): Promise<Product[]> {
    const response = await ProductsAPI.listProducts();
    // ✅ İsterseniz burada Date'e çevirebilirsiniz
    return response.items.map(p => ({
      ...p,
      createdAt: new Date(p.createdAt).toISOString()  // Ya da Date objesi döndürün
    }));
  }
}
```

### Q: `Product` ismini `ProductModel` olarak değiştirebilir miyim?
**A:** ❌ **Hayır.** OpenAPI'de `Product` ise TypeScript'te de `Product` olmalı. İsim değişikliği SSOT'u bozar.

### Q: Type generation tool ekleyebilir miyim?
**A:** ⚠️ **Sadece onay ile.** AGENTS.md Section 2.2'ye göre yeni OpenAPI tooling eklemek yasaklıdır. Proje lead'ine danışın.

### Q: `types/api/` ve `types/domain/` arasındaki fark nedir?
**A:**
- **`types/api/`**: Backend API'den gelen, OpenAPI'de tanımlı tipler
- **`types/domain/`**: Sadece frontend'de kullanılan, API'den gelmeyen tipler (form state, filter state, vb.)

---

## Summary

| Özellik              | API Types               | Domain Types            |
|----------------------|-------------------------|-------------------------|
| **Konum**            | `src/types/api/`        | `src/types/domain/`     |
| **Kaynak**           | OpenAPI spec (SSOT)     | Frontend requirements   |
| **İsim Kuralı**      | Exact match with OpenAPI | Freely named           |
| **Değiştirilebilir** | ❌ Hayır (sync gerekir) | ✅ Evet                 |
| **Kullanıcılar**     | API, Services, Hooks    | Components, Hooks       |

**Golden Rule:** API ile ilgili her type OpenAPI'den gelmelidir. Hiçbir API type inline tanımlanamaz.
