import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/domain/entities";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId,
      );
      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + action.payload.quantity,
          existing.maxStock,
        );
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (i) => i.productId !== action.payload,
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId,
      );
      if (item) {
        item.quantity = Math.max(
          1,
          Math.min(action.payload.quantity, item.maxStock),
        );
      }
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    setCartOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  toggleCart,
  setCartOpen,
  setCartItems,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
