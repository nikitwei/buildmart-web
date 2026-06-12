"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, User } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Categories", href: "/products", icon: Package },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Account", href: "#", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 sm:hidden">
      <ul className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`relative flex flex-col items-center gap-0.5 px-4 py-1 text-xs transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.href === "/cart" && mounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 right-1 bg-secondary text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
