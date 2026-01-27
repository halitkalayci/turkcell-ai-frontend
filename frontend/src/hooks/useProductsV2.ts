/**
 * Products Hook (v2)
 * State Layer - Product v2 state management
 * 
 * Responsibilities:
 * - Manages React state (loading, error, data)
 * - Fetches products via v2 service layer
 * - Provides refetch capability
 * - Transforms API response to UI-friendly structure
 * 
 * NO direct API calls allowed (must use service layer).
 * NO business logic beyond state management and response destructuring.
 */

import { useState, useEffect } from 'react';
import { productV2Service } from '@/services/products.v2.service';
import type { ProductV2, ProductPageResponseV2 } from '@/types/api';
import type { GetProductsV2Options } from '@/services/products.v2.service';
import type { PaginationInfo } from '@/types/common';
import { transformErrorMessage } from '@/utils/error-handlers';

/**
 * Hook return type (v2)
 */
export interface UseProductsV2Return {
  /** Array of products (v2) */
  products: ProductV2[];
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
 * Custom hook for fetching and managing product list state (v2)
 * 
 * @param options - Query options (page, size, sort, search)
 * @returns Product list state and control functions
 * 
 * @example
 * ```tsx
 * const { products, loading, error, refetch } = useProductsV2({ page: 0, size: 10 });
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>{error}</div>;
 * return <div>{products.map(p => <ProductCardV2 key={p.id} product={p} />)}</div>;
 * ```
 */
export function useProductsV2(options?: GetProductsV2Options): UseProductsV2Return {
  const [products, setProducts] = useState<ProductV2[]>([]);
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

        const response: ProductPageResponseV2 = await productV2Service.getAllProductsV2({
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
  }, [currentPage, options?.size, options?.sort, options?.q, refetchTrigger]);

  // Sync currentPage when options.page changes
  useEffect(() => {
    if (options?.page !== undefined && options.page !== currentPage) {
      setCurrentPage(options.page);
    }
  }, [options?.page]);

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
