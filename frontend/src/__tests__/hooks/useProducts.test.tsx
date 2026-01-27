import { useProducts } from '@/hooks/useProducts';
import { renderWithProviders } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, test, beforeEach } from 'vitest';
import { server } from '@/test/setup';
import { http, HttpResponse, delay } from 'msw';
import { mockPaginatedResponseV1 } from '../setup/mocks/products.mock';

function HookConsumer({ page = 0, size = 10 }: { page?: number; size?: number }) {
  const { products, loading, error, pagination, refetch } = useProducts({ page, size });
  
  useEffect(() => {
    // Trigger re-render when dependencies change
  }, [products, loading, error, pagination, refetch]);
  
  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="error">{error ?? ''}</div>
      <div data-testid="total-elements">{pagination?.totalElements ?? 0}</div>
      <ul data-testid="products-list">
        {products.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      <button onClick={refetch} data-testid="refetch-button">
        Refetch
      </button>
    </div>
  );
}

describe('useProducts hook (v1)', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  test('eventually renders product names', async () => {
    renderWithProviders(<HookConsumer />);

    // After fetch completes, products should be rendered
    expect(await screen.findByText('iPhone 15')).toBeInTheDocument();
    expect(await screen.findByText('Pixel 9')).toBeInTheDocument();
    expect(await screen.findByText('Galaxy S24')).toBeInTheDocument();
  });

  test('loading state transitions correctly', async () => {
    server.use(
      http.get('*/api/v1/products', async () => {
        await delay(100);
        return HttpResponse.json(mockPaginatedResponseV1);
      })
    );

    renderWithProviders(<HookConsumer />);

    // Initially loading should be true
    const loadingElement = screen.getByTestId('loading');
    expect(loadingElement).toHaveTextContent('true');

    // After data loads, loading should be false
    await waitFor(() => {
      expect(loadingElement).toHaveTextContent('false');
    });

    // Products should be loaded
    expect(await screen.findByText('iPhone 15')).toBeInTheDocument();
  });

  test('handles errors correctly', async () => {
    server.use(
      http.get('*/api/v1/products', () => {
        return HttpResponse.json(
          { message: 'Internal server error' },
          { status: 500 }
        );
      })
    );

    renderWithProviders(<HookConsumer />);

    // Wait for error to appear
    const errorElement = screen.getByTestId('error');
    await waitFor(() => {
      expect(errorElement).not.toHaveTextContent('');
    });

    // Error message should be user-friendly
    expect(errorElement).toHaveTextContent(/server error/i);
  });

  test('refetches data when trigger changes', async () => {
    let callCount = 0;

    server.use(
      http.get('*/api/v1/products', () => {
        callCount++;
        return HttpResponse.json(mockPaginatedResponseV1);
      })
    );

    renderWithProviders(<HookConsumer />);

    // Wait for initial load
    await screen.findByText('iPhone 15');
    expect(callCount).toBe(1);

    // Click refetch button
    const refetchButton = screen.getByTestId('refetch-button');
    refetchButton.click();

    // Wait for second fetch to complete
    await waitFor(() => {
      expect(callCount).toBe(2);
    });
  });

  test('updates products when pagination changes', async () => {
    const { rerender } = renderWithProviders(<HookConsumer page={0} size={10} />);

    // Wait for initial load
    await screen.findByText('iPhone 15');

    // Change page
    server.use(
      http.get('*/api/v1/products', () => {
        return HttpResponse.json({
          items: [
            {
              id: '4',
              name: 'New Product',
              price: 599.99,
              currency: 'USD',
              inStock: true,
              createdAt: '2024-01-04T00:00:00Z',
              updatedAt: '2024-01-04T00:00:00Z',
            },
          ],
          page: 1,
          size: 10,
          totalElements: 1,
          totalPages: 1,
        });
      })
    );

    rerender(<HookConsumer page={1} size={10} />);

    // New product should appear
    expect(await screen.findByText('New Product')).toBeInTheDocument();
  });

  test('maintains proper loading state transitions during error recovery', async () => {
    let callCount = 0;

    server.use(
      http.get('*/api/v1/products', () => {
        callCount++;
        if (callCount === 1) {
          return HttpResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
          );
        }
        return HttpResponse.json(mockPaginatedResponseV1);
      })
    );

    renderWithProviders(<HookConsumer />);

    // Wait for error
    const errorElement = screen.getByTestId('error');
    await waitFor(() => {
      expect(errorElement).not.toHaveTextContent('');
    });

    // Click refetch
    const refetchButton = screen.getByTestId('refetch-button');
    refetchButton.click();

    // Loading should become true
    const loadingElement = screen.getByTestId('loading');
    await waitFor(() => {
      expect(loadingElement).toHaveTextContent('true');
    });

    // Then false after success
    await waitFor(() => {
      expect(loadingElement).toHaveTextContent('false');
    });

    // Error should be cleared
    expect(errorElement).toHaveTextContent('');

    // Products should load
    expect(await screen.findByText('iPhone 15')).toBeInTheDocument();
  });

  test('returns pagination metadata correctly', async () => {
    renderWithProviders(<HookConsumer />);

    // Wait for products to load
    await screen.findByText('iPhone 15');

    // Check pagination metadata
    const totalElements = screen.getByTestId('total-elements');
    expect(totalElements).toHaveTextContent('3');
  });
});
