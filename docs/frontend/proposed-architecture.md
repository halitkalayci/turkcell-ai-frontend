# Proposed Frontend Folder Architecture

## Current State (Mevcut Durum)

```
frontend/src/
├── App.css
├── App.tsx              # Boilerplate demo app
├── index.css
├── main.tsx
└── assets/
    └── react.svg
```

**Durum:** Proje yeni oluşturulmuş, sadece Vite template dosyaları mevcut.

---

## Proposed Structure (Önerilen Mimari)

```
frontend/
├── public/                          # Static assets
│   └── favicon.ico
│
├── src/
│   ├── api/                         # API Layer - HTTP client
│   │   ├── client.ts                # Base HTTP client (fetch wrapper)
│   │   ├── products.api.ts          # Products endpoints (OpenAPI operationIds)
│   │   └── index.ts                 # Barrel export
│   │
│   ├── services/                    # Business Layer
│   │   ├── products.service.ts      # Product business logic
│   │   └── index.ts
│   │
│   ├── hooks/                       # State Layer - React hooks
│   │   ├── useProducts.ts           # Product state management
│   │   └── index.ts
│   │
│   ├── components/                  # UI Layer
│   │   ├── products/                # Feature-specific components
│   │   │   ├── ProductList.tsx      # Product list view
│   │   │   ├── ProductCard.tsx      # Single product card
│   │   │   ├── ProductForm.tsx      # Create/Edit product form
│   │   │   ├── ProductDetail.tsx    # Product detail view
│   │   │   └── index.ts             # Barrel export
│   │   │
│   │   ├── common/                  # Shared/reusable components
│   │   │   ├── Button.tsx           # Button component
│   │   │   ├── Input.tsx            # Input component
│   │   │   ├── Modal.tsx            # Modal component
│   │   │   ├── Spinner.tsx          # Loading spinner
│   │   │   ├── ErrorMessage.tsx     # Error display
│   │   │   └── index.ts
│   │   │
│   │   └── layout/                  # Layout components
│   │       ├── Header.tsx           # App header
│   │       ├── Footer.tsx           # App footer
│   │       ├── Sidebar.tsx          # Sidebar navigation
│   │       └── index.ts
│   │
│   ├── pages/                       # Page components (routes)
│   │   ├── HomePage.tsx             # Landing page
│   │   ├── ProductsPage.tsx         # Products list page
│   │   ├── ProductDetailPage.tsx    # Product detail page
│   │   ├── CreateProductPage.tsx    # Create product page
│   │   ├── EditProductPage.tsx      # Edit product page
│   │   └── NotFoundPage.tsx         # 404 page
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── api/                     # OpenAPI-derived types (SSOT)
│   │   │   ├── products.types.ts    # Product, CreateProductRequest, etc.
│   │   │   ├── common.types.ts      # ErrorResponse, ErrorDetail
│   │   │   └── index.ts             # Barrel export
│   │   │
│   │   ├── domain/                  # Frontend-only domain types
│   │   │   ├── ui-state.types.ts    # AsyncState, FormState, etc.
│   │   │   ├── view-models.types.ts # ProductViewModel, etc.
│   │   │   └── index.ts
│   │   │
│   │   └── common/                  # Generic utility types
│   │       ├── result.types.ts      # Result<T, E>
│   │       ├── pagination.types.ts  # PaginationMeta
│   │       └── index.ts
│   │
│   ├── utils/                       # Utility functions
│   │   ├── formatters.ts            # formatCurrency, formatDate, etc.
│   │   ├── validators.ts            # validateEmail, validatePrice, etc.
│   │   ├── constants.ts             # API_BASE_URL, DEFAULT_PAGE_SIZE, etc.
│   │   └── index.ts
│   │
│   ├── styles/                      # Global styles
│   │   ├── globals.css              # Global CSS reset + base styles
│   │   ├── variables.css            # CSS custom properties (colors, spacing)
│   │   └── themes.css               # Theme definitions (optional)
│   │
│   ├── assets/                      # Static assets
│   │   ├── images/                  # Images
│   │   └── icons/                   # Icons/SVGs
│   │
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Entry point
│   ├── App.css                      # App-level styles (optional)
│   ├── index.css                    # Global styles import
│   └── vite-env.d.ts                # Vite type declarations
│
├── docs/                            # Frontend-specific docs (optional)
│   └── components/                  # Component documentation (Storybook alternative)
│
├── .env.example                     # Environment variables template
├── .env.development                 # Development environment variables
├── .env.production                  # Production environment variables
├── .gitignore
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML entry point
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config (root)
├── tsconfig.app.json                # TypeScript config (app)
├── tsconfig.node.json               # TypeScript config (Vite config)
├── vite.config.ts                   # Vite configuration
└── README.md                        # Frontend README
```

