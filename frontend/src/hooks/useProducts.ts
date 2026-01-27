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
import type { PaginationInfo } from '@/types/common';
import { transformErrorMessage } from '@/utils/error-handlers';

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
  /** Go to specific page (0-indexed) */
  goToPage: (page: number) => void;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  prevPage: () => void;
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
  const [currentPage, setCurrentPage] = useState<number>(options?.page || 0);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ProductPageResponse = await productService.getAllProducts({
          ...options,
          page: currentPage,
        });

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
          // Transform technical errors to user-friendly messages using utility
          setError(transformErrorMessage(err, 'products'));
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

  /**
   * Go to specific page (0-indexed)
   */
  const goToPage = (page: number) => {
    if (page >= 0 && (!pagination || page < pagination.totalPages)) {
      setCurrentPage(page);
    }
  };

  /**
   * Go to next page
   */
  const nextPage = () => {
    if (pagination && currentPage < pagination.totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  /**
   * Go to previous page
   */
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    products,
    pagination,
    loading,
    error,
    refetch,
    goToPage,
    nextPage,
    prevPage,
  };
}
