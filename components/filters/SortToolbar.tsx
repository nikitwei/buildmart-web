"use client";

import { SlidersHorizontal } from "lucide-react";
import type { SearchFilters } from "@/domain/entities";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
] as const;

interface SortToolbarProps {
  total: number;
  sortBy: SearchFilters["sortBy"];
  onSortChange: (sort: SearchFilters["sortBy"]) => void;
  onMobileFilterOpen: () => void;
}

export default function SortToolbar({
  total,
  sortBy,
  onSortChange,
  onMobileFilterOpen,
}: SortToolbarProps) {
  return (
    <div className="flex items-center justify-between bg-bg-card border border-border rounded-lg px-4 py-3">
      <p className="text-sm text-text-secondary">
        <span className="font-semibold text-text-primary">{total}</span>{" "}
        {total === 1 ? "product" : "products"} found
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={onMobileFilterOpen}
          className="flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-primary lg:hidden transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        <select
          value={sortBy}
          onChange={(e) =>
            onSortChange(e.target.value as SearchFilters["sortBy"])
          }
          className="text-sm border border-border rounded-md px-3 py-1.5 bg-bg-card focus:outline-none focus:border-primary"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
