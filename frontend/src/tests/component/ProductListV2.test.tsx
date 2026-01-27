import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { ProductListV2 } from '@/components/products/ProductListV2';

describe('ProductListV2 (v2)', () => {
  test('renders v2 products from MSW', async () => {
    renderWithProviders(<ProductListV2 />);
    // Wait for a v2 product name
    expect(await screen.findByText('iPhone 15')).toBeInTheDocument();
    // Ensure rating or image-dependent data is not directly asserted (UI-semantic queries only)
    expect(await screen.findByText('Pixel 9')).toBeInTheDocument();
    // Pagination text should reflect totals (match full textContent)
    const matches = screen.getAllByText((_, el) => !!el && /of\s+\d+\s+products/i.test(el.textContent || ''));
    expect(matches.length).toBeGreaterThan(0);
  });
});
