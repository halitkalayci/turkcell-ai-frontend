import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryBadge } from '@/components/categories/CategoryBadge';

describe('CategoryBadge', () => {
  it('should render category name', () => {
    const category = { id: '1', name: 'Smartphones' };
    render(<CategoryBadge category={category} />);
    
    expect(screen.getByText('Smartphones')).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    const category = { id: '2', name: 'Laptops' };
    const { container } = render(<CategoryBadge category={category} />);
    
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-800');
    expect(badge).toHaveClass('rounded-full');
  });

  it('should render different category names correctly', () => {
    const category1 = { id: '1', name: 'Electronics' };
    const category2 = { id: '2', name: 'Gaming' };
    
    const { rerender } = render(<CategoryBadge category={category1} />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    
    rerender(<CategoryBadge category={category2} />);
    expect(screen.getByText('Gaming')).toBeInTheDocument();
  });
});
