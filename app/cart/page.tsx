"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import ToastContainer from "@/components/ui/Toast";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";

export default function CartPage() {
  const { items } = useAppSelector((s) => s.cart);

  return (
    <>
      <Header />
      <CategoryNav />
      <main className="flex-1">
        <div className="max-w-[var(--max-width-site,1200px)] mx-auto px-4 py-6">
          <Breadcrumbs items={[{ label: "Shopping Cart" }]} />

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="h-16 w-16 text-border mb-4" />
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Your Cart is Empty
              </h1>
              <p className="text-text-secondary mb-6">
                Looks like you haven&apos;t added any items yet.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-text-primary mb-6">
                Shopping Cart ({items.length}{" "}
                {items.length === 1 ? "item" : "items"})
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-bg-card border border-border rounded-lg p-4">
                  {items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </div>

                <div>
                  <OrderSummary />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
      <ToastContainer />
    </>
  );
}
