import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Product } from "@/domain/entities";
import { ProductRepository } from "@/infrastructure/repositories/product-repository";

const repo = new ProductRepository();

interface ProductState {
  items: Record<string, Product>;
  bestSellers: Product[];
  newArrivals: Product[];
  listing: { products: Product[]; total: number };
  currentProduct: Product | null;
  loading: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  items: {},
  bestSellers: [],
  newArrivals: [],
  listing: { products: [], total: 0 },
  currentProduct: null,
  loading: "idle",
  error: null,
};

export const fetchBestSellers = createAsyncThunk(
  "products/fetchBestSellers",
  async (limit?: number) => repo.getBestSellers(limit),
);

export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNewArrivals",
  async (limit?: number) => repo.getNewArrivals(limit),
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string) => repo.getById(id),
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async ({
    categorySlug,
    filters,
  }: {
    categorySlug: string;
    filters: import("@/domain/entities").SearchFilters;
  }) => repo.getByCategory(categorySlug, filters),
);

export const fetchProductsByIds = createAsyncThunk(
  "products/fetchByIds",
  async (ids: string[]) => repo.getByIds(ids),
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBestSellers.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.bestSellers = action.payload;
        for (const p of action.payload) {
          state.items[p.id] = p;
        }
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message ?? "Failed to fetch best sellers";
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals = action.payload;
        for (const p of action.payload) {
          state.items[p.id] = p;
        }
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        if (action.payload) {
          state.items[action.payload.id] = action.payload;
        }
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.listing = action.payload;
        for (const p of action.payload.products) {
          state.items[p.id] = p;
        }
      })
      .addCase(fetchProductsByIds.fulfilled, (state, action) => {
        for (const p of action.payload) {
          state.items[p.id] = p;
        }
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
