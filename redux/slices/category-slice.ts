import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Category } from "@/domain/entities";
import { CategoryRepository } from "@/infrastructure/repositories/category-repository";

const repo = new CategoryRepository();

interface CategoryState {
  items: Category[];
  loading: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  loading: "idle",
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async () => repo.getAll(),
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message ?? "Failed to fetch categories";
      });
  },
});

export default categorySlice.reducer;
