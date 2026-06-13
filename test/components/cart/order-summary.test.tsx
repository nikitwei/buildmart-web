import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/utils";
import OrderSummary from "@/components/cart/OrderSummary";
import type { CartItem } from "@/domain/entities";

describe("OrderSummary", () => {
  it("shows empty cart with disabled checkout", () => {
    renderWithProviders(<OrderSummary />);
    expect(screen.getByText("Order Summary")).toBeInTheDocument();
    expect(screen.getByText("Rp 0")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calculates subtotal from one item", () => {
    const items: CartItem[] = [
      { productId: "p-1", name: "Cement", image: "/test.jpg", price: 50000, quantity: 3, maxStock: 10, unit: "bag" },
    ];
    renderWithProviders(<OrderSummary />, {
      preloadedState: { cart: { items, isOpen: false } },
    } as any);
    // subtotal = 50000 * 3 = 150000
    expect(screen.getByText("Rp 150.000")).toBeInTheDocument();
  });

  it("calculates free delivery above Rp 500K", () => {
    const items: CartItem[] = [
      { productId: "p-1", name: "Drill", image: "/test.jpg", price: 600000, quantity: 1, maxStock: 5, unit: "pc" },
    ];
    renderWithProviders(<OrderSummary />, {
      preloadedState: { cart: { items, isOpen: false } },
    } as any);
    expect(screen.getByText("FREE")).toBeInTheDocument();
  });

  it("shows delivery fee when below Rp 500K", () => {
    const items: CartItem[] = [
      { productId: "p-1", name: "Cement", image: "/test.jpg", price: 50000, quantity: 2, maxStock: 10, unit: "bag" },
    ];
    renderWithProviders(<OrderSummary />, {
      preloadedState: { cart: { items, isOpen: false } },
    } as any);
    // subtotal = 100000, delivery = 25000, total = 125000
    expect(screen.getByText("Rp 25.000")).toBeInTheDocument();
  });

  it("shows how much more to add for free delivery", () => {
    const items: CartItem[] = [
      { productId: "p-1", name: "Cement", image: "/test.jpg", price: 100000, quantity: 1, maxStock: 10, unit: "bag" },
    ];
    renderWithProviders(<OrderSummary />, {
      preloadedState: { cart: { items, isOpen: false } },
    } as any);
    // subtotal = 100000, needs 400000 more
    expect(screen.getByText(/Add Rp 400\.000 more/)).toBeInTheDocument();
  });

  it("pluralizes items in subtotal label", () => {
    const items: CartItem[] = [
      { productId: "p-1", name: "Cement", image: "/test.jpg", price: 50000, quantity: 1, maxStock: 10, unit: "bag" },
    ];
    renderWithProviders(<OrderSummary />, {
      preloadedState: { cart: { items, isOpen: false } },
    } as any);
    expect(screen.getByText(/Subtotal \(1 item\)/)).toBeInTheDocument();
  });

  it("uses plural 'items' for multiple", () => {
    const items: CartItem[] = [
      { productId: "p-1", name: "A", image: "/test.jpg", price: 50000, quantity: 1, maxStock: 10, unit: "bag" },
      { productId: "p-2", name: "B", image: "/test.jpg", price: 30000, quantity: 1, maxStock: 5, unit: "pc" },
    ];
    renderWithProviders(<OrderSummary />, {
      preloadedState: { cart: { items, isOpen: false } },
    } as any);
    expect(screen.getByText(/Subtotal \(2 items\)/)).toBeInTheDocument();
  });

  it("enables checkout button when cart has items", () => {
    const items: CartItem[] = [
      { productId: "p-1", name: "Cement", image: "/test.jpg", price: 50000, quantity: 1, maxStock: 10, unit: "bag" },
    ];
    renderWithProviders(<OrderSummary />, {
      preloadedState: { cart: { items, isOpen: false } },
    } as any);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });
});
