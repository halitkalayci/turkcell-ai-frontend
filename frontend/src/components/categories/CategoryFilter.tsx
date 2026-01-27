import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/types/api/categories.types';

interface CategoryFilterProps {
  value: string;
  onChange: (categoryId: string) => void;
}

/**
 * CategoryFilter - Dropdown for filtering products by category
 */
export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <select disabled className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
        <option>Loading...</option>
      </select>
    );
  }

  if (error) {
    return null;
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">All Categories</option>
      {categories.map((category: Category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
