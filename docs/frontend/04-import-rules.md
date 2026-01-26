# Import Rules & Dependency Management

## Overview

Bu doküman, katmanlar arası import kurallarını ve bağımlılık yönetimini tanımlar.

---

## Layer Import Hierarchy

```
UI Layer
  ↓ can import
State Layer
  ↓ can import
Business Layer
  ↓ can import
API Layer
  ↓ can import
Types (api/)
```

**Kural:** Bir katman sadece **bir alt katmanı** import edebilir. Katman atlamak yasaktır.

---

## Allowed Imports (İzin Verilen)

### ✅ UI Layer (Components, Pages)

```typescript
// ✅ Hooks (State Layer)
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';

// ✅ Types (Domain & Common)
import type { Product } from '@/types/api/products.types';
import type { AsyncState } from '@/types/domain/ui-state.types';

// ✅ Utils
import { formatCurrency } from '@/utils/formatters';
import { validateEmail } from '@/utils/validators';

// ✅ Other components (same layer)
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
```

### ✅ State Layer (Hooks, Store, Context)

```typescript
// ✅ Services (Business Layer)
import { ProductService } from '@/services/products.service';
import { AuthService } from '@/services/auth.service';

// ✅ Types (API, Domain, Common)
import type { Product } from '@/types/api/products.types';
import type { AsyncState } from '@/types/domain/ui-state.types';
import type { Result } from '@/types/common/result.types';

// ✅ Utils
import { debounce } from '@/utils/debounce';

// ✅ React hooks
import { useState, useEffect, useCallback } from 'react';
```

### ✅ Business Layer (Services)

```typescript
// ✅ API Layer
import { ProductsAPI } from '@/api/products.api';
import { AuthAPI } from '@/api/auth.api';

// ✅ Types (API, Common only - not domain!)
import type { Product, CreateProductRequest } from '@/types/api/products.types';
import type { Result } from '@/types/common/result.types';

// ✅ Utils
import { validatePrice } from '@/utils/validators';
import { API_CONFIG } from '@/utils/constants';

// ❌ REACT YASAK
// import { useState } from 'react';  // ❌ NO!
```

### ✅ API Layer

```typescript
// ✅ Types (API only)
import type { Product, ProductResponse } from '@/types/api/products.types';
import type { ErrorResponse } from '@/types/api/common.types';

// ✅ HTTP client config
import { apiClient } from './client';

// ✅ Constants
import { API_BASE_URL } from '@/utils/constants';

// ❌ NO BUSINESS LOGIC
// import { ProductService } from '@/services/products.service';  // ❌ NO!
```

---

## Forbidden Imports (Yasak)

### ❌ UI Layer → Business Layer (State'i atla)

```typescript
// ❌ YANLIŞ: Component direkt service çağırıyor
import { ProductService } from '@/services/products.service';

export function ProductList() {
  useEffect(() => {
    ProductService.getAll();  // ❌ Hook kullanmalı
  }, []);
}

// ✅ DOĞRU: Hook kullan
import { useProducts } from '@/hooks/useProducts';

export function ProductList() {
  const { products } = useProducts();  // ✅
}
```

### ❌ UI Layer → API Layer (State + Business'ı atla)

```typescript
// ❌ YANLIŞ: Component direkt API çağırıyor
import { ProductsAPI } from '@/api/products.api';

export function ProductList() {
  useEffect(() => {
    ProductsAPI.listProducts({ page: 0, size: 10 });  // ❌
  }, []);
}

// ✅ DOĞRU: Hook kullan
import { useProducts } from '@/hooks/useProducts';

export function ProductList() {
  const { products } = useProducts();  // ✅
}
```

### ❌ State Layer → API Layer (Business'ı atla)

```typescript
// ❌ YANLIŞ: Hook direkt API çağırıyor
import { ProductsAPI } from '@/api/products.api';

export function useProducts() {
  useEffect(() => {
    ProductsAPI.listProducts({ page: 0, size: 10 });  // ❌
  }, []);
}

// ✅ DOĞRU: Service kullan
import { ProductService } from '@/services/products.service';

export function useProducts() {
  useEffect(() => {
    ProductService.getAll();  // ✅
  }, []);
}
```

### ❌ Business Layer → State Layer (Ters yön)

```typescript
// ❌ YANLIŞ: Service içinde React hook
import { useState } from 'react';

export class ProductService {
  static useProducts() {  // ❌ Services'te hook olamaz
    const [products, setProducts] = useState([]);
    // ...
  }
}
```

### ❌ Business Layer → UI Layer (Ters yön)

