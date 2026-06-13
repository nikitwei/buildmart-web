"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCategories } from "@/redux/slices/category-slice";
import { fetchProductsByCategory } from "@/redux/slices/product-slice";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import ToastContainer from "@/components/ui/Toast";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductGrid from "@/components/product/ProductGrid";
import type { SearchFilters } from "@/domain/entities";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useAppDispatch();
  const { items: categories } = useAppSelector((s) => s.categories);
  const { listing, loading } = useAppSelector((s) => s.products);

  const category = categories.find((c) => c.slug === slug);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    const filters: SearchFilters = {
      query: "",
      sortBy: "relevance",
      page: 1,
      pageSize: 20,
    };
    dispatch(fetchProductsByCategory({ categorySlug: slug, filters }));
  }, [dispatch, slug]);

  return (
    <>
      <Header />
      <CategoryNav />
      <main className="flex-1">
        <div className="max-w-[var(--max-width-site,1200px)] mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              ...(category ? [{ label: category.name }] : []),
            ]}
          />

          {category && (
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  {category.name}
                </h1>
                <p className="text-sm text-text-secondary">
                  {category.productCount} products
                </p>
              </div>
            </div>
          )}

          <ProductGrid
            products={listing.products}
            loading={loading === "loading"}
          />
        </div>
      </main>
      <Footer />
      <MobileNav />
      <ToastContainer />
    </>
  );
}
