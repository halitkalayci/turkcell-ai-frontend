## Mini E-Commerce System

This repository contains a mini e-commerce ecosystem.

- frontend tech stack: React, Vite, TS
- backend tech stack: Spring (3.X), JAVA (21)

---

## 1) HOW TO WORK (MANDATORY WORKFLOW)

### 1.1 Plan-First, then code

Before generating code, you MUST:

- Propose a FILE BREAKDOWN (what files will be created/changed + why)

- Ask QUESTIONS for missing details instead of guessing.

### 1.2 No INVENTING

You MUST NOT invent:

- endpoints, request/response fields, error models

- event names/payloads

- API endpoints for frontend

- Business rules

- Anything architectural

If any detail is missing, ASK.

### 1.3 Documentation

- You MUST NOT create any .md files unless it is requested.

## 2) CONTRACT FIRST

### 2.1 OpenAPI is the source of truth

- API contracts live under: `/docs/openapi`

- Implementation MUST follow the contract; never the other way around.

### 2.2 Code Generation Policy

- We may use OpenAPI tooling ONLY if already present in the repository.

- You MUST NOT add new OpenAPI generator dependencies without explicit approval.

- If no generator is available, implement controllers/DTOs manually to match the spec.

### 2.3 Versioning

- API Changes MUST be versioned. (eg. `api/v1/orders`, `/api/v2/orders`)

- Version MUST be placed in path.

- Breaking changes require a new version; do not silently break clients.

---

## 3) FRONTEND ARCHITECTURE (MANDATORY FLOW)

### 3.1 Single Source of Truth (SSOT)

**OpenAPI as SSOT:**
- ALL API types, request/response models MUST be derived from `/docs/openapi/*.yaml`
- Frontend types live ONLY in `src/types/api/` and are generated or manually mirrored from OpenAPI schemas
- NEVER define duplicate API types in component files, hooks, or elsewhere

**Type Location Rules:**
- `src/types/api/` → OpenAPI-derived models (Product, ErrorResponse, etc.)
- `src/types/domain/` → Pure frontend domain types (UI state, view models)
- `src/types/common/` → Shared utility types (Result<T>, AsyncState<T>, etc.)

### 3.2 Mandatory Layered Flow: UI → State → Business → API

All data flow MUST follow this strict hierarchy:

```
┌─────────────┐
│ UI Layer    │  (Components) - Presentation only, no business logic
└──────┬──────┘
       ↓
┌──────────────┐
│ State Layer  │  (Hooks, Context, Store) - Manages component state
└──────┬───────┘
       ↓
┌──────────────┐
│ Business     │  (Services) - Business rules, validation, transformation
└──────┬───────┘
       ↓
┌──────────────┐
│ API Layer    │  (Client) - HTTP communication, OpenAPI contract compliance
└──────────────┘
```

**Layer Responsibilities:**

1. **UI Layer** (`src/components/`, `src/pages/`)
   - Renders JSX/TSX
   - Handles user events (onClick, onChange)
   - Delegates to State Layer hooks
   - NEVER calls services or API directly
   - NEVER contains business logic

2. **State Layer** (`src/hooks/`, `src/store/`, `src/context/`)
   - Manages React state (useState, useReducer, Context, Zustand, etc.)
   - Calls Business Layer services
   - Transforms service results to UI-friendly state
   - NEVER makes HTTP calls directly

3. **Business Layer** (`src/services/`)
   - Implements domain/business logic
   - Validates input before API calls
   - Transforms API responses to domain models
   - Calls API Layer
   - NEVER imports React hooks or components

4. **API Layer** (`src/api/`)
   - HTTP client (fetch, axios, etc.)
   - Enforces OpenAPI contract
   - Returns raw API types (`src/types/api/`)
   - NEVER contains business logic

### 3.3 File Naming & Organization

**Mandatory Structure:**
```
src/
├── api/
│   ├── client.ts              # HTTP client config (base URL, interceptors)
│   ├── products.api.ts        # Product endpoints (matches OpenAPI operationIds)
│   └── ...
├── services/
│   ├── products.service.ts    # Product business logic
│   └── ...
├── hooks/
│   ├── useProducts.ts         # Product state management
│   └── ...
├── components/
│   ├── products/
│   │   ├── ProductList.tsx
│   │   ├── ProductCard.tsx
│   │   └── ...
│   └── common/
│       └── ...
├── pages/
│   ├── ProductsPage.tsx
│   └── ...
├── types/
│   ├── api/                   # OpenAPI-derived types (SSOT)
│   │   ├── products.types.ts
│   │   ├── common.types.ts
│   │   └── ...
│   ├── domain/                # Frontend-only domain models
│   │   └── ...
│   └── common/                # Utility types
│       └── ...
└── utils/
    └── ...
```