```typescript
// ❌ YANLIŞ: Service içinde component import
import { Toast } from '@/components/common/Toast';

export class ProductService {
  static async create(data: CreateProductRequest) {
    try {
      const result = await ProductsAPI.createProduct(data);
      Toast.show('Success!');  // ❌ UI logic in service
      return result;
    } catch (error) {
      Toast.show('Error!');    // ❌ UI logic in service
    }
  }
}

// ✅ DOĞRU: UI logic hook'ta olmalı
export function useProducts() {
  const [toast, setToast] = useState<string | null>(null);

  async function createProduct(data: CreateProductRequest) {
    try {
      await ProductService.create(data);
      setToast('Success!');  // ✅ UI logic in hook
    } catch {
      setToast('Error!');    // ✅ UI logic in hook
    }
  }

  return { createProduct, toast };
}
```

### ❌ API Layer → Business/State/UI (Ters yön)

```typescript
// ❌ YANLIŞ: API içinde service import
import { ProductService } from '@/services/products.service';

export class ProductsAPI {
  static async listProducts() {
    const result = await fetch('/api/v1/products');
    return ProductService.transform(result);  // ❌ API shouldn't call Service
  }
}
```

---

## Import Order Convention

Her dosyada import'lar şu sırayla organize edilmeli:

```typescript
// 1. External dependencies (React, third-party libs)
import { useState, useEffect } from 'react';
import { z } from 'zod';

// 2. Internal layers (respecting hierarchy)
import { useProducts } from '@/hooks/useProducts';
import { ProductService } from '@/services/products.service';

// 3. Types
import type { Product } from '@/types/api/products.types';
import type { AsyncState } from '@/types/domain/ui-state.types';

// 4. Utils & Constants
import { formatCurrency } from '@/utils/formatters';
import { API_BASE_URL } from '@/utils/constants';

// 5. Styles
import './ProductCard.css';
```

**ESLint Plugin:** `eslint-plugin-import` ile bu sıra zorlanabilir.

---

## Circular Dependency Prevention

### Yasaklı Pattern: Circular Import

```typescript
// ❌ YANLIŞ: Circular dependency
// services/products.service.ts
import { AuthService } from './auth.service';

export class ProductService {
  static async getAll() {
    if (!AuthService.isAuthenticated()) return [];
    // ...
  }
}

// services/auth.service.ts
import { ProductService } from './products.service';  // ❌ Circular!

export class AuthService {
  static async logout() {
    await ProductService.clearCache();  // ❌ Circular!
  }
}
```

### ✅ Çözüm 1: Shared Utility

```typescript
// utils/auth-checker.ts
export function isAuthenticated(): boolean {
  return localStorage.getItem('token') !== null;
}

// services/products.service.ts
import { isAuthenticated } from '@/utils/auth-checker';

export class ProductService {
  static async getAll() {
    if (!isAuthenticated()) return [];
    // ...
  }
}

// services/auth.service.ts
export class AuthService {
  static async logout() {
    localStorage.removeItem('token');
  }
}
```

### ✅ Çözüm 2: Event-Based Communication

```typescript
// utils/events.ts
export const authEvents = {
  emit(event: 'logout') {
    window.dispatchEvent(new CustomEvent('auth:logout'));
  },
  on(event: 'logout', handler: () => void) {
    window.addEventListener('auth:logout', handler);
  },
};

// services/auth.service.ts
import { authEvents } from '@/utils/events';

export class AuthService {
  static async logout() {
    localStorage.removeItem('token');
    authEvents.emit('logout');  // ✅ No direct dependency
  }
}

// services/products.service.ts
import { authEvents } from '@/utils/events';

export class ProductService {
  static init() {
    authEvents.on('logout', () => {
      this.clearCache();  // ✅ No circular dependency
    });
  }
}
```

---

## Type-Only Imports

Type import'larını `type` keyword ile işaretle:

```typescript
// ✅ DOĞRU: type keyword kullan
import type { Product } from '@/types/api/products.types';
import type { AsyncState } from '@/types/domain/ui-state.types';

// ❌ YANLIŞ: type keyword yok
import { Product } from '@/types/api/products.types';  // Runtime import olabilir
```

**Fayda:**
- TypeScript bundle'dan type'ları çıkarır (tree-shaking)
- Circular dependency riskini azaltır
- Derleme hızını artırır

---

## Dynamic Imports (Code Splitting)

Page component'leri lazy load edilmeli:

```typescript
// ✅ DOĞRU: Lazy load pages
import { lazy, Suspense } from 'react';

const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </Suspense>
  );
}
```

**Lazy load edilmeli:**
- Page components
- Heavy components (charts, editors)
- Modals (only when opened)

**Lazy load edilmemeli:**
- Hooks
- Services
- API modules
- Types

---

## Barrel Exports vs Direct Imports

### Barrel Export (index.ts)

```typescript
// components/products/index.ts
export { ProductList } from './ProductList';
export { ProductCard } from './ProductCard';
export { ProductForm } from './ProductForm';

// Usage
import { ProductList, ProductCard } from '@/components/products';  // ✅
```

**장점:**
- Clean imports
- Encapsulation

**단점:**
- Tree-shaking zor olabilir (eğer barrel dosyası çok büyükse)

### Direct Import

