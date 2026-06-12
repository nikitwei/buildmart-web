"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Category, SearchFilters } from "@/domain/entities";

interface FilterSidebarProps {
  categories: Category[];
  filters: SearchFilters;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onReset: () => void;
  mobile?: boolean;
  onClose?: () => void;
  allBrands: string[];
}

export default function FilterSidebar({
  categories,
  filters,
  onFilterChange,
  onReset,
  mobile,
  onClose,
  allBrands,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.categoryId ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.brand ||
    filters.minRating !== undefined;

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-secondary hover:underline font-medium"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-2">
          Category
        </h4>
        <div className="space-y-1">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 py-1 cursor-pointer hover:text-primary transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.categoryId === cat.id}
                onChange={() =>
                  onFilterChange({
                    categoryId: filters.categoryId === cat.id ? undefined : cat.id,
                  })
                }
                className="accent-primary rounded border-border h-4 w-4"
              />
              <span className="text-sm text-text-primary">{cat.name}</span>
              <span className="text-xs text-text-secondary ml-auto">
                ({cat.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-2">
          Price Range
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              onFilterChange({
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
          />
          <span className="text-text-secondary">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onFilterChange({
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Brand */}
      {allBrands.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-2">
            Brand
          </h4>
          <div className="space-y-1">
            {allBrands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 py-1 cursor-pointer hover:text-primary transition-colors"
              >
                <input
                  type="radio"
                  name="brand"
                  checked={filters.brand === brand}
                  onChange={() =>
                    onFilterChange({
                      brand: filters.brand === brand ? undefined : brand,
                    })
                  }
                  className="accent-primary border-border h-4 w-4"
                />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-2">
          Minimum Rating
        </h4>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 py-1 cursor-pointer hover:text-primary transition-colors"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() =>
                  onFilterChange({
                    minRating:
                      filters.minRating === rating ? undefined : rating,
                  })
                }
                className="accent-primary border-border h-4 w-4"
              />
              <div className="flex items-center gap-0.5">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-warning text-warning"
                  />
                ))}
              </div>
              <span className="text-xs text-text-secondary">& up</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  if (mobile) {
    return (
      <div className="fixed inset-0 z-50 flex">
        <div
          className="absolute inset-0 bg-black/30"
          onClick={onClose}
        />
        <div className="relative w-80 max-w-[85vw] bg-bg-card h-full overflow-y-auto p-6 shadow-modal">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
          {content}
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="bg-bg-card border border-border rounded-lg p-5 sticky top-20">
        {content}
      </div>
    </aside>
  );
}
