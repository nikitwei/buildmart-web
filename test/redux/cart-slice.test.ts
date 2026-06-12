import { describe, it, expect } from "vitest";
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} from "@/redux/slices/cart-slice";
import type { CartItem } from "@/domain/entities";

const sampleItem: CartItem = {
  productId: "prod-1",
  name: "Test Cement 50kg",
  image: "/test.jpg",
  price: 50000,
  quantity: 2,
  maxStock: 100,
  unit: "bag (50kg)",
};

const sampleItem2: CartItem = {
  productId: "prod-2",
  name: "Red Brick 100 pcs",
  image: "/brick.jpg",
  price: 85000,
  quantity: 1,
  maxStock: 50,
  unit: "pack (100 pcs)",
};

describe("cart slice", () => {
  it("returns initial state", () => {
    const state = cartReducer(undefined, { type: "unknown" });
    expect(state.items).toEqual([]);
    expect(state.isOpen).toBe(false);
  });

  it("adds an item to the cart", () => {
    const state = cartReducer(undefined, addToCart(sampleItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(sampleItem);
  });

  it("increments quantity when adding an existing item", () => {
    const state = cartReducer(
      { items: [sampleItem], isOpen: false },
      addToCart({ ...sampleItem, quantity: 3 }),
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(5);
  });

  it("caps quantity at maxStock when adding an existing item", () => {
    const state = cartReducer(
      { items: [{ ...sampleItem, quantity: 99 }], isOpen: false },
      addToCart({ ...sampleItem, quantity: 5 }),
    );
    expect(state.items[0].quantity).toBe(100);
  });

  it("removes an item from the cart", () => {
    const state = cartReducer(
      { items: [sampleItem, sampleItem2], isOpen: false },
      removeFromCart("prod-1"),
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe("prod-2");
  });

  it("does nothing when removing a non-existent item", () => {
    const state = cartReducer(
      { items: [sampleItem], isOpen: false },
      removeFromCart("non-existent"),
    );
    expect(state.items).toHaveLength(1);
  });

  it("updates quantity within bounds", () => {
    const state = cartReducer(
      { items: [sampleItem], isOpen: false },
      updateQuantity({ productId: "prod-1", quantity: 5 }),
    );
    expect(state.items[0].quantity).toBe(5);
  });

  it("clamps quantity to minimum 1", () => {
    const state = cartReducer(
      { items: [sampleItem], isOpen: false },
      updateQuantity({ productId: "prod-1", quantity: 0 }),
    );
    expect(state.items[0].quantity).toBe(1);
  });

  it("clamps quantity to maxStock", () => {
    const state = cartReducer(
      { items: [sampleItem], isOpen: false },
      updateQuantity({ productId: "prod-1", quantity: 999 }),
    );
    expect(state.items[0].quantity).toBe(100);
  });

  it("does nothing when updating quantity for non-existent item", () => {
    const state = cartReducer(
      { items: [sampleItem], isOpen: false },
      updateQuantity({ productId: "no-such", quantity: 5 }),
    );
    expect(state.items[0].quantity).toBe(2);
  });

  it("clears the cart", () => {
    const state = cartReducer(
      { items: [sampleItem, sampleItem2], isOpen: false },
      clearCart(),
    );
    expect(state.items).toHaveLength(0);
  });

  it("toggles isOpen", () => {
    const closed = cartReducer(undefined, toggleCart());
    expect(closed.isOpen).toBe(true);

    const opened = cartReducer({ items: [], isOpen: true }, toggleCart());
    expect(opened.isOpen).toBe(false);
  });

  it("sets isOpen to a specific value", () => {
    const state = cartReducer(undefined, setCartOpen(true));
    expect(state.isOpen).toBe(true);
  });
});