```typescript
// Direct import
import { ProductList } from '@/components/products/ProductList';  // ✅
import { ProductCard } from '@/components/products/ProductCard';  // ✅
```

**장점:**
- Better tree-shaking
- Explicit dependencies

**Önerilen Strateji:**
- Feature level barrel exports kullan: ✅ `components/products/index.ts`
- Top-level barrel export yok: ❌ `components/index.ts` (çok büyük olur)

---

## Dependency Injection (Advanced)

Service'lere dependency inject etmek için:

```typescript
// ✅ DOĞRU: Dependency injection
export class ProductService {
  constructor(private api: typeof ProductsAPI) {}

  async getAll(): Promise<Product[]> {
    const response = await this.api.listProducts({ page: 0, size: 50 });
    return response.items;
  }
}

// Usage in hooks
const productService = new ProductService(ProductsAPI);
```

**장점:**
- Testing kolay (mock API inject edilebilir)
- Loose coupling

**단점:**
- Daha karmaşık setup

**Karar:** Şimdilik static methods kullan, test ihtiyacı olursa DI'a geç.

---

## ESLint Configuration

```javascript
// eslint.config.js
export default [
  {
    plugins: ['import'],
    rules: {
      // Import order enforcement
      'import/order': [
        'error',
        {
          groups: [
            'builtin',       // Node.js built-in
            'external',      // npm packages
            'internal',      // @/ alias
            ['parent', 'sibling', 'index'],
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],

      // No circular dependencies
      'import/no-cycle': ['error', { maxDepth: 5 }],

      // Prefer type-only imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
    },
  },

  // UI Layer restrictions
  {
    files: ['src/components/**', 'src/pages/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/services/**'],
              message: 'UI Layer cannot import Services. Use hooks instead.',
            },
            {
              group: ['**/api/**'],
              message: 'UI Layer cannot import API. Use hooks instead.',
            },
          ],
        },
      ],
    },
  },

  // State Layer restrictions
  {
    files: ['src/hooks/**', 'src/store/**', 'src/context/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/api/**'],
              message: 'State Layer cannot import API. Use services instead.',
            },
          ],
        },
      ],
    },
  },

  // Business Layer restrictions
  {
    files: ['src/services/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react'],
              message: 'Business Layer cannot import React.',
            },
            {
              group: ['**/components/**'],
              message: 'Business Layer cannot import Components.',
            },
            {
              group: ['**/hooks/**'],
              message: 'Business Layer cannot import Hooks.',
            },
          ],
        },
      ],
    },
  },

  // API Layer restrictions
  {
    files: ['src/api/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/services/**', '**/hooks/**', '**/components/**'],
              message: 'API Layer can only import types and client config.',
            },
          ],
        },
      ],
    },
  },
];
```

---

## FAQ

### Q: Component içinde service fonksiyonu çağırabilir miyim?
**A:** ❌ **Hayır.** Her zaman hook kullanmalısınız.

```typescript
// ❌ YANLIŞ
export function ProductList() {
  useEffect(() => {
    ProductService.getAll();  // ❌
  }, []);
}

// ✅ DOĞRU
export function ProductList() {
  const { products } = useProducts();  // ✅
}
```

### Q: Hook içinde API çağırabilir miyim?
**A:** ❌ **Hayır.** Service kullanmalısınız.

```typescript
// ❌ YANLIŞ
export function useProducts() {
  useEffect(() => {
    ProductsAPI.listProducts();  // ❌
  }, []);
}

// ✅ DOĞRU
export function useProducts() {
  useEffect(() => {
    ProductService.getAll();  // ✅
  }, []);
}
```

### Q: Service içinde `useState` kullanabilir miyim?
**A:** ❌ **Hayır.** Service'ler React'tan bağımsız olmalı.

### Q: Utils fonksiyonlarını her katman import edebilir mi?
**A:** ✅ **Evet.** Utils katman hiyerarşisinin dışındadır, herkes kullanabilir.

### Q: Types'ı nerede import edebilirim?
**A:** ✅ **Her yerde**, ancak:
- **API types** (`types/api/`): API, Services, Hooks
- **Domain types** (`types/domain/`): Components, Hooks
- **Common types** (`types/common/`): Her yerde

---

## Summary

| Import                  | UI | State | Business | API |
|-------------------------|----|----|----------|-----|
| Hooks (State)           | ✅ | ❌ | ❌       | ❌  |
| Services (Business)     | ❌ | ✅ | ❌       | ❌  |
| API                     | ❌ | ❌ | ✅       | ✅  |
| Types (api/)            | ✅ | ✅ | ✅       | ✅  |
| Types (domain/)         | ✅ | ✅ | ❌       | ❌  |
| Types (common/)         | ✅ | ✅ | ✅       | ✅  |
| Utils                   | ✅ | ✅ | ✅       | ✅  |
| React                   | ✅ | ✅ | ❌       | ❌  |

**Golden Rule:** Bir katman sadece bir alt katmanı import edebilir. Katman atlamak yasaktır.
