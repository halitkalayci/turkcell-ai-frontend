import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useProductsV3 } from '@/hooks/useProductsV3';

describe('useProductsV3', () => {
  it('should fetch all products without filters', async () => {
    const { result } = renderHook(() => useProductsV3({}));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.products.length).toBeGreaterThan(0);
    expect(result.current.products[0]).toHaveProperty('category');
    expect(result.current.error).toBeNull();
  });

  it('should fetch products with pagination params', async () => {
    const { result } = renderHook(() => useProductsV3({ page: 0, size: 2 }));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.page).toBe(0);
    expect(result.current.size).toBe(2);
  });

  it('should filter products by categoryId', async () => {
    const { result } = renderHook(() => useProductsV3({ categoryId: '1' }));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    const filteredProducts = result.current.products.filter(p => p.category.id === '1');
    expect(filteredProducts).toHaveLength(2);
    expect(filteredProducts.every(p => p.category.id === '1')).toBe(true);
  });

  it('should refetch products when refetchTrigger changes', async () => {
    const { result, rerender } = renderHook(() => useProductsV3({}));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    const initialProductsCount = result.current.products.length;
    expect(initialProductsCount).toBeGreaterThan(0);
    
    // Trigger refetch
    act(() => {
      result.current.refetch();
    });
    
    rerender();
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.products.length).toBe(initialProductsCount);
  });

  it('should return products with category reference', async () => {
    const { result } = renderHook(() => useProductsV3({}));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.products[0]).toHaveProperty('category');
    expect(result.current.products[0].category).toHaveProperty('id');
    expect(result.current.products[0].category).toHaveProperty('name');
  });

  it('should update products when options change', async () => {
    const { result, rerender } = renderHook(
      ({ categoryId }) => useProductsV3({ categoryId }),
      { initialProps: { categoryId: '1' } }
    );
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    const smartphoneProducts = result.current.products.filter(p => p.category.id === '1');
    expect(smartphoneProducts).toHaveLength(2);
    
    // Change categoryId
    rerender({ categoryId: '2' });
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    const laptopProducts = result.current.products.filter(p => p.category.id === '2');
    expect(laptopProducts).toHaveLength(1);
  });
});
