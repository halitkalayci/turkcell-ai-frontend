/**
 * ProductsPage Component
 * UI Layer - Page component for product listing
 * 
 * Responsibilities:
 * - Render page layout (header, main content)
 * - Compose ProductList component
 * - Provide page-level UI elements
 * 
 * NO service calls allowed (use components/hooks only).
 * NO API calls allowed.
 * NO business logic.
 */

import { ProductList } from '@/components/products';

/**
 * ProductsPage displays the products listing page
 * 
 * Layout structure:
 * - Page header with title
 * - Main content area with ProductList
 * 
 * @example
 * ```tsx
 * <Route path="/products" element={<ProductsPage />} />
 * ```
 */
export function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="mt-1 text-sm text-gray-600">
                Browse our collection of products
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductList />
      </main>
    </div>
  );
}
