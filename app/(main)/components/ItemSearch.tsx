'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type category = {
  name: string;
  id: string;
};
type subcategories = {
  name: string;
  id: string;
  category_id: string;
};
type Props = {
  categories: category[];
  subcategories: subcategories[];
};

export default function ItemSearch({ categories, subcategories }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const [inputValue, setInputValue] = useState(searchParams.get('query') ?? '');

  // Update URL when user types in search box (with 300ms delay)
  useEffect(() => {
    const currentQuery = searchParams.get('query') ?? '';
    if (inputValue === currentQuery) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (inputValue) {
        params.set('query', inputValue);
      } else {
        params.delete('query');
      }
      router.replace(`${pathName}?${params.toString()}`);
    }, 300);
    return () => clearTimeout(timeout);
  }, [inputValue, pathName, router, searchParams]);

  // Function to update URL when dropdowns change
  function handleCategoryChange(categoryId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    // Clear subcategory when category changes
    params.delete('subcategory');
    router.replace(`${pathName}?${params.toString()}`);
  }

  function handleSubcategoryChange(subcategoryId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (subcategoryId) {
      params.set('subcategory', subcategoryId);
    } else {
      params.delete('subcategory');
    }
    router.replace(`${pathName}?${params.toString()}`);
  }

  // Clear all filters and reset to base path
  function handleClearFilters() {
    setInputValue('');
    router.replace(pathName);
  }

  // Get the currently selected category
  // Updates on re-render due to url change
  const selectedCategoryId = searchParams.get('category');

  // Filter subcategories to only show ones matching the selected category
  const filteredSubcategories = selectedCategoryId
    ? subcategories.filter(
        (subcategory) => String(subcategory.category_id) === selectedCategoryId,
      )
    : subcategories;

  return (
    <div className="search-filter-wrapper">
      {/* Search input */}
      <input
        className="search-filter-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search items..."
        aria-label="Search items"
      />

      <div className="search-filter-row">
        {/* Category dropdown */}
        <select
          className="search-filter-select"
          value={searchParams.get('category') ?? ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Subcategory dropdown */}
        <select
          className="search-filter-select"
          value={searchParams.get('subcategory') ?? ''}
          onChange={(e) => handleSubcategoryChange(e.target.value)}
          aria-label="Filter by subcategory"
        >
          <option value="">All Subcategories</option>
          {filteredSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>

        {/* Clear button */}
        <button
          type="button"
          className="search-filter-clear"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
