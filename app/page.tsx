"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBestSellers, fetchNewArrivals } from "@/redux/slices/product-slice";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import ToastContainer from "@/components/ui/Toast";
import HeroBanner from "@/components/home/HeroBanner";
import QuickActions from "@/components/home/QuickActions";
import CategoryGrid from "@/components/home/CategoryGrid";
import TrustBadges from "@/components/home/TrustBadges";
import ProductGrid from "@/components/product/ProductGrid";
import type { HeroBanner as HeroBannerType } from "@/domain/entities";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { bestSellers, newArrivals, loading } = useAppSelector(
    (s) => s.products,
  );

  useEffect(() => {
    dispatch(fetchBestSellers(8));
    dispatch(fetchNewArrivals(8));
  }, [dispatch]);

  // Inline banners since they rarely change for a static JSON app
  const banners: HeroBannerType[] = [
    {
      id: "banner-1",
      title: "Renovation Sale",
      subtitle: "Up to 40% off on paint & coatings",
      image:
        "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1200&h=400&fit=crop",
      link: "/products",
      cta: "Shop Now",
    },
    {
      id: "banner-2",
      title: "New Power Tools",
      subtitle: "Professional-grade tools for every job",
      image:
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1200&h=400&fit=crop",
      link: "/categories/tools-hardware",
      cta: "Explore",
    },
    {
      id: "banner-3",
      title: "Bulk Purchase Deals",
      subtitle: "Extra discounts on orders above Rp 5.000.000",
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb52b8e5b?w=1200&h=400&fit=crop",
      link: "/products",
      cta: "Get Quote",
    },
  ];

  return (
    <>
      <Header />
      <CategoryNav />
      <main className="flex-1">
        <div className="max-w-[var(--max-width-site,1200px)] mx-auto px-4 py-6 space-y-8">
          <HeroBanner banners={banners} />
          <QuickActions />
          <CategoryGrid />
          <ProductGrid
            title="Best Sellers"
            products={bestSellers}
            loading={loading === "loading"}
          />
          <ProductGrid
            title="New Arrivals"
            products={newArrivals}
            loading={loading === "loading"}
          />
          <TrustBadges />
        </div>
      </main>
      <Footer />
      <MobileNav />
      <ToastContainer />
    </>
  );
}
