import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Toast } from "@/domain/entities";

interface UiState {
  toasts: Toast[];
  mobileMenuOpen: boolean;
  filterDrawerOpen: boolean;
}

const initialState: UiState = {
  toasts: [],
  mobileMenuOpen: false,
  filterDrawerOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<Omit<Toast, "id">>) {
      const id = Date.now().toString();
      state.toasts.push({ ...action.payload, id });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    },
    toggleFilterDrawer(state) {
      state.filterDrawerOpen = !state.filterDrawerOpen;
    },
    setFilterDrawerOpen(state, action: PayloadAction<boolean>) {
      state.filterDrawerOpen = action.payload;
    },
  },
});

export const {
  addToast,
  removeToast,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleFilterDrawer,
  setFilterDrawerOpen,
} = uiSlice.actions;
export default uiSlice.reducer;
