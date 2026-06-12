"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, ChevronDown, Package, Phone, Menu } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleMobileMenu } from "@/redux/slices/ui-slice";

export default function Header() {
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  useEffect(() => setMounted(true), []);

  return (
    <header className="bg-primary sticky top-0 z-50">
      {/* Mini Top Header */}
      <div className="hidden md:block bg-primary-hover border-b border-white/10">
        <div className="max-w-[var(--max-width-site,1200px)] mx-auto px-4 flex items-center justify-between h-8">
          <div className="flex items-center gap-1.5 text-white/60 text-xs hover:text-white transition-colors cursor-pointer">
            <Phone className="h-3.5 w-3.5" />
            <span>Download BuildMart App</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-white/60 hover:text-white text-xs transition-colors">About BuildMart</Link>
            <Link href="#" className="text-white/60 hover:text-white text-xs transition-colors">Promos</Link>
            <Link href="#" className="text-white/60 hover:text-white text-xs transition-colors">BuildMart Care</Link>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-[var(--max-width-site,1200px)] mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 text-white flex-shrink-0">
            <Package className="h-7 w-7" />
            <span className="text-xl font-bold tracking-tight">BuildMart</span>
          </Link>

          {/* Category Dropdown + Search (desktop) */}
          <div className="hidden md:flex items-center gap-3 flex-1">
            <div className="flex items-center gap-1 text-white/70 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex-shrink-0">
              <span className="text-sm font-medium">Categories</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <SearchBar />
          </div>

          {/* Right Actions */}
          <nav className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/cart"
              className="relative p-2 text-white/90 hover:text-white transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center gap-2 ml-2 pl-3 border-l border-white/20">
              <Link
                href="#"
                className="text-sm font-medium text-white border border-white/30 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-primary bg-white px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors"
              >
                Register
              </Link>
            </div>

            <button
              className="p-2 text-white/90 hover:text-white transition-colors md:hidden"
              aria-label="Menu"
              onClick={() => dispatch(toggleMobileMenu())}
            >
              <Menu className="h-6 w-6" />
            </button>
          </nav>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
