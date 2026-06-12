"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cart-slice";
import { addToast } from "@/redux/slices/ui-slice";
import type { Product } from "@/domain/entities";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const discounted = !!product.originalPrice;
  const outOfStock = product.stock === 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock) return;

    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: 1,
        maxStock: product.stock,
        unit: product.unit,
      }),
    );

    dispatch(
      addToast({
        type: "success",
        message: `${product.name} added to cart`,
      }),
    );
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-bg-card border border-border rounded-lg overflow-hidden hover:shadow-card-hover transition-shadow duration-200 flex flex-col"
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <Badge variant="new">NEW</Badge>}
          {discounted && <Badge variant="sale">SALE</Badge>}
          {product.isBestSeller && <Badge variant="best">BEST SELLER</Badge>}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-error text-white px-3 py-1 rounded text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-1.5">
        <span className="text-xs text-text-secondary uppercase tracking-wide">
          {product.brand}
        </span>
        <h3 className="text-sm font-medium text-text-primary line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg font-bold text-text-primary">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
          {discounted && (
            <span className="text-xs text-text-secondary line-through">
              Rp {product.originalPrice!.toLocaleString("id-ID")}
            </span>
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="mt-2 w-full"
        >
          <ShoppingCart className="h-4 w-4" />
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </Link>
  );
}
