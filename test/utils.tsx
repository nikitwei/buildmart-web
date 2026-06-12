import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import type { RootState } from "@/redux/store";
import productReducer from "@/redux/slices/product-slice";
import categoryReducer from "@/redux/slices/category-slice";
import cartReducer from "@/redux/slices/cart-slice";
import searchReducer from "@/redux/slices/search-slice";
import uiReducer from "@/redux/slices/ui-slice";

export function makeTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      products: productReducer,
      categories: categoryReducer,
      cart: cartReducer,
      search: searchReducer,
      ui: uiReducer,
    },
    preloadedState: preloadedState as RootState | undefined,
  });
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: Partial<RootState>;
}

export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, ...renderOptions }: CustomRenderOptions = {},
) {
  const store = makeTestStore(preloadedState);
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
