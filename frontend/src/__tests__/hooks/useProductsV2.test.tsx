import { useProductsV2 } from '@/hooks/useProductsV2';
import { renderWithProviders } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, test, beforeEach } from 'vitest';
import { server } from '@/test/setup';
import { http, HttpResponse, delay } from 'msw';
import { mockPaginatedResponseV2 } from '../setup/mocks/products.mock';

function HookConsumerV2({ page = 0, size = 10 }: { page?: number; size?: number }) {
  const { products, loading, error, pagination, refetch } = useProductsV2({ page, size });
  
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
          <li key={p.id}>
            <span>{p.name}</span>
            {p.rating && <span data-testid={`rating-${p.id}`}>{p.rating}</span>}
            {p.discountPercent !== null && p.discountPercent !== undefined && (
              <span data-testid={`discount-${p.id}`}>{p.discountPercent}</span>
            )}
            {p.imageUrl && <span data-testid={`image-${p.id}`}>{p.imageUrl}</span>}
          </li>
        ))}
      </ul>
      <button onClick={refetch} data-testid="refetch-button">
        Refetch
      </button>
    </div>
  );
}

describe('useProductsV2 hook (v2)', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  test('eventually renders product names', async () => {
    renderWithProviders(<HookConsumerV2 />);

    // After fetch completes, products should be rendered
    expect(await screen.findByText('iPhone 15')).toBeInTheDocument();
    expect(await screen.findByText('Pixel 9')).toBeInTheDocument();
    expect(await screen.findByText('Galaxy S24')).toBeInTheDocument();
  });

  test('loading state transitions correctly', async () => {
    server.use(
      http.get('*/api/v2/products', async () => {
        await delay(100);
        return HttpResponse.json(mockPaginatedResponseV2);
      })
    );

    renderWithProviders(<HookConsumerV2 />);

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
      http.get('*/api/v2/products', () => {
        return HttpResponse.json(
          { message: 'Internal server error' },
          { status: 500 }
        );
      })
    );

    renderWithProviders(<HookConsumerV2 />);

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
      http.get('*/api/v2/products', () => {
        callCount++;
        return HttpResponse.json(mockPaginatedResponseV2);
      })
    );

    renderWithProviders(<HookConsumerV2 />);

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

  test('returns v2-specific fields (rating, imageUrl, discount)', async () => {
    renderWithProviders(<HookConsumerV2 />);

    // Wait for products to load
    await screen.findByText('iPhone 15');

    // Check rating field
    const rating1 = screen.getByTestId('rating-1');
    expect(rating1).toHaveTextContent('4.5');

    // Check discount field (Pixel 9 has 10% discount)
    const discount2 = screen.getByTestId('discount-2');
    expect(discount2).toHaveTextContent('10');

    // Check imageUrl field
    const image1 = screen.getByTestId('image-1');
    expect(image1).toHaveTextContent('https://example.com/iphone15.jpg');
  });

  test('handles null optional fields gracefully', async () => {
    server.use(
      http.get('*/api/v2/products', () => {
        return HttpResponse.json({
          items: [
            {
              id: '1',
              name: 'Test Product',
              price: 99.99,
              currency: 'USD',
              inStock: true,
              rating: null,
              imageUrl: null,
              discount: null,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
          ],
          page: 0,
          size: 10,
          totalElements: 1,
          totalPages: 1,
        });
      })
    );

    renderWithProviders(<HookConsumerV2 />);

    // Product name should render
    expect(await screen.findByText('Test Product')).toBeInTheDocument();

    // Optional fields should not be rendered (null)
    expect(screen.queryByTestId('rating-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('discount-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('image-1')).not.toBeInTheDocument();
  });

  test('updates products when pagination changes', async () => {
    const { rerender } = renderWithProviders(<HookConsumerV2 page={0} size={10} />);

    // Wait for initial load
    await screen.findByText('iPhone 15');

    // Change page
    server.use(
      http.get('*/api/v2/products', () => {
        return HttpResponse.json({
          items: [
            {
              id: '4',
              name: 'New Product V2',
              price: 599.99,
              currency: 'USD',
              inStock: true,
              rating: 4.0,
              imageUrl: 'https://example.com/new.jpg',
              discount: 15,
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

    rerender(<HookConsumerV2 page={1} size={10} />);

    // New product should appear
    expect(await screen.findByText('New Product V2')).toBeInTheDocument();
  });

  test('maintains proper loading state transitions during error recovery', async () => {
    let callCount = 0;

    server.use(
      http.get('*/api/v2/products', () => {
        callCount++;
        if (callCount === 1) {
          return HttpResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
          );
        }
        return HttpResponse.json(mockPaginatedResponseV2);
      })
    );

    renderWithProviders(<HookConsumerV2 />);

    // Wait for error
    const errorElement = screen.getByTestId('error');
    await waitFor(() => {
      expect(errorElement).not.toHaveTextContent('');
    });

    // Click refetch
    const refetchButton = screen.getByTestId('refetch-button');
    refetchButton.click();

    // After refetch, error should be cleared and products should load
    await waitFor(() => {
      expect(errorElement).toHaveTextContent('');
    });

    expect(await screen.findByText('iPhone 15')).toBeInTheDocument();
  });

  test('returns pagination metadata correctly', async () => {
    renderWithProviders(<HookConsumerV2 />);

    // Wait for products to load
    await screen.findByText('iPhone 15');

    // Check pagination metadata
    const totalElements = screen.getByTestId('total-elements');
    expect(totalElements).toHaveTextContent('3');
  });
});
