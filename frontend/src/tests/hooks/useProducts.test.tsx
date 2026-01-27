import { useProducts } from '@/hooks/useProducts';
import { renderWithProviders } from '@/test/utils';
import { screen } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, test } from 'vitest';

function HookConsumer() {
  const { products, loading, error } = useProducts({ page: 0, size: 10 });
  useEffect(() => {
    // noop; just triggering initial render
  }, [products, loading, error]);
  return (
    <div>
      <div aria-label="loading">{String(loading)}</div>
      <div aria-label="error">{error ?? ''}</div>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

describe('useProducts hook (v1) with RTL', () => {
  test('eventually renders product names', async () => {
    renderWithProviders(<HookConsumer />);
    // After fetch completes, products should be rendered
    expect(await screen.findByText('iPhone 15')).toBeInTheDocument();
    expect(await screen.findByText('Pixel 9')).toBeInTheDocument();
  });
});
