import { useState, useEffect } from 'react';
import { productsV3Service } from '@/services/products.v3.service';
import type { ListProductsV3Params } from '@/api/products.v3.api';
import type { ProductV3, ProductPageResponseV3 } from '@/types/api/products.v3.types';

interface UseProductsV3Options {
  page?: number;
  size?: number;
  sort?: string;
  query?: string;
  categoryId?: string;
}

interface UseProductsV3State {
  products: ProductV3[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

/**
 * Hook for managing product V3 list state with pagination and filtering
 */
export function useProductsV3(options: UseProductsV3Options = {}): UseProductsV3State {
  const [products, setProducts] = useState<ProductV3[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(options.page || 0);

  const pageSize = options.size ?? 10;
  const sortParam = options.sort;
  const queryParam = options.query;
  const categoryIdParam = options.categoryId;

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: ListProductsV3Params = {
          page: currentPage,
          size: pageSize,
        };

        if (sortParam) params.sort = sortParam;
        if (queryParam) params.q = queryParam;
        if (categoryIdParam) params.categoryId = categoryIdParam;

        const data: ProductPageResponseV3 = await productsV3Service.getAllProducts(params);

        if (isMounted) {
          setProducts(data.items);
          setPage(data.page);
          setSize(data.size);
          setTotalElements(data.totalElements);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch products');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, sortParam, queryParam, categoryIdParam, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    products,
    page,
    size,
    totalElements,
    totalPages,
    loading,
    error,
    refetch,
    goToPage,
    nextPage,
    prevPage,
  };
}
