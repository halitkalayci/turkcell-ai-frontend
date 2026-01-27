import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import { ProductListV2 } from '@/components/products/ProductListV2';
import { describe, expect, test, beforeEach } from 'vitest';
import { server } from '@/test/setup';
import { http, HttpResponse, delay } from 'msw';
import { mockPaginatedResponseV2, mockEmptyResponse } from '../setup/mocks/products.mock';

describe('ProductListV2 (v2)', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  test('displays loading state initially', async () => {
    // Add delay to ensure loading state is visible
    server.use(
      http.get('*/api/v2/products', async () => {
        await delay(100);
        return HttpResponse.json(mockPaginatedResponseV2);
      })
    );

    renderWithProviders(<ProductListV2 />);

    // Loading spinner should be visible
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
    
    // Wait for products to load
    await screen.findByText('iPhone 15');
  });

  test('renders v2 products from MSW successfully', async () => {
    renderWithProviders(<ProductListV2 />);

    // Wait for a v2 product name
    expect(await screen.findByText('iPhone 15')).toBeInTheDocument();
    
    // Ensure second product appears
    expect(await screen.findByText('Pixel 9')).toBeInTheDocument();
    
    // Ensure third product appears
    expect(await screen.findByText('Galaxy S24')).toBeInTheDocument();
  });

  test('displays pagination information correctly', async () => {
    renderWithProviders(<ProductListV2 />);

    // Wait for products to load
    await screen.findByText('iPhone 15');

    // Pagination text should reflect totals
    const matches = screen.getAllByText(
      (_, el) => !!el && /of\s+\d+\s+products/i.test(el.textContent || '')
    );
    expect(matches.length).toBeGreaterThan(0);
  });

  test('displays product ratings correctly', async () => {
    renderWithProviders(<ProductListV2 />);

    // Wait for products to load
    await screen.findByText('iPhone 15');

    // Rating should be formatted (ceil rounded) - getAllByText since rating appears multiple times
    expect(screen.getAllByText('5/5')[0]).toBeInTheDocument(); // 4.5 → 5
  });

  test('shows discount badge when applicable', async () => {
    renderWithProviders(<ProductListV2 />);

    // Wait for products to load
    await screen.findByText('Pixel 9');

    // Discount badge should appear (Pixel 9 has 10% discount)
    expect(screen.getByText('10% OFF')).toBeInTheDocument();
  });

  test('renders product images', async () => {
    renderWithProviders(<ProductListV2 />);

    // Wait for products to load
    await screen.findByText('iPhone 15');

    // Images should be rendered with alt text
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    
    // Check specific product image
    const iphoneImage = screen.getByAltText('iPhone 15');
    expect(iphoneImage).toBeInTheDocument();
    expect(iphoneImage).toHaveAttribute('src', 'https://example.com/iphone15.jpg');
  });

  test('handles missing optional fields gracefully', async () => {
    // Product with null discount and no rating display
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

    renderWithProviders(<ProductListV2 />);

    // Product name should still render
    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    
    // No discount badge should appear
    expect(screen.queryByText(/% OFF/i)).not.toBeInTheDocument();
  });

  test('shows empty state when no products exist', async () => {
    server.use(
      http.get('*/api/v2/products', () => {
        return HttpResponse.json(mockEmptyResponse);
      })
    );

    renderWithProviders(<ProductListV2 />);

    // Wait for empty state message
    expect(await screen.findByText(/no products found/i)).toBeInTheDocument();
    expect(screen.getByText(/There are no products available at the moment/i)).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    server.use(
      http.get('*/api/v2/products', () => {
        return HttpResponse.json(
          { message: 'Internal server error' },
          { status: 500 }
        );
      })
    );

    renderWithProviders(<ProductListV2 />);

    // Wait for error message
    expect(
      await screen.findByText(/error loading products/i)
    ).toBeInTheDocument();
    
    // Error message should be displayed
    expect(screen.getByText(/server error/i)).toBeInTheDocument();
    
    // Retry button should be present
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  test('refetch works after error', async () => {
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

    renderWithProviders(<ProductListV2 />);

    // Wait for error
    await screen.findByText(/error loading products/i);

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await userEvent.click(retryButton);

    // Products should load successfully
    await waitFor(() => {
      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    });
  });

  test('matches snapshot for product grid layout', async () => {
    const { container } = renderWithProviders(<ProductListV2 />);

    // Wait for products to load
    await screen.findByText('iPhone 15');

    // Snapshot of rendered markup
    expect(container).toMatchSnapshot();
  });
});