### 3.4 Type Definition Rules

**OpenAPI to TypeScript Mapping:**

1. **Generate or Mirror:** Use OpenAPI generator if configured, otherwise manually create types that match 1:1 with schemas
2. **Naming Convention:**
   - OpenAPI `Product` → `Product` (exact match)
   - OpenAPI `CreateProductRequest` → `CreateProductRequest`
   - OpenAPI `ProductResponse` → `ProductResponse`
   - OpenAPI `ErrorResponse` → `ErrorResponse`

3. **Example (src/types/api/products.types.ts):**
   ```typescript
   // ✅ Correct: Matches OpenAPI schema exactly
   export interface Product {
     id: string;
     sku?: string | null;
     name: string;
     description?: string | null;
     price: number;
     currency: string;
     inStock: boolean;
     createdAt: string;
     updatedAt: string;
   }
   
   // ❌ Wrong: Duplicate or modified API type
   export interface ProductDTO { ... }  // Don't create alternative names
   ```

### 3.5 Import Rules (Enforce Layer Boundaries)

**Allowed Imports:**

- ✅ **UI** → State
- ✅ **State** → Business
- ✅ **Business** → API
- ✅ **API** → Types (api/)

**Forbidden Imports:**

- ❌ **UI** → Business (skip State Layer)
- ❌ **UI** → API (skip State & Business)
- ❌ **State** → API (skip Business)
- ❌ **Business** → State (no React hooks)
- ❌ **Business** → UI (no components)
- ❌ **API** → Business/State/UI

### 3.6 Code Review Checklist

Before committing, verify:

- [ ] All API types come from `src/types/api/` (no inline definitions)
- [ ] Components only call hooks (never services or API)
- [ ] Hooks only call services (never API directly)
- [ ] Services only call API layer
- [ ] No business logic in UI components
- [ ] No React imports in services or API layer
- [ ] File names follow convention (e.g., `products.api.ts`, `ProductList.tsx`)

### 3.7 Dependency Management

**Allowed Libraries:**
- State Management: React Context
- HTTP Client: fetch (native)
- UI Components: Radix UI (headless primitives)
- Form Handling: React Hook Form (when needed)
- Validation: Yup or Zod (when needed)

**Forbidden:**
- NEVER add OpenAPI code generators (manual type mirroring only)
- NEVER add competing state management libraries (one per project)
- NEVER add monolithic UI frameworks (Material-UI, Ant Design)

**Testing & CI/CD:**
- Testing: Skipped for now (no test suite required initially)
- CI/CD: Skipped for now (manual deployment)

**Authentication:**
- Auth implementation: Deferred to future phase

### 3.7.1 TypeScript Configuration Constraints

**Required Compiler Options:**
- ✅ `strict: true` (mandatory)
- ✅ `noUnusedLocals: true`
- ✅ `noUnusedParameters: true`
- ❌ `erasableSyntaxOnly` (FORBIDDEN - conflicts with error handling classes)

**Path Mapping (Mandatory):**
- MUST configure `@/` alias pointing to `src/` in both:
  1. `tsconfig.app.json` (baseUrl + paths)
  2. `vite.config.ts` (resolve.alias)
- All imports MUST use `@/` prefix (e.g., `import { Product } from '@/types/api'`)
- NEVER use relative imports across layers (e.g., `../../../types/api`)

**Rationale:** 
- Path aliases prevent layer boundary violations (easier to detect in code reviews)
- `erasableSyntaxOnly` prevents proper error handling patterns (custom Error classes)


### 3.8 Environment Variables

**Required Files:**
- `.env.development` (local development, gitignored)
- `.env.example` (template, committed to git)
- `.env.production` (production settings, managed separately)

**Naming Convention:**
- Vite variables MUST start with `VITE_` prefix
- Backend API: `VITE_API_BASE_URL`
- Example: `VITE_API_BASE_URL=http://localhost:8080`

**Usage:**
- Access via `import.meta.env.VITE_API_BASE_URL` (Vite-specific)
- NEVER hardcode API URLs in code
- HTTP client MUST read from environment variables

**Git Policy:**
- `.env.development` → IGNORED (local secrets)
- `.env.example` → COMMITTED (template)


### 3.9 Styling with Tailwind CSS

