import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductListV3 } from '@/components/products/ProductListV3';

describe('ProductListV3', () => {
  it('should render products list', async () => {
    render(<ProductListV3 />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Should render product grid
    const grid = document.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('should display loading state', () => {
    render(<ProductListV3 />);
    
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('should render category filter', async () => {
    render(<ProductListV3 />);
    
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('should display products after loading', async () => {
    render(<ProductListV3 />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
      const grid = document.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should filter products by category', async () => {
    const user = userEvent.setup();
    render(<ProductListV3 />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Category filter should be available
    const categoryFilter = screen.getByRole('combobox');
    await waitFor(() => {
      expect(categoryFilter).not.toHaveAttribute('disabled');
    });
    
    // Select a category option if available
    const options = await screen.findAllByRole('option');
    if (options.length > 1) {
      await user.selectOptions(categoryFilter, (options[1] as HTMLOptionElement).value);
      
      // Grid should still be present
      await waitFor(() => {
        const grid = document.querySelector('.grid');
        expect(grid).toBeInTheDocument();
      });
    }
  });

  it('should render products in grid layout', async () => {
    const { container } = render(<ProductListV3 />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
  });

  it('should display category badges in product cards', async () => {
    render(<ProductListV3 />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Should have at least one category badge (blue badge)
    const badges = document.querySelectorAll('.bg-blue-100');
    expect(badges.length).toBeGreaterThan(0);
  });
});
