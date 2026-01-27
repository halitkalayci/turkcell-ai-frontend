import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCardV3 } from '@/components/products/ProductCardV3';
import type { ProductV3 } from '@/types/api/products.v3.types';

const mockProduct: ProductV3 = {
  id: '1',
  sku: 'SKU-TEST',
  name: 'Test Product',
  description: 'Test description',
  price: 999.99,
  currency: 'USD',
  inStock: true,
  imageUrl: 'https://test.com/image.jpg',
  discountPercent: 10.0,
  rating: 4.5,
  category: {
    id: '1',
    name: 'Smartphones',
  },
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

describe('ProductCardV3', () => {
  it('should render product information', () => {
    render(<ProductCardV3 product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('999.99 USD')).toBeInTheDocument();
  });

  it('should render category badge', () => {
    render(<ProductCardV3 product={mockProduct} />);
    
    expect(screen.getByText('Smartphones')).toBeInTheDocument();
  });

  it('should render category badge with correct styles', () => {
    const { container } = render(<ProductCardV3 product={mockProduct} />);
    
    const badge = screen.getByText('Smartphones').closest('span');
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-800');
  });

  it('should display product image', () => {
    render(<ProductCardV3 product={mockProduct} />);
    
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://test.com/image.jpg');
  });

  it('should show discount badge when product has discount', () => {
    render(<ProductCardV3 product={mockProduct} />);
    
    expect(screen.getByText('10% OFF')).toBeInTheDocument();
  });

  it('should not show discount badge when product has no discount', () => {
    const productWithoutDiscount = { ...mockProduct, discountPercent: 0 };
    render(<ProductCardV3 product={productWithoutDiscount} />);
    
    expect(screen.queryByText(/% OFF/)).not.toBeInTheDocument();
  });

  it('should display in stock status', () => {
    render(<ProductCardV3 product={mockProduct} />);
    
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('should display out of stock status', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    render(<ProductCardV3 product={outOfStockProduct} />);
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('should render with different category', () => {
    const productWithDifferentCategory = {
      ...mockProduct,
      category: { id: '2', name: 'Laptops' },
    };
    
    render(<ProductCardV3 product={productWithDifferentCategory} />);
    
    expect(screen.getByText('Laptops')).toBeInTheDocument();
    expect(screen.queryByText('Smartphones')).not.toBeInTheDocument();
  });

  it('should display rating stars', () => {
    const { container } = render(<ProductCardV3 product={mockProduct} />);
    
    // Rating stars are rendered as SVG elements with fill class
    const filledStars = container.querySelectorAll('.text-yellow-400.fill-current');
    // 4.5 rating rounded up = 5 filled stars
    expect(filledStars.length).toBe(5);
  });
});
