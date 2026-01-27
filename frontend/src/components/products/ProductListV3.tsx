import { useState } from 'react';
import { useProductsV3 } from '@/hooks/useProductsV3';
import { ProductCardV3 } from './ProductCardV3';
import { CategoryFilter } from '@/components/categories/CategoryFilter';
import type { ProductV3 } from '@/types/api/products.v3.types';

/**
 * ProductListV3 - Displays paginated list of products (v3) with category filter
 */
export function ProductListV3() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  
  const { products, loading, error, page, totalPages } = useProductsV3({
    page: 0,
    size: 12,
    categoryId: selectedCategoryId || undefined,
  });

  const handleAddToCart = (product: ProductV3) => {
    console.log('Add to cart:', product);
    // TODO: Implement cart functionality
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Category Filter */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Products (V3)</h2>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
          <CategoryFilter value={selectedCategoryId} onChange={setSelectedCategoryId} />
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCardV3 key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>

          {/* Pagination Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Page {page + 1} of {totalPages}
          </div>
        </>
      )}
    </div>
  );
}
