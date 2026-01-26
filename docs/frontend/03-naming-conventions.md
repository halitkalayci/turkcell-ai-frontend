# Naming Conventions (Adlandırma Standartları)

## Overview

Bu doküman, dosya isimleri, dizin yapısı, değişken/fonksiyon isimleri için zorunlu standartları tanımlar.

---

## Directory Structure (Dizin Yapısı)

```
frontend/src/
├── api/                      # API Layer (HTTP client)
│   ├── client.ts             # Base HTTP client config
│   ├── products.api.ts       # Products endpoints
│   └── auth.api.ts           # Auth endpoints (future)
│
├── services/                 # Business Layer
│   ├── products.service.ts   # Product business logic
│   └── auth.service.ts       # Auth business logic (future)
│
├── hooks/                    # State Layer (React hooks)
│   ├── useProducts.ts        # Product state management
│   ├── useAuth.ts            # Auth state management (future)
│   └── useDebounce.ts        # Generic utility hook
│
├── components/               # UI Layer
│   ├── products/             # Feature-specific components
│   │   ├── ProductList.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductForm.tsx
│   │   └── index.ts          # Barrel export
│   ├── common/               # Shared components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   └── layout/               # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
│
├── pages/                    # Page components (routes)
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── HomePage.tsx
│   └── NotFoundPage.tsx
│
├── types/                    # TypeScript types
│   ├── api/                  # OpenAPI-derived types (SSOT)
│   │   ├── products.types.ts
│   │   ├── common.types.ts
│   │   └── index.ts
│   ├── domain/               # Frontend-only types
│   │   ├── ui-state.types.ts
│   │   └── view-models.types.ts
│   └── common/               # Generic utility types
│       ├── result.types.ts
│       └── pagination.types.ts
│
├── utils/                    # Utility functions
│   ├── formatters.ts         # Date, currency formatters
│   ├── validators.ts         # Input validation helpers
│   └── constants.ts          # App-wide constants
│
├── styles/                   # Global styles (optional)
│   ├── globals.css
│   └── variables.css
│
├── assets/                   # Static assets
│   ├── images/
│   └── icons/
│
├── App.tsx                   # Root component
├── main.tsx                  # Entry point
└── vite-env.d.ts             # Vite type declarations
```

---

## File Naming Rules

### 1. TypeScript/TSX Files

| File Type          | Pattern                  | Examples                      |
|--------------------|--------------------------|-------------------------------|
| React Component    | `PascalCase.tsx`         | `ProductCard.tsx`             |
| Page Component     | `PascalCase + Page.tsx`  | `ProductsPage.tsx`            |
| Hook               | `camelCase.ts`           | `useProducts.ts`              |
| Service            | `camelCase.service.ts`   | `products.service.ts`         |
| API Module         | `camelCase.api.ts`       | `products.api.ts`             |
| Type Definition    | `camelCase.types.ts`     | `products.types.ts`           |
| Utility            | `camelCase.ts`           | `formatters.ts`               |
| Config             | `camelCase.config.ts`    | `vite.config.ts`              |

### 2. CSS/Style Files

| File Type          | Pattern                  | Examples                      |
|--------------------|--------------------------|-------------------------------|
| Component Style    | `PascalCase.module.css`  | `ProductCard.module.css`      |
| Global Style       | `lowercase.css`          | `globals.css`                 |

### 3. Directory Names

| Directory Type     | Pattern                  | Examples                      |
|--------------------|--------------------------|-------------------------------|
| Feature Module     | `lowercase`              | `products/`, `auth/`          |
| Layer Directory    | `lowercase`              | `api/`, `services/`, `hooks/` |

---

## Code Naming Conventions

### 1. Variables & Constants

```typescript
// ✅ DOĞRU: camelCase for variables
const userId = '123';
const isAuthenticated = true;
const productList = [];

// ✅ DOĞRU: UPPER_SNAKE_CASE for constants
const API_BASE_URL = 'http://localhost:8080';
const MAX_RETRY_COUNT = 3;
const DEFAULT_PAGE_SIZE = 10;

// ❌ YANLIŞ: Inconsistent casing
const UserID = '123';           // Should be userId
const is_authenticated = true;  // Should be isAuthenticated
const api_base_url = '...';     // Should be API_BASE_URL
```

### 2. Functions & Methods

```typescript
// ✅ DOĞRU: Verb-based, camelCase
function getUserById(id: string) { }
async function fetchProducts() { }
function validateEmail(email: string) { }

// ✅ DOĞRU: Boolean functions start with is/has/should
function isValidEmail(email: string): boolean { }
function hasPermission(user: User): boolean { }
function shouldShowModal(): boolean { }

// ❌ YANLIŞ: Noun-based or unclear
function user(id: string) { }      // Should be getUser or fetchUser
function products() { }            // Should be getProducts or fetchProducts
function email(value: string) { }  // Should be validateEmail
```

### 3. React Components

