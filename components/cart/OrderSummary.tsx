"use client";

import { useAppSelector } from "@/redux/hooks";
import Button from "@/components/ui/Button";

export default function OrderSummary() {
  const { items } = useAppSelector((s) => s.cart);

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );
  const delivery = subtotal >= 500000 ? 0 : 25000;
  const total = subtotal + delivery;

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="bg-bg-card border border-border rounded-lg p-6 sticky top-20">
      <h2 className="text-lg font-bold text-text-primary mb-4">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-medium text-text-primary">
            Rp {subtotal.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-text-secondary">Delivery</span>
          <span className="font-medium text-text-primary">
            {delivery === 0 ? (
              <span className="text-accent">FREE</span>
            ) : (
              `Rp ${delivery.toLocaleString("id-ID")}`
            )}
          </span>
        </div>

        <div className="border-t border-border pt-3 flex justify-between">
          <span className="font-bold text-text-primary">Total</span>
          <span className="font-bold text-lg text-text-primary">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>

        {delivery > 0 && subtotal < 500000 && (
          <p className="text-xs text-text-secondary">
            Add Rp {(500000 - subtotal).toLocaleString("id-ID")} more for free
            delivery
          </p>
        )}
      </div>

      <Button
        variant="secondary"
        size="lg"
        className="w-full mt-6"
        disabled={items.length === 0}
      >
        Secure Checkout ({itemCount})
      </Button>
    </div>
  );
}
