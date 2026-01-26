# Architecture Layers (Katman Mimarisi)

## Overview

Frontend uygulaması **4 katmanlı** strict mimari ile yapılandırılmıştır. Her katman **sadece bir alt katmanı** çağırabilir.

## Layer Hierarchy (Katman Hiyerarşisi)

```
┌─────────────────────────────────────────────────┐
│  UI Layer (Sunum Katmanı)                       │
│  • Components, Pages                            │
│  • JSX/TSX render                               │
│  • User event handling                          │
│  • ❌ İş mantığı yok                            │
│  • ❌ API çağrısı yok                           │
└──────────────────┬──────────────────────────────┘
                   │ useProducts(), useAuth()
                   ↓
┌─────────────────────────────────────────────────┐
│  State Layer (Durum Yönetimi)                   │
│  • Hooks, Context, Store                        │
│  • React state management                       │
│  • Service çağrıları                            │
│  • ❌ HTTP çağrısı yok                          │
└──────────────────┬──────────────────────────────┘
                   │ ProductService.getAll()
                   ↓
┌─────────────────────────────────────────────────┐
│  Business Layer (İş Mantığı)                    │
│  • Services                                     │
│  • Validation, transformation                   │
│  • Domain logic                                 │
│  • ❌ React hooks yok                           │
│  • ❌ Component import yok                      │
└──────────────────┬──────────────────────────────┘
                   │ ProductsAPI.listProducts()
                   ↓
┌─────────────────────────────────────────────────┐
│  API Layer (Network Katmanı)                    │
│  • HTTP client                                  │
│  • OpenAPI contract compliance                  │
│  • Raw API responses                            │
│  • ❌ İş mantığı yok                            │
└─────────────────────────────────────────────────┘
```

---

## 1. UI Layer (Sunum Katmanı)

### Dizinler
- `src/components/`
- `src/pages/`

### Sorumluluklar

✅ **İzin Verilenler:**
- JSX/TSX render etmek
- User event'leri yakalamak (onClick, onChange, onSubmit)
- State Layer hooks çağırmak
- UI state yönetimi (form inputs, modal visibility)
- Props geçmek

❌ **Yasak:**
- Service fonksiyonları çağırmak
- API endpoint'leri çağırmak
- İş mantığı yazmak (validation, calculation, transformation)
- Direkt `fetch()` veya `axios()` kullanmak

### Örnek: ProductList.tsx ✅

```tsx
// ✅ DOĞRU: Sadece hook çağırıyor
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';

export function ProductList() {
  const { products, loading, error, refetch } = useProducts();

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      <button onClick={refetch}>Yenile</button>
    </div>
  );
}
```

### Anti-Pattern: ❌ Yanlış Kullanım

```tsx
// ❌ YANLIŞ: Component içinde API çağrısı
import { useEffect, useState } from 'react';

export function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // ❌ UI Layer'da HTTP çağrısı yapılmamalı
    fetch('/api/v1/products')
      .then(res => res.json())
      .then(data => setProducts(data.items));
  }, []);

  return <div>{/* ... */}</div>;
}
```

---

## 2. State Layer (Durum Yönetimi)

### Dizinler
- `src/hooks/`
- `src/store/` (Zustand/Redux kullanılıyorsa)
- `src/context/` (Context API kullanılıyorsa)

### Sorumluluklar

✅ **İzin Verilenler:**
- React state yönetmek (`useState`, `useReducer`)
- Service fonksiyonları çağırmak
- API response'larını UI state'ine transform etmek
- Loading/error state'lerini yönetmek
- Custom hooks tanımlamak

