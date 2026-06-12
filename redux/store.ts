import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/product-slice";
import categoryReducer from "./slices/category-slice";
import cartReducer from "./slices/cart-slice";
import searchReducer from "./slices/search-slice";
import uiReducer from "./slices/ui-slice";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      products: productReducer,
      categories: categoryReducer,
      cart: cartReducer,
      search: searchReducer,
      ui: uiReducer,
    },
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
