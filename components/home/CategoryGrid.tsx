"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCategories } from "@/redux/slices/category-slice";
import {
  Package,
  Box,
  Columns,
  Home,
  PaintBucket,
  Wrench,
  Droplets,
  Zap,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  package: Package,
  box: Box,
  columns: Columns,
  home: Home,
  "paint-bucket": PaintBucket,
  wrench: Wrench,
  droplets: Droplets,
  zap: Zap,
};

export default function CategoryGrid() {
  const dispatch = useAppDispatch();
  const { items: categories, loading } = useAppSelector((s) => s.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  if (loading === "loading") {
    return (
      <section>
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">
          Shop by Category
        </h2>
        <Link
          href="/products"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View All &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Package;
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-card border border-border hover:shadow-card-hover hover:border-primary/20 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-200">
                <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-200" />
              </div>
              <span className="text-xs text-center font-medium text-text-primary leading-tight">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
