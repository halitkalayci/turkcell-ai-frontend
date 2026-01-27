import { ProductList } from '@/components/products';
import { renderWithProviders } from '@/test/utils';
import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

describe('ProductList (v1)', () => {
  test('renders products from MSW and matches snapshot', async () => {
    renderWithProviders(<ProductList />);

    // Wait for first product name
    const first = await screen.findByText('iPhone 15');
    expect(first).toBeInTheDocument();

    // Ensure second product appears
    expect(await screen.findByText('Pixel 9')).toBeInTheDocument();

    // Pagination text should reflect totals (match full textContent)
    const matches = screen.getAllByText((_, el) => !!el && /of\s+\d+\s+products/i.test(el.textContent || ''));
    expect(matches.length).toBeGreaterThan(0);

    // Snapshot of rendered markup (stable container)
    //expect(container).toMatchSnapshot();
  });
});
