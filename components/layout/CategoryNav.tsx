"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCategories } from "@/redux/slices/category-slice";

export default function CategoryNav() {
  const dispatch = useAppDispatch();
  const { items: categories, loading } = useAppSelector((s) => s.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  if (loading === "loading" || categories.length === 0) {
    return (
      <div className="bg-white border-b border-border">
        <div className="max-w-[var(--max-width-site,1200px)] mx-auto px-4 h-12 flex items-center gap-6 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav className="bg-white border-b border-border">
      <div className="max-w-[var(--max-width-site,1200px)] mx-auto px-4">
        <ul className="flex items-center gap-1 h-12 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/categories/${cat.slug}`}
                className="px-3 py-1.5 text-sm text-text-primary hover:text-primary hover:bg-primary-light rounded-md transition-colors whitespace-nowrap font-medium"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