❌ **Yasak:**
- Direkt HTTP çağrıları yapmak
- İş mantığı yazmak (services'e ait)
- Component render etmek

### Örnek: useProducts.ts ✅

```tsx
// ✅ DOĞRU: Service çağırıyor, API'yi değil
import { useState, useEffect } from 'react';
import { ProductService } from '@/services/products.service';
import type { Product } from '@/types/api/products.types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    
    try {
      // ✅ Service çağırıyoruz
      const result = await ProductService.getAll();
      setProducts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return { products, loading, error, refetch: loadProducts };
}
```

### Anti-Pattern: ❌ Yanlış Kullanım

```tsx
// ❌ YANLIŞ: Hook içinde direkt API çağrısı
import { useState, useEffect } from 'react';
import { ProductsAPI } from '@/api/products.api';

export function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // ❌ State Layer API'yi direkt çağırmamalı
    ProductsAPI.listProducts({ page: 0, size: 10 })
      .then(setProducts);
  }, []);

  return { products };
}
```

---

## 3. Business Layer (İş Mantığı)

### Dizinler
- `src/services/`

### Sorumluluklar

✅ **İzin Verilenler:**
- İş mantığı uygulamak
- Validation yapmak
- API response'larını domain model'e transform etmek
- API Layer çağırmak
- Error handling
- Retry logic

❌ **Yasak:**
- React hooks import etmek (`useState`, `useEffect`)
- Component import etmek
- JSX yazmak
- Direkt HTTP client konfigürasyonu

### Örnek: products.service.ts ✅

```typescript
// ✅ DOĞRU: İş mantığı + API çağrısı
import { ProductsAPI } from '@/api/products.api';
import type { Product, CreateProductRequest } from '@/types/api/products.types';

export class ProductService {
  /**
   * Tüm ürünleri getirir (varsayılan sayfalama ile)
   */
  static async getAll(): Promise<Product[]> {
    // ✅ API çağrısı yapıyor
    const response = await ProductsAPI.listProducts({ page: 0, size: 50 });
    return response.items;
  }

  /**
   * Yeni ürün oluşturur (validation ile)
   */
  static async create(data: CreateProductRequest): Promise<Product> {
    // ✅ İş mantığı: validation
    if (data.price < 0) {
      throw new Error('Fiyat negatif olamaz');
    }

    if (data.name.trim().length < 3) {
      throw new Error('Ürün adı en az 3 karakter olmalı');
    }

    // ✅ API çağrısı
    const response = await ProductsAPI.createProduct(data);
    return response.product;
  }

  /**
   * Stokta olan ürünleri filtreler
   */
  static async getInStockProducts(): Promise<Product[]> {
    const allProducts = await this.getAll();
    // ✅ İş mantığı: filtreleme
    return allProducts.filter(p => p.inStock);
  }
}
```

### Anti-Pattern: ❌ Yanlış Kullanım

```typescript
// ❌ YANLIŞ: Service içinde React hook kullanımı
import { useState } from 'react'; // ❌ React import yasak
import { ProductsAPI } from '@/api/products.api';

export class ProductService {
  // ❌ Service'de hook kullanılamaz
  static useProducts() {
    const [products, setProducts] = useState([]);
    // ...
  }
}
```

---

## 4. API Layer (Network Katmanı)

### Dizinler
- `src/api/`

### Sorumluluklar

✅ **İzin Verilenler:**
- HTTP çağrıları yapmak
- OpenAPI contract'a uygun request/response tipleri kullanmak
- Base URL, headers, interceptors konfigürasyonu
- Network error handling
- Raw API response döndürmek

❌ **Yasak:**
- İş mantığı yazmak
- Validation yapmak (business layer'a ait)
- React hooks kullanmak
- UI state yönetmek

### Örnek: products.api.ts ✅

```typescript
// ✅ DOĞRU: Sadece HTTP çağrıları
import { apiClient } from './client';
import type {
  ProductPageResponse,
  ProductResponse,
  CreateProductRequest,
} from '@/types/api/products.types';

/**
 * Products API endpoints (OpenAPI operationId'ler ile eşleşir)
 */
export class ProductsAPI {
  /**
   * GET /api/v1/products
   * operationId: listProducts
   */
  static async listProducts(params: {
    page?: number;
    size?: number;
    sort?: string;
    q?: string;
  }): Promise<ProductPageResponse> {
    const response = await apiClient.get('/api/v1/products', { params });
    return response.data;
  }

  /**
   * POST /api/v1/products
   * operationId: createProduct
   */
  static async createProduct(
    data: CreateProductRequest
  ): Promise<ProductResponse> {
    const response = await apiClient.post('/api/v1/products', data);
    return response.data;
  }

  /**
   * GET /api/v1/products/{id}
   * operationId: getProductById
   */
  static async getProductById(id: string): Promise<ProductResponse> {
    const response = await apiClient.get(`/api/v1/products/${id}`);
    return response.data;
  }
}
```

### Örnek: client.ts ✅

```typescript
// ✅ DOĞRU: HTTP client konfigürasyonu
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = {
  async get(url: string, config?: RequestInit) {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...config,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return { data: await response.json() };
  },

  async post(url: string, body: unknown, config?: RequestInit) {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...config,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return { data: await response.json() };
  },
};
```

---

## Layer Validation Rules

### ✅ İzin Verilen Import Zincirleri

```typescript
// UI → State
import { useProducts } from '@/hooks/useProducts';

// State → Business
import { ProductService } from '@/services/products.service';

// Business → API
import { ProductsAPI } from '@/api/products.api';

// API → Types
import type { Product } from '@/types/api/products.types';
```

### ❌ Yasak Import Zincirleri

```typescript
// ❌ UI → Business (State layer atlandı)
import { ProductService } from '@/services/products.service';

// ❌ UI → API (State + Business atlandı)
import { ProductsAPI } from '@/api/products.api';

// ❌ State → API (Business atlandı)
import { ProductsAPI } from '@/api/products.api';

// ❌ Business → State (React hooks yasak)
import { useState } from 'react';

// ❌ API → Business (ters yön)
import { ProductService } from '@/services/products.service';
```

---

## ESLint Rules (Önerilen)

```javascript
// eslint.config.js
export default [
  {
    files: ['src/components/**', 'src/pages/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['**/services/**'], message: 'UI Layer cannot import Services directly. Use hooks instead.' },
          { group: ['**/api/**'], message: 'UI Layer cannot import API directly. Use hooks instead.' }
        ]
      }]
    }
  },
  {
    files: ['src/hooks/**', 'src/store/**', 'src/context/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['**/api/**'], message: 'State Layer cannot import API directly. Use services instead.' }
        ]
      }]
    }
  },
  {
    files: ['src/services/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['react'], message: 'Business Layer cannot import React hooks.' },
          { group: ['**/components/**'], message: 'Business Layer cannot import Components.' },
          { group: ['**/hooks/**'], message: 'Business Layer cannot import Hooks.' }
        ]
      }]
    }
  }
];
```

---

## FAQ

### Q: State layer'ı atlayıp service'i direkt component'te çağırabilir miyim?
**A:** ❌ **Hayır.** Her zaman hook kullanın. Hooks state yönetimi ve side effect'leri izole eder.

### Q: Service'de `useState` kullanabilir miyim?
**A:** ❌ **Hayır.** Services React'tan bağımsız olmalı. State yönetimi hooks'ta yapılır.

### Q: API Layer'da validation yapabilir miyim?
**A:** ❌ **Hayır.** Validation business layer'a aittir. API sadece HTTP iletişimi yapar.

### Q: Bir component'ten başka component'e servis geçebilir miyim?
**A:** ❌ **Hayır.** Service'leri props olarak geçmeyin. Her component kendi hook'unu çağırmalı.

### Q: Utility fonksiyonları nereye koymalıyım?
**A:** ✅ `src/utils/` dizinine. Utility'ler katman atlamaz, herkes import edebilir.

---

## Summary

| Layer    | Import Edebilir        | Import Edemez                  |
|----------|------------------------|--------------------------------|
| UI       | Hooks, Types           | Services, API                  |
| State    | Services, Types        | API, Components                |
| Business | API, Types             | Hooks, Components              |
| API      | Types                  | Services, Hooks, Components    |

**Golden Rule:** Bir katman sadece bir alt katmanı çağırabilir. Katman atlama yasaktır.
