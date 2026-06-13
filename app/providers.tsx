"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/redux/store";
import { setCartItems } from "@/redux/slices/cart-slice";
import type { CartItem } from "@/domain/entities";

export default function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const store = storeRef.current;
    if (!store) return;

    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        const items = JSON.parse(raw) as CartItem[];
        if (Array.isArray(items)) {
          store.dispatch(setCartItems(items));
        }
      }
    } catch {
      // corrupt data — ignore
    }

    const unsubscribe = store.subscribe(() => {
      const { items } = store.getState().cart;
      localStorage.setItem("cart", JSON.stringify(items));
    });

    return () => unsubscribe();
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
