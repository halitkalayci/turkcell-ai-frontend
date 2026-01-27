import type { CategoryRef } from '@/types/api/products.v3.types';

interface CategoryBadgeProps {
  category: CategoryRef;
}

/**
 * CategoryBadge - Displays category name as a badge
 */
export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
      {category.name}
    </span>
  );
}