---

## File Count Estimation

| Layer/Directory      | Estimated Files | Rationale                               |
|----------------------|----------------:|-----------------------------------------|
| `api/`               | 2-5             | 1 client + 1-4 resource API files       |
| `services/`          | 2-5             | 1 service per resource                  |
| `hooks/`             | 5-10            | 1 hook per resource + utility hooks     |
| `components/products/` | 4-6           | List, Card, Form, Detail                |
| `components/common/` | 5-10            | Button, Input, Modal, Spinner, etc.     |
| `components/layout/` | 3-5             | Header, Footer, Sidebar                 |
| `pages/`             | 5-8             | Home, Products, Detail, Create, Edit    |
| `types/api/`         | 2-4             | products, common, etc.                  |
| `types/domain/`      | 2-3             | ui-state, view-models                   |
| `types/common/`      | 2-3             | result, pagination                      |
| `utils/`             | 3-5             | formatters, validators, constants       |

**Total:** ~40-60 TypeScript files (reasonable for a mini e-commerce frontend)

---

## Implementation Priority

### Phase 1: Foundation (Week 1)

```
✅ Öncelik 1 - Core Infrastructure
├── src/types/api/
│   ├── products.types.ts          # OpenAPI schema mirroring
│   └── common.types.ts            # ErrorResponse, ErrorDetail
│
├── src/types/common/
│   └── result.types.ts            # Result<T>, AsyncState<T>
│
├── src/api/
│   ├── client.ts                  # Base HTTP client
│   └── products.api.ts            # Products CRUD endpoints
│
├── src/services/
│   └── products.service.ts        # Product business logic
│
├── src/hooks/
│   └── useProducts.ts             # Product state management
│
├── src/utils/
│   ├── constants.ts               # API_BASE_URL, etc.
│   └── formatters.ts              # formatCurrency, formatDate
│
└── src/styles/
    ├── globals.css                # Base styles
    └── variables.css              # CSS variables
```

### Phase 2: UI Components (Week 2)

```
✅ Öncelik 2 - Basic UI
├── src/components/common/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Spinner.tsx
│   └── ErrorMessage.tsx
│
└── src/components/products/
    ├── ProductList.tsx            # List view with hooks
    ├── ProductCard.tsx            # Single product card
    └── ProductForm.tsx            # Create/Edit form
```

### Phase 3: Pages & Routing (Week 3)

```
✅ Öncelik 3 - Pages
├── src/pages/
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx           # Uses ProductList
│   ├── ProductDetailPage.tsx      # Uses ProductDetail
│   └── NotFoundPage.tsx
│
└── src/App.tsx                    # Router setup (React Router)
```

### Phase 4: Advanced Features (Week 4+)

```
✅ Öncelik 4 - Advanced
├── src/components/layout/
│   ├── Header.tsx
│   └── Footer.tsx
│
├── src/components/products/
│   └── ProductDetail.tsx          # Detailed view
│
├── src/pages/
│   ├── CreateProductPage.tsx
│   └── EditProductPage.tsx
│
└── src/hooks/
    └── useDebounce.ts             # Search debouncing
```

---

## Key Decisions & Rationale

### 1. No State Management Library (Initially)

**Decision:** Start with React Context/useState
**Rationale:**
- Mini e-commerce scope (not large-scale)
- React 19 with hooks is sufficient
- Can migrate to Zustand/Jotai later if needed

**Future:** If state complexity grows, add Zustand:
```bash
npm install zustand
```

### 2. Native Fetch (No Axios)

**Decision:** Use native `fetch` with wrapper
**Rationale:**
- Modern browsers support fetch
- No external dependency
- Lightweight
- Can switch to axios later if needed

**Implementation:**
```typescript
// src/api/client.ts
export const apiClient = {
  async get(url: string, options?: RequestInit) { /* ... */ },
  async post(url: string, body: unknown, options?: RequestInit) { /* ... */ },
  // ...
};
```

