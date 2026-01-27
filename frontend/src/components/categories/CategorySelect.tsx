import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/types/api/categories.types';

interface CategorySelectProps {
  value: string;
  onChange: (categoryId: string) => void;
  required?: boolean;
  disabled?: boolean;
}

/**
 * CategorySelect - Dropdown for selecting a category
 */
export function CategorySelect({ value, onChange, required = false, disabled = false }: CategorySelectProps) {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <select disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
        <option>Loading categories...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select disabled className="w-full px-3 py-2 border border-red-300 rounded-lg bg-red-50">
        <option>Error loading categories</option>
      </select>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Select a category</option>
      {categories.map((category: Category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
