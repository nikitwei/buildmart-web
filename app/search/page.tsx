"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setQuery,
  fetchSearchResults,
  setFilters,
} from "@/redux/slices/search-slice";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import ToastContainer from "@/components/ui/Toast";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductGrid from "@/components/product/ProductGrid";

function SearchContent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { query, results, totalResults, loading } = useAppSelector(
    (s) => s.search,
  );

  const q = searchParams.get("q") || "";

  useEffect(() => {
    if (q && q !== query) {
      dispatch(setQuery(q));
      dispatch(
        fetchSearchResults({
          query: q,
          sortBy: "relevance",
          page: 1,
          pageSize: 12,
        }),
      );
    }
  }, [q, query, dispatch]);

  return (
    <>
      <Header />
      <CategoryNav />
      <main className="flex-1">
        <div className="max-w-[var(--max-width-site,1200px)] mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: "Search" },
              ...(q ? [{ label: `"${q}"` }] : []),
            ]}
          />

          {q && (
            <p className="text-sm text-text-secondary mb-6">
              <span className="font-semibold text-text-primary">
                {totalResults}
              </span>{" "}
              {totalResults === 1 ? "result" : "results"} for &quot;{q}&quot;
            </p>
          )}

          {!q ? (
            <div className="text-center py-20">
              <p className="text-text-secondary">
                Enter a search term to find products.
              </p>
            </div>
          ) : (
            <ProductGrid
              products={results}
              loading={loading === "loading"}
            />
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
      <ToastContainer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
