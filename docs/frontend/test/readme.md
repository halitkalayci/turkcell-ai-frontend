# Frontend Testing Guide

This document helps new developers understand and use the frontend test setup.

## Stack & Goals

- Vitest as the test runner (jsdom environment)
- React Testing Library (RTL) for components and hooks
- MSW (Mock Service Worker) for HTTP mocking against OpenAPI v1/v2
- Strict TypeScript with `@/` alias
- Coverage threshold: 80% (lines, statements, functions, branches)
- Snapshot policy: allowed for stable, semantic markup only

## Where Things Live

```
src/
  tests/                 # All test files live here
    unit/                # Pure functions (utils, logic)
    component/           # Component tests (RTL)
    integration/         # UI+state+service integration (MSW)
    hooks/               # Hook tests (tested via RTL-rendered consumers)
  test/
    setup.ts             # Global test setup (jest-dom + MSW server)
    utils.ts             # Custom render helper for providers
    mocks/handlers.ts    # MSW handlers covering v1/v2 products endpoints

docs/frontend/test/readme.md  # This guide
```

Key configs:
- `vite.config.ts` → `test` block (jsdom, setup files, coverage)
- `tsconfig.test.json` → types (`vitest`, `vite/client`, `node`), `@/*` alias

## Running Tests

```bash
npm run test        # Run once (CI-friendly)
npm run test:watch  # Watch mode (local dev)
npm run coverage    # Collect coverage (thresholds enforced)
```

## Mocking with MSW

- Handlers in `src/test/mocks/handlers.ts` mock `/api/v1/products` and `/api/v2/products` (relative and absolute URLs).
- Global server lifecycle (`listen/resetHandlers/close`) is managed in `src/test/setup.ts`.
- Keep handlers aligned with `/docs/openapi/products-v1.yaml` and `/docs/openapi/products-v2.yaml` (SSOT).

## Conventions & Boundaries

- Use `@/` imports (never long relative paths across layers).
- Respect architecture: UI → State → Business → API; tests exercise public interfaces only.
- Prefer semantic queries in RTL (`getByRole`, `getByText`) over className assertions.
- Async UI updates: use `findBy*` queries to await rendered content.
- Snapshot policy: allow when markup is stable and semantic; avoid broad snapshots of dynamic content.

## Examples

### Unit Test (utils/formatters)

```ts
// src/tests/unit/formatters.test.ts
import { formatPrice } from '@/utils/formatters';

describe('formatPrice', () => {
  it('formats price and currency', () => {
    expect(formatPrice(999.99, 'USD')).toBe('999.99 USD');
  });
});
```

### Unit Test (utils/pagination)

```ts
// src/tests/unit/pagination.test.ts
import { calculatePageStartIndex, calculatePageEndIndex } from '@/utils/pagination';

describe('pagination utils', () => {
  it('calculates start and end indexes', () => {
    expect(calculatePageStartIndex(0, 10)).toBe(1);
    expect(calculatePageEndIndex(0, 10, 25)).toBe(10);
  });
});
```

### Integration Test (component)

```tsx
// src/tests/component/ProductList.test.tsx
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { ProductList } from '@/components/products/ProductList';

describe('ProductList (v1)', () => {
  it('renders products from MSW and matches snapshot', async () => {
    const { container } = renderWithProviders(<ProductList />);
    // Wait for MSW-backed items
    expect(await screen.findByText('iPhone 15')).toBeInTheDocument();
    expect(await screen.findByText('Pixel 9')).toBeInTheDocument();
    // Pagination text can be split across spans; use function matcher
    const matches = screen.getAllByText((_, el) => !!el && /of\s+\d+\s+products/i.test(el.textContent || ''));
    expect(matches.length).toBeGreaterThan(0);
    // Stable snapshot of rendered markup
    expect(container).toMatchSnapshot();
  });
});
```

### Integration Test (hook)

Hooks are tested by rendering a minimal component that uses the hook (RTL). Avoid direct `renderHook` unless approved.

```tsx
// src/tests/hooks/useProducts.test.tsx
import { useEffect } from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { useProducts } from '@/hooks/useProducts';

function HookConsumer() {
  const { products, loading, error } = useProducts({ page: 0, size: 10 });
  useEffect(() => {}, [products, loading, error]);
  return (
    <div>
      <div aria-label="loading">{String(loading)}</div>
      <div aria-label="error">{error ?? ''}</div>
      <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}

describe('useProducts hook (v1)', () => {
  it('eventually renders product names', async () => {
    renderWithProviders(<HookConsumer />);
    expect(await screen.findByText('iPhone 15')).toBeInTheDocument();
    expect(await screen.findByText('Pixel 9')).toBeInTheDocument();
  });
});
```

## Coverage

- Thresholds are enforced in `vite.config.ts` (80%).
- Common exclusions: `src/types/**`, `src/**/index.ts`, type-only files.
- Use `npm run coverage` to generate `coverage/` reports (text, html, lcov).

## Troubleshooting

- If RTL cannot find text that spans multiple elements, use a function matcher:
  `screen.getAllByText((_, el) => /of\s+\d+\s+products/i.test(el?.textContent || ''))`
- Network calls should never hit real backends in tests; add/adjust MSW handlers.
- Ensure imports use `@/` alias (tsconfig + Vite alias are configured).

## Keep SSOT

- Tests that assert API shape must use types from `src/types/api/`.
- MSW handlers MUST reflect `/docs/openapi/products-*.yaml` (paths, fields, and examples).

---

For questions or improvements, propose changes that preserve architecture boundaries and SSOT. Keep the test suite fast, deterministic, and readable.
