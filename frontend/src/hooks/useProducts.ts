/**
 * Products Hook
 * State Layer - Product state management
 * 
 * Responsibilities:
 * - Manages React state (loading, error, data)
 * - Fetches products via service layer
 * - Provides refetch capability
 * - Transforms API response to UI-friendly structure
 * 
 * NO direct API calls allowed (must use service layer).
 * NO business logic beyond state management and response destructuring.
 */

import { useState, useEffect } from 'react';
import { productService } from '@/services/products.service';
import type { Product, ProductPageResponse } from '@/types/api';
import type { GetProductsOptions } from '@/services/products.service';

/**
 * Pagination metadata
 */
export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Hook return type
 */
export interface UseProductsReturn {
  /** Array of products */
  products: Product[];
  /** Pagination information (null during initial load) */
  pagination: PaginationInfo | null;
  /** Loading state */
  loading: boolean;
  /** User-friendly error message (null if no error) */
  error: string | null;
  /** Manually trigger refetch */
  refetch: () => void;
}

/**
 * Custom hook for fetching and managing product list state
 * 
 * @param options - Query options (page, size, sort, search)
 * @returns Product list state and control functions
 * 
 * @example
 * ```tsx
 * const { products, loading, error, refetch } = useProducts({ page: 0, size: 10 });
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>{error}</div>;
 * return <div>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>;
 * ```
 */
export function useProducts(options?: GetProductsOptions): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ProductPageResponse = await productService.getAllProducts(options);

        // Only update state if component is still mounted
        if (isMounted) {
          setProducts(response.items);
          setPagination({
            page: response.page,
            size: response.size,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
          });
        }
      } catch (err) {
        if (isMounted) {
          // Transform technical errors to user-friendly messages
          if (err instanceof Error) {
            if (err.message.includes('Network error')) {
              setError('Unable to connect to server. Please check your connection.');
            } else if (err.message.includes('404')) {
              setError('Products not found. Please try again later.');
            } else if (err.message.includes('500')) {
              setError('Server error. Please contact support.');
            } else {
              setError('Failed to load products. Please try again.');
            }
          } else {
            setError('An unexpected error occurred.');
          }
          // Clear data on error
          setProducts([]);
          setPagination(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [options?.page, options?.size, options?.sort, options?.q, refetchTrigger]);

  /**
   * Manually trigger a refetch of products
   */
  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return {
    products,
    pagination,
    loading,
    error,
    refetch,
  };
}
