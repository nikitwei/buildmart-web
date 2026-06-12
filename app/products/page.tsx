"use client";

import { useEffect, useState, useCallback } from "react";
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
import FilterSidebar from "@/components/filters/FilterSidebar";
import SortToolbar from "@/components/filters/SortToolbar";
import type { SearchFilters } from "@/domain/entities";

const defaultFilters: SearchFilters = {
  query: "",
  sortBy: "relevance",
  page: 1,
  pageSize: 12,
};

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items: categories } = useAppSelector((s) => s.categories);
  const { listing, loading } = useAppSelector((s) => s.products);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    dispatch(
      fetchProductsByCategory({ categorySlug: "cement-mortar", filters }),
    );
  }, [dispatch, filters]);

  const handleFilterChange = useCallback(
    (partial: Partial<SearchFilters>) => {
      setFilters((f) => ({ ...f, ...partial, page: 1 }));
    },
    [],
  );

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleSortChange = useCallback(
    (sortBy: SearchFilters["sortBy"]) => {
      setFilters((f) => ({ ...f, sortBy }));
    },
    [],
  );

  const allBrands = [
    "Semen Indonesia",
    "Holcim",
    "BrickMaster",
    "ConBlock",
    "Hebel Indonesia",
    "KayuKita",
    "SPANdeck",
    "TileMaster",
    "Catylac",
    "Dulux",
    "Makita",
    "Stanley",
    "Bosch",
    "PipaMax",
    "Ariston",
    "Kabelindo",
    "Philips",
  ];

  return (
    <>
      <Header />
      <CategoryNav />
      <main className="flex-1">
        <div className="max-w-[var(--max-width-site,1200px)] mx-auto px-4 py-6">
          <Breadcrumbs items={[{ label: "All Products" }]} />

          <div className="flex gap-6 mt-4">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              allBrands={allBrands}
            />

            <div className="flex-1 min-w-0">
              <SortToolbar
                total={listing.total}
                sortBy={filters.sortBy}
                onSortChange={handleSortChange}
                onMobileFilterOpen={() => setMobileFilterOpen(true)}
              />

              <div className="mt-4">
                <ProductGrid
                  products={listing.products}
                  loading={loading === "loading"}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
      <ToastContainer />

      {mobileFilterOpen && (
        <FilterSidebar
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          allBrands={allBrands}
          mobile
          onClose={() => setMobileFilterOpen(false)}
        />
      )}
    </>
  );
}