```tsx
// ✅ DOĞRU: PascalCase, noun-based
export function ProductCard() { }
export function UserProfile() { }
export function SearchBar() { }

// ✅ DOĞRU: Higher-Order Components (HOC) - with prefix
export function withAuth<P>(Component: React.ComponentType<P>) { }
export function withLoading(Component: React.ComponentType) { }

// ❌ YANLIŞ: camelCase or verb-based
export function productCard() { }  // Should be ProductCard
export function ShowProduct() { }  // Should be ProductDisplay or ProductView
```

### 4. Custom Hooks

```typescript
// ✅ DOĞRU: Prefix with 'use', camelCase
export function useProducts() { }
export function useAuth() { }
export function useDebounce(value: string, delay: number) { }
export function useLocalStorage(key: string) { }

// ❌ YANLIŞ: Missing 'use' prefix
export function products() { }     // Should be useProducts
export function getAuth() { }      // Should be useAuth
```

### 5. Types & Interfaces

```typescript
// ✅ DOĞRU: PascalCase, no prefix
export interface Product { }
export interface UserProfile { }
export type Result<T> = { };

// ✅ DOĞRU: Request/Response suffixes for API types
export interface CreateProductRequest { }
export interface ProductResponse { }
export interface ErrorResponse { }

// ❌ YANLIŞ: "I" prefix or "DTO" suffix (unless in OpenAPI)
export interface IProduct { }      // Should be Product
export interface ProductDTO { }    // Should be Product (unless OpenAPI says DTO)
```

### 6. Enums

```typescript
// ✅ DOĞRU: PascalCase for enum, UPPER_SNAKE_CASE for values
export enum ProductStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED',
}

// ✅ DOĞRU: Or use const object (preferred in TS)
export const ProductStatus = {
  IN_STOCK: 'IN_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  DISCONTINUED: 'DISCONTINUED',
} as const;

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];

// ❌ YANLIŞ: camelCase values
export enum ProductStatus {
  inStock = 'inStock',           // Should be IN_STOCK
  outOfStock = 'outOfStock',     // Should be OUT_OF_STOCK
}
```

---

## Layer-Specific Naming

### API Layer (`src/api/`)

```typescript
// ✅ File: products.api.ts
export class ProductsAPI {
  // Method names match OpenAPI operationId
  static async listProducts() { }      // operationId: listProducts
  static async createProduct() { }     // operationId: createProduct
  static async getProductById() { }    // operationId: getProductById
  static async replaceProduct() { }    // operationId: replaceProduct
  static async patchProduct() { }      // operationId: patchProduct
  static async deleteProduct() { }     // operationId: deleteProduct
}
```

**Kurallar:**
- Dosya: `<resource>.api.ts` (örn: `products.api.ts`)
- Class: `<Resource>API` (PascalCase + "API" suffix)
- Method: OpenAPI `operationId` ile 1:1 eşleşmeli

---

### Business Layer (`src/services/`)

```typescript
// ✅ File: products.service.ts
export class ProductService {
  // Business-oriented method names
  static async getAll() { }
  static async getById(id: string) { }
  static async create(data: CreateProductRequest) { }
  static async update(id: string, data: UpdateProductRequest) { }
  static async delete(id: string) { }
  
  // Business logic methods
  static async getInStockProducts() { }
  static async searchByName(query: string) { }
  static validatePrice(price: number): boolean { }
}
```

**Kurallar:**
- Dosya: `<resource>.service.ts`
- Class: `<Resource>Service` (PascalCase + "Service" suffix)
- Method: Business domain terminolojisi kullan

---

### State Layer (`src/hooks/`)

```typescript
// ✅ File: useProducts.ts
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verb-based action functions
  async function loadProducts() { }
  async function createProduct(data: CreateProductRequest) { }
  async function deleteProduct(id: string) { }

  return {
    products,
    loading,
    error,
    loadProducts,
    createProduct,
    deleteProduct,
  };
}
```

**Kurallar:**
- Dosya: `use<Resource>.ts`
- Function: `use<Resource>` (PascalCase with "use" prefix)
- Return object: Named properties (no positional arrays)

---

### UI Layer (`src/components/`)

```tsx
// ✅ File: ProductCard.tsx
export function ProductCard({ product }: { product: Product }) {
  // Event handler prefix: handle
  const handleClick = () => { };
  const handleDelete = () => { };
  const handleEdit = () => { };

  // Render helper functions: render
  const renderPrice = () => { };
  const renderStatus = () => { };

  return (
    <div onClick={handleClick}>
      <h3>{product.name}</h3>
      {renderPrice()}
      {renderStatus()}
    </div>
  );
}

// ✅ DOĞRU: Props interface naming
interface ProductCardProps {
  product: Product;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  // ...
}
```

**Kurallar:**
- Component dosyası: `<ComponentName>.tsx`
- Component function: `<ComponentName>` (PascalCase)
- Props interface: `<ComponentName>Props`
- Event handlers: `handle<Action>` (örn: `handleClick`)
- Render helpers: `render<Element>` (örn: `renderPrice`)
- Callback props: `on<Action>` (örn: `onClick`, `onDelete`)

