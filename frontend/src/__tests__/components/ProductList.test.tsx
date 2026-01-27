import { ProductList } from '@/components/products';
import { renderWithProviders } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import { describe, expect, test, beforeEach } from 'vitest';
import { server } from '@/test/setup';
import { http, HttpResponse, delay } from 'msw';
import { mockPaginatedResponseV1, mockEmptyResponse } from '../setup/mocks/products.mock';

describe('ProductList (v1)', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  test('displays loading state initially', async () => {
    // Add delay to ensure loading state is visible
    server.use(
      http.get('*/api/v1/products', async () => {
        await delay(100);
        return HttpResponse.json(mockPaginatedResponseV1);
      })
    );

    renderWithProviders(<ProductList />);

    // Loading spinner should be visible
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
    
    // Wait for products to load
    await screen.findByText('iPhone 15');
  });

  test('renders products from MSW successfully', async () => {
    renderWithProviders(<ProductList />);

    // Wait for first product name
    const first = await screen.findByText('iPhone 15');
    expect(first).toBeInTheDocument();

    // Ensure second product appears
    expect(await screen.findByText('Pixel 9')).toBeInTheDocument();

    // Ensure third product appears
    expect(await screen.findByText('Galaxy S24')).toBeInTheDocument();
  });

  test('displays pagination information correctly', async () => {
    renderWithProviders(<ProductList />);

    // Wait for products to load
    await screen.findByText('iPhone 15');

    // Pagination text should reflect totals
    const matches = screen.getAllByText(
      (_, el) => !!el && /of\s+\d+\s+products/i.test(el.textContent || '')
    );
    expect(matches.length).toBeGreaterThan(0);
  });

  test('shows empty state when no products exist', async () => {
    server.use(
      http.get('*/api/v1/products', () => {
        return HttpResponse.json(mockEmptyResponse);
      })
    );

    renderWithProviders(<ProductList />);

    // Wait for empty state message
    expect(await screen.findByText(/no products found/i)).toBeInTheDocument();
    expect(screen.getByText(/There are no products available at the moment/i)).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    server.use(
      http.get('*/api/v1/products', () => {
        return HttpResponse.json(
          { message: 'Internal server error' },
          { status: 500 }
        );
      })
    );

    renderWithProviders(<ProductList />);

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

    renderWithProviders(<ProductList />);

    // Wait for error
    await screen.findByText(/error loading products/i);

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /try again/i });
    retryButton.click();

    // Products should load successfully
    await waitFor(() => {
      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    });
  });

  test('matches snapshot for product grid layout', async () => {
    const { container } = renderWithProviders(<ProductList />);

    // Wait for products to load
    await screen.findByText('iPhone 15');

    // Snapshot of rendered markup
    expect(container).toMatchSnapshot();
  });
});
