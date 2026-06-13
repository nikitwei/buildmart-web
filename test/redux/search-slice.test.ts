import { describe, it, expect } from "vitest";
import searchReducer, {
  setQuery,
  setFilters,
  addRecentSearch,
  clearSearch,
} from "@/redux/slices/search-slice";

describe("search slice", () => {
  it("returns initial state", () => {
    const state = searchReducer(undefined, { type: "unknown" });
    expect(state.query).toBe("");
    expect(state.results).toEqual([]);
    expect(state.totalResults).toBe(0);
    expect(state.recentSearches).toEqual([]);
    expect(state.loading).toBe("idle");
    expect(state.filters.sortBy).toBe("relevance");
    expect(state.filters.page).toBe(1);
    expect(state.filters.pageSize).toBe(12);
  });

  describe("setQuery", () => {
    it("updates query and filters.query", () => {
      const state = searchReducer(undefined, setQuery("cement"));
      expect(state.query).toBe("cement");
      expect(state.filters.query).toBe("cement");
    });

    it("sets empty query", () => {
      const state = searchReducer({ query: "old", recentSearches: [], totalResults: 0, results: [], loading: "idle", error: null, filters: { query: "old", sortBy: "relevance", page: 1, pageSize: 12 } }, setQuery(""));
      expect(state.query).toBe("");
    });
  });

  describe("setFilters", () => {
    it("merges partial filters", () => {
      const state = searchReducer(undefined, setFilters({ sortBy: "price-asc", minPrice: 500 }));
      expect(state.filters.sortBy).toBe("price-asc");
      expect(state.filters.minPrice).toBe(500);
      // existing filters preserved
      expect(state.filters.page).toBe(1);
    });

    it("replaces previous filter values", () => {
      const initial = searchReducer(undefined, setFilters({ sortBy: "price-asc" }));
      const updated = searchReducer(initial, setFilters({ sortBy: "rating" }));
      expect(updated.filters.sortBy).toBe("rating");
    });
  });

  describe("addRecentSearch", () => {
    it("adds a search term", () => {
      const state = searchReducer(undefined, addRecentSearch("cement"));
      expect(state.recentSearches).toEqual(["cement"]);
    });

    it("moves existing term to the front instead of duplicating", () => {
      const initial = searchReducer(undefined, addRecentSearch("cement"));
      const state = searchReducer(initial, addRecentSearch("cement"));
      expect(state.recentSearches).toEqual(["cement"]);
    });

    it("keeps max 5 searches", () => {
      let state = searchReducer(undefined, addRecentSearch("a"));
      state = searchReducer(state, addRecentSearch("b"));
      state = searchReducer(state, addRecentSearch("c"));
      state = searchReducer(state, addRecentSearch("d"));
      state = searchReducer(state, addRecentSearch("e"));
      state = searchReducer(state, addRecentSearch("f"));
      expect(state.recentSearches).toHaveLength(5);
      expect(state.recentSearches[0]).toBe("f");
      expect(state.recentSearches).not.toContain("a");
    });

    it("trims whitespace", () => {
      const state = searchReducer(undefined, addRecentSearch("  cement  "));
      expect(state.recentSearches).toEqual(["cement"]);
    });

    it("does nothing for empty string", () => {
      const state = searchReducer(undefined, addRecentSearch("   "));
      expect(state.recentSearches).toEqual([]);
    });
  });

  describe("clearSearch", () => {
    it("clears query and results", () => {
      const initial = searchReducer(
        { query: "cement", results: [{ id: "1" } as any], totalResults: 1, loading: "succeeded", error: null, filters: { query: "cement", sortBy: "relevance", page: 1, pageSize: 12 }, recentSearches: [] },
        clearSearch(),
      );
      expect(initial.query).toBe("");
      expect(initial.results).toEqual([]);
      expect(initial.totalResults).toBe(0);
      // recentSearches not cleared
    });

    it("does not clear recentSearches", () => {
      const stateWithHistory = searchReducer(undefined, addRecentSearch("cement"));
      const cleared = searchReducer(stateWithHistory, clearSearch());
      expect(cleared.recentSearches).toEqual(["cement"]);
    });
  });

  describe("loading states from extraReducers", () => {
    it("sets loading on fetchSearchResults.pending", () => {
      const state = searchReducer(undefined, {
        type: "search/fetchResults/pending",
      });
      expect(state.loading).toBe("loading");
    });

    it("sets results on fetchSearchResults.fulfilled", () => {
      const products = [{ id: "p-1", name: "Test" } as any];
      const state = searchReducer(undefined, {
        type: "search/fetchResults/fulfilled",
        payload: { products, total: 1 },
      });
      expect(state.loading).toBe("succeeded");
      expect(state.results).toEqual(products);
      expect(state.totalResults).toBe(1);
    });

    it("sets error on fetchSearchResults.rejected", () => {
      const state = searchReducer(undefined, {
        type: "search/fetchResults/rejected",
        error: { message: "Network error" },
      });
      expect(state.loading).toBe("failed");
      expect(state.error).toBe("Network error");
    });
  });
});