### 3. CSS Modules (Optional)

**Decision:** Start with vanilla CSS, optionally add CSS Modules
**Rationale:**
- Vite supports CSS Modules out of the box
- No build config needed
- Can add later if component styles conflict

**Usage:**
```tsx
// ProductCard.module.css
import styles from './ProductCard.module.css';

export function ProductCard() {
  return <div className={styles.card}>...</div>;
}
```

### 4. Path Aliases

**Decision:** Configure `@/` alias for cleaner imports
**Implementation:**

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

```jsonc
// tsconfig.app.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 5. Environment Variables

**Decision:** Use `.env` files for configuration
**Files:**
- `.env.example` → Commit to Git (template)
- `.env.development` → Local dev config
- `.env.production` → Production build config

**Example:**
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=Turkcell E-Commerce (Dev)

# .env.production
VITE_API_BASE_URL=https://api.production.com
VITE_APP_TITLE=Turkcell E-Commerce
```

**Usage:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

---

## Migration from Current State

### Step 1: Create Directory Structure

```bash
cd frontend/src
mkdir -p api services hooks components/{products,common,layout} pages types/{api,domain,common} utils styles
```

### Step 2: Move/Refactor Existing Files

```bash
# App.tsx will be refactored (remove demo code)
# main.tsx stays as-is
# App.css can be moved to styles/ or kept
```

### Step 3: Create Foundation Files

Priority order:
1. `types/api/products.types.ts` (OpenAPI mirroring)
2. `api/client.ts` (HTTP client)
3. `api/products.api.ts` (API endpoints)
4. `services/products.service.ts` (Business logic)
5. `hooks/useProducts.ts` (State management)

### Step 4: Build UI Components

1. `components/common/` (Button, Input, etc.)
2. `components/products/ProductCard.tsx`
3. `components/products/ProductList.tsx`
4. `pages/ProductsPage.tsx`

### Step 5: Setup Routing

```bash
npm install react-router-dom
```

Update `App.tsx` with router.

---

## Developer Onboarding Checklist

New developers should:

1. ✅ Read `/docs/frontend/README.md`
2. ✅ Read `/docs/frontend/01-architecture-layers.md`
3. ✅ Review folder structure above
4. ✅ Clone repo and run `npm install`
5. ✅ Copy `.env.example` to `.env.development`
6. ✅ Run `npm run dev` and verify app starts
7. ✅ Review OpenAPI spec: `/docs/openapi/products-v1.yaml`
8. ✅ Create first component following layer rules
9. ✅ Use code review checklist before PR

---

## Future Enhancements

### Approved for Phase 1

1. **UI Component Library (✅ APPROVED):**
   ```bash
   npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
   # Headless UI primitives - lightweight and accessible
   ```

### Deferred to Future Phases

1. **Testing (⏭️ SKIPPED):**
   - No test suite required initially
   - Will be added in future phase
   ```bash
   # Future: npm install -D vitest @testing-library/react
   ```

2. **CI/CD (⏭️ SKIPPED):**
   - Manual deployment initially
   - Pipeline will be added later

3. **Authentication (⏭️ DEFERRED):**
   - Auth implementation postponed
   - Focus on core product features first

4. **State Management (if needed):**
   ```bash
   npm install zustand  # Only if Context becomes insufficient
   ```

5. **Form Validation:**
   ```bash
   npm install react-hook-form zod  # When complex forms are needed
   ```

6. **Code Splitting:**
   - Lazy load pages: `const ProductsPage = lazy(() => import('./pages/ProductsPage'))`

---

## Summary

| Aspect               | Decision                           | Status |
|----------------------|------------------------------------|--------|
| State Management     | React Context/useState             | ✅ Approved |
| HTTP Client          | Native fetch (wrapped)             | ✅ Approved |
| UI Component Library | Radix UI (headless primitives)     | ✅ Approved |
| Styling              | Vanilla CSS + CSS Modules          | ✅ Approved |
| Routing              | React Router v6                    | ✅ Approved |
| Type Generation      | Manual (OpenAPI mirroring)         | ✅ Approved (No codegen) |
| Testing              | Skipped                            | ⏭️ Deferred |
| CI/CD                | Skipped                            | ⏭️ Deferred |
| Authentication       | Skipped                            | ⏭️ Deferred |

**Golden Rule:** Start simple, focus on core product features first.