**Configuration Files Required:**
- `tailwind.config.js` - Tailwind configuration with content paths
- `postcss.config.js` - PostCSS with Tailwind and Autoprefixer plugins
- `index.css` - Import Tailwind directives (@tailwind base/components/utilities)

**Installation:**
- Tailwind CSS: `tailwindcss`
- PostCSS: `postcss`
- Autoprefixer: `autoprefixer`

**Usage:**
- Use Tailwind utility classes directly in JSX
- NO CSS modules or styled-components
- Responsive design with Tailwind breakpoints (sm, md, lg)
- Component styling stays in JSX (no separate CSS files per component)

**Examples:**
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Card: `bg-white rounded-lg shadow-md hover:shadow-lg`
- Button: `bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg`

### 3.10 React Hook Best Practices 
**Memory Leak Prevention:**
- ALL hooks with async operations MUST use cleanup pattern:
  ```typescript
  useEffect(() => {
    let isMounted = true;
    // async operations...
    if (isMounted) setState(...);
    return () => { isMounted = false; };
  }, [deps]);```

Error Message Transformation:

NEVER expose raw API errors to users
Transform technical errors to user-friendly messages
Map HTTP status codes to actionable messages
Refetch Pattern:

Use state-based trigger (refetchTrigger counter)
Avoid callback dependencies in useEffect
Dependency Arrays:

Primitive values only (string, number, boolean)
Destructure object properties before using in deps
NEVER pass entire objects (causes infinite loops)
### 3.11 Utility Functions & Presentation Logic

**FORBIDDEN in UI Layer:**
- ❌ Business logic (price calculations, validations)
- ❌ Data transformations (API response mapping)
- ❌ Reusable formatting logic (truncate, formatPrice, formatDate)
- ❌ Domain logic disguised as "helpers"

**ALLOWED in UI Layer:**
- ✅ JSX rendering only
- ✅ Event handlers that delegate to hooks
- ✅ Component-specific render helpers (e.g., `renderStockBadge()` used only in that component)
- ✅ Simple inline conditionals for className or styles

**MANDATORY Rules:**

1. **Reusable Logic → `src/utils/`:**
   - `formatters.ts` (formatPrice, formatDate, truncateText)
   - `validators.ts` (isValidEmail, isValidPrice)
   - `constants.ts` (API_BASE_URL, MAX_DESCRIPTION_LENGTH)

2. **Component-Specific Helpers:**
   - Keep simple render logic inside component if used ONLY once
   - Extract to utils/ if used in multiple components
   - Prefix with `render` for JSX fragments (e.g., `renderHeader()`)

3. **Utils Layer Characteristics:**
   - Pure functions (no side effects)
   - Framework-agnostic (no React imports)
   - Easily testable in isolation
   - No state management

**Examples:**

```typescript
// ✅ CORRECT: Utility in utils/formatters.ts
export function formatPrice(price: number, currency: string): string {
  return `${price.toFixed(2)} ${currency}`;
}

// ✅ CORRECT: Component imports utility
import { formatPrice } from '@/utils/formatters';

export function ProductCard({ product }: ProductCardProps) {
  return <span>{formatPrice(product.price, product.currency)}</span>;
}

// ✅ CORRECT: Component-specific helper (used only here)
export function ProductCard({ product }: ProductCardProps) {
  const renderStockBadge = () => (
    <span className={product.inStock ? 'badge-green' : 'badge-red'}>
      {product.inStock ? 'In Stock' : 'Out of Stock'}
    </span>
  );
  
  return <div>{renderStockBadge()}</div>;
}

// ❌ WRONG: Reusable utility defined in component
export function ProductCard({ product }: ProductCardProps) {
  function formatPrice(price: number, currency: string): string {
    return `${price.toFixed(2)} ${currency}`;  // Should be in utils/
  }
  
  return <span>{formatPrice(product.price, product.currency)}</span>;
}

// ❌ WRONG: Business logic in component
export function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = product.price * 0.9;  // Business logic!
  return <span>{discountedPrice}</span>;  // Should be in service layer
}
```

**Code Review Checklist:**
- [ ] No business logic in UI components
- [ ] Formatting functions in `src/utils/formatters.ts`
- [ ] Validation functions in `src/utils/validators.ts`
- [ ] No duplicate utility functions across components
- [ ] Utils are pure functions (no side effects)
- [ ] Utils have no React/framework dependencies

---
## 4) CODING STANDARDS (QUALITY BAR)

### 4.1) Simplicity

- Prefer the simplest working solution.

- Avoid over-engineering, unnecessary patterns, extra layers.

### 4.2) COMMENT LINES

- Do not add comment lines for all code blocks. Only use summaries for files and functions.