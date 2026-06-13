"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, ShieldCheck, RotateCcw, Truck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProductById } from "@/redux/slices/product-slice";
import { fetchCategories } from "@/redux/slices/category-slice";
import { addToCart } from "@/redux/slices/cart-slice";
import { addToast } from "@/redux/slices/ui-slice";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import ToastContainer from "@/components/ui/Toast";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { currentProduct: product, loading } = useAppSelector(
    (s) => s.products,
  );
  const { items: categories } = useAppSelector((s) => s.categories);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, id, categories.length]);

  if (!product) {
    return (
      <>
        <Header />
        <CategoryNav />
        <main className="flex-1">
          <div className="max-w-[var(--max-width-site,1200px)] mx-auto px-4 py-6">
            <div className="animate-pulse space-y-6">
              <div className="h-4 w-64 bg-gray-200 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-200 rounded-lg" />
                <div className="space-y-4">
                  <div className="h-8 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="h-6 w-1/4 bg-gray-200 rounded" />
                  <div className="h-10 w-full bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </>
    );
  }

  const productData = product!;

  const categoryName =
    categories.find((c) => c.id === productData.categoryId)?.name ?? "Products";

  function handleAddToCart() {
    dispatch(
      addToCart({
        productId: productData.id,
        name: productData.name,
        image: productData.images[0],
        price: productData.price,
        quantity,
        maxStock: productData.stock,
        unit: productData.unit,
      }),
    );
    dispatch(
      addToast({
        type: "success",
        message: `${productData.name} added to cart`,
      }),
    );
  }

  return (
    <>
      <Header />
      <CategoryNav />
      <main className="flex-1">
        <div className="max-w-[var(--max-width-site,1200px)] mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: categoryName, href: `/categories/${categories.find((c) => c.id === productData.categoryId)?.slug ?? productData.categoryId}` },
              { label: productData.name },
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {/* Images */}
            <div>
              <div className="aspect-square bg-white border border-border rounded-lg overflow-hidden">
                <img
                  src={productData.images[0]}
                  alt={productData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary uppercase tracking-wide">
                  {productData.brand}
                </span>
                <span className="text-xs text-text-secondary">|</span>
                <span className="text-xs text-text-secondary">
                  SKU: {productData.sku}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-text-primary">
                {productData.name}
              </h1>

              <StarRating
                rating={productData.rating}
                reviewCount={productData.reviewCount}
              />

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-text-primary">
                  Rp {productData.price.toLocaleString("id-ID")}
                </span>
                {productData.originalPrice && (
                  <>
                    <span className="text-lg text-text-secondary line-through">
                      Rp {productData.originalPrice.toLocaleString("id-ID")}
                    </span>
                    <Badge variant="sale">
                      -
                      {Math.round(
                        ((productData.originalPrice - productData.price) /
                          productData.originalPrice) *
                          100,
                      )}
                      %
                    </Badge>
                  </>
                )}
              </div>

              <p className="text-sm text-text-secondary/80">{productData.unit}</p>

              {/* Stock status */}
              <div className="flex items-center gap-2">
                {productData.stock > 50 ? (
                  <Badge variant="eco">In Stock</Badge>
                ) : productData.stock > 0 ? (
                  <Badge variant="low-stock">
                    Only {productData.stock} left
                  </Badge>
                ) : (
                  <Badge variant="out-of-stock">Out of Stock</Badge>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-text-primary">
                  Quantity:
                </span>
                <QuantitySelector
                  value={quantity}
                  min={1}
                  max={productData.stock || 1}
                  onChange={setQuantity}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={productData.stock === 0}
                  className="flex-1"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="cta" size="lg" className="flex-1">
                  Buy Now
                </Button>
              </div>

              {/* Trust badges */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Truck className="h-4 w-4 text-accent" />
                  Free delivery above Rp 500K
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <RotateCcw className="h-4 w-4 text-accent" />
                  7-day return policy
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Quality guaranteed
                </div>
              </div>
            </div>
          </div>

          {/* Description & Specs */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-3">
                Description
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {productData.description}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-text-primary mb-3">
                Specifications
              </h2>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(productData.specifications).map(
                    ([key, value]) => (
                      <tr
                        key={key}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-2 pr-4 text-text-secondary font-medium w-1/3">
                          {key}
                        </td>
                        <td className="py-2 text-text-primary">{value}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
      <ToastContainer />
    </>
  );
}
