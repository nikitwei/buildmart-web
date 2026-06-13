"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import QuantitySelector from "@/components/ui/QuantitySelector";
import Badge from "@/components/ui/Badge";
import { useAppDispatch } from "@/redux/hooks";
import {
  removeFromCart,
  updateQuantity,
} from "@/redux/slices/cart-slice";
import type { CartItem as CartItemType } from "@/domain/entities";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();

  const stockStatus =
    item.maxStock > 50 ? (
      <Badge variant="eco">In Stock</Badge>
    ) : item.maxStock > 10 ? (
      <Badge variant="low-stock">Low Stock</Badge>
    ) : item.maxStock > 0 ? (
      <Badge variant="low-stock">Only {item.maxStock} left</Badge>
    ) : (
      <Badge variant="out-of-stock">Out of Stock</Badge>
    );

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      <Link
        href={`/products/${item.productId}`}
        className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/products/${item.productId}`}
              className="text-sm font-medium text-text-primary hover:text-primary line-clamp-2 transition-colors"
            >
              {item.name}
            </Link>
            <p className="text-xs text-text-secondary mt-0.5">{item.unit}</p>
          </div>
          <span className="text-sm font-bold text-text-primary whitespace-nowrap">
            Rp {item.price.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="mt-2">{stockStatus}</div>

        <div className="flex items-center justify-between mt-3">
          <QuantitySelector
            value={item.quantity}
            min={1}
            max={item.maxStock}
            onChange={(qty) =>
              dispatch(
                updateQuantity({ productId: item.productId, quantity: qty }),
              )
            }
            size="sm"
          />

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-text-primary">
              Rp{" "}
              {(item.price * item.quantity).toLocaleString("id-ID")}
            </span>
            <button
              onClick={() => dispatch(removeFromCart(item.productId))}
              className="p-1.5 text-text-secondary hover:text-error hover:bg-red-50 rounded transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