---

## Barrel Exports (index.ts)

Her feature dizininde barrel export kullanılmalı:

```typescript
// ✅ components/products/index.ts
export { ProductList } from './ProductList';
export { ProductCard } from './ProductCard';
export { ProductForm } from './ProductForm';

// Usage
import { ProductList, ProductCard } from '@/components/products';
```

**Kurallar:**
- Her feature dizininde `index.ts` olmalı
- Named export kullan (default export değil)
- Re-export only (no logic in barrel files)

---

## Path Aliases

`tsconfig.json` ve `vite.config.ts` içinde path alias tanımlanmalı:

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/api/*": ["src/api/*"],
      "@/services/*": ["src/services/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/components/*": ["src/components/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Usage:**

```typescript
// ✅ DOĞRU: Use path alias
import { Product } from '@/types/api/products.types';
import { ProductService } from '@/services/products.service';
import { useProducts } from '@/hooks/useProducts';

// ❌ YANLIŞ: Relative paths for cross-layer imports
import { Product } from '../../../types/api/products.types';
import { ProductService } from '../../services/products.service';
```

---

## Git Branch Naming

```bash
# Feature branches
feature/add-product-list
feature/implement-auth

# Bug fixes
bugfix/fix-product-price-validation
bugfix/resolve-api-timeout

# Hotfixes
hotfix/critical-security-patch

# Refactoring
refactor/restructure-api-layer
refactor/extract-product-service
```

**Kural:** `<type>/<kebab-case-description>`

---

## Commit Message Format

```bash
# Format: <type>(<scope>): <subject>

feat(products): add product list component
fix(api): resolve timeout issue in ProductsAPI
refactor(hooks): extract useDebounce hook
docs(frontend): update architecture documentation
test(services): add unit tests for ProductService
chore(deps): update vite to 7.2.4
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`

---

## Summary Table

| Öğe                  | Pattern                    | Example                       |
|----------------------|----------------------------|-------------------------------|
| React Component      | `PascalCase.tsx`           | `ProductCard.tsx`             |
| Page                 | `PascalCase + Page.tsx`    | `ProductsPage.tsx`            |
| Hook                 | `use + PascalCase.ts`      | `useProducts.ts`              |
| Service              | `camelCase.service.ts`     | `products.service.ts`         |
| API                  | `camelCase.api.ts`         | `products.api.ts`             |
| Type File            | `camelCase.types.ts`       | `products.types.ts`           |
| Interface/Type       | `PascalCase`               | `Product`, `ProductResponse`  |
| Function             | `camelCase`                | `getUserById`, `validateEmail`|
| Constant             | `UPPER_SNAKE_CASE`         | `API_BASE_URL`, `MAX_RETRIES` |
| Variable             | `camelCase`                | `userId`, `isAuthenticated`   |
| Event Handler        | `handle + PascalCase`      | `handleClick`, `handleSubmit` |
| Callback Prop        | `on + PascalCase`          | `onClick`, `onDelete`         |
| Boolean Variable     | `is/has/should + Noun`     | `isLoading`, `hasError`       |

---

## ESLint Rules (Önerilen)

```javascript
// eslint.config.js
export default [
  {
    rules: {
      // Component isimleri PascalCase olmalı
      'react/jsx-pascal-case': ['error', { allowAllCaps: false }],
      
      // Hook isimleri 'use' ile başlamalı
      'react-hooks/rules-of-hooks': 'error',
      
      // Boolean değişkenler is/has/should ile başlamalı
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['camelCase'],
          prefix: ['is', 'has', 'should', 'can', 'did', 'will'],
        },
      ],
    },
  },
];
```

---

## FAQ

### Q: Component dosyası `ProductCard.tsx` mi yoksa `product-card.tsx` mi olmalı?
**A:** ✅ **`ProductCard.tsx` (PascalCase)**. React component dosyaları PascalCase olmalıdır.

### Q: Hook dosyası `useProducts.ts` mi yoksa `UseProducts.ts` mi?
**A:** ✅ **`useProducts.ts` (camelCase)**. Hook dosyaları camelCase olmalıdır.

### Q: API class ismi `ProductsAPI` mi yoksa `ProductsApi` mi?
**A:** ✅ **`ProductsAPI` (API all caps)**. Kısaltmalar büyük harfle yazılır.

### Q: Props interface'ine `IProductCardProps` diyebilir miyim?
**A:** ❌ **Hayır**. "I" prefix kullanmayın. `ProductCardProps` kullanın.

### Q: `index.ts` dosyası zorunlu mu?
**A:** ⚠️ **Feature dizinleri için evet**. Her feature modülünde barrel export bulunmalı.

---

**Golden Rule:** İsimlendirme tutarlılığı kod okunabilirliği için kritiktir. Tüm proje boyunca aynı pattern'i kullanın.
