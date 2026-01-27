/**
 * ProductsPageV2
 * UI Layer - Page component for v2 product listing
 * 
 * Responsibilities:
 * - Render page layout with header and content
 * - Display ProductListV2 component
 * 
 * NO service calls allowed (pages delegate to components).
 * NO API calls allowed.
 * NO business logic.
 */

import { ProductListV2 } from '@/components/products';

/**
 * ProductsPageV2 displays the v2 products listing page
 * Uses v2 API with imageUrl, discountPercent, and rating fields
 * 
 * @example
 * ```tsx
 * <ProductsPageV2 />
 * ```
 */
export function ProductsPageV2() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Products
              </h1>
              <p className="mt-1 text-xs text-gray-600">
                Browse our collection of products
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductListV2 />
      </main>
    </div>
  );
}
