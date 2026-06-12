import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product, SearchFilters } from "@/domain/entities";
import { ProductRepository } from "@/infrastructure/repositories/product-repository";

const repo = new ProductRepository();

interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Product[];
  totalResults: number;
  recentSearches: string[];
  loading: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SearchState = {
  query: "",
  filters: {
    query: "",
    sortBy: "relevance",
    page: 1,
    pageSize: 12,
  },
  results: [],
  totalResults: 0,
  recentSearches: [],
  loading: "idle",
  error: null,
};

export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async (filters: SearchFilters) => repo.search(filters),
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.filters.query = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<SearchFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    addRecentSearch(state, action: PayloadAction<string>) {
      const q = action.payload.trim();
      if (!q) return;
      state.recentSearches = [
        q,
        ...state.recentSearches.filter((s) => s !== q),
      ].slice(0, 5);
    },
    clearSearch(state) {
      state.query = "";
      state.results = [];
      state.totalResults = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.results = action.payload.products;
        state.totalResults = action.payload.total;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message ?? "Search failed";
      });
  },
});

export const { setQuery, setFilters, addRecentSearch, clearSearch } =
  searchSlice.actions;
export default searchSlice.reducer;
