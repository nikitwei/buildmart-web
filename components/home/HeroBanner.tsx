"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroBanner as HeroBannerType } from "@/domain/entities";

interface HeroBannerProps {
  banners: HeroBannerType[];
  loading?: boolean;
}

export default function HeroBanner({ banners, loading }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading || banners.length === 0) {
    return (
      <div className="w-full h-[200px] md:h-[320px] bg-gray-200 rounded-xl animate-pulse" />
    );
  }

  const banner = banners[current];

  return (
    <div className="relative w-full h-[200px] md:h-[320px] rounded-xl overflow-hidden group">
      <img
        src={banner.image}
        alt={banner.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
        <div className="px-8 md:px-12">
          <h2 className="text-white text-2xl md:text-4xl font-bold mb-2">
            {banner.title}
          </h2>
          <p className="text-white/80 text-sm md:text-base mb-4 max-width-auto">
            {banner.subtitle}
          </p>
          <Link
            href={banner.link}
            className="inline-block bg-secondary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary-hover transition-colors"
          >
            {banner.cta}
          </Link>
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-5 w-5 text-text-primary" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next banner"
          >
            <ChevronRight className="h-5 w-5 text-text-primary" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === current ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
