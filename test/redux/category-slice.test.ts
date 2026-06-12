import { describe, it, expect } from "vitest";
import categoryReducer from "@/redux/slices/category-slice";
import type { Category } from "@/domain/entities";

const categories: Category[] = [
  { id: "cat-1", name: "Cement", slug: "cement", icon: "package", image: "/cement.jpg", productCount: 45 },
  { id: "cat-2", name: "Bricks", slug: "bricks", icon: "box", image: "/bricks.jpg", productCount: 32 },
];

describe("category slice", () => {
  it("returns initial state", () => {
    const state = categoryReducer(undefined, { type: "unknown" });
    expect(state.items).toEqual([]);
    expect(state.loading).toBe("idle");
    expect(state.error).toBeNull();
  });

  describe("extraReducers", () => {
    it("handles fetchCategories.pending", () => {
      const state = categoryReducer(undefined, {
        type: "categories/fetchAll/pending",
      });
      expect(state.loading).toBe("loading");
    });

    it("handles fetchCategories.fulfilled", () => {
      const state = categoryReducer(undefined, {
        type: "categories/fetchAll/fulfilled",
        payload: categories,
      });
      expect(state.loading).toBe("succeeded");
      expect(state.items).toEqual(categories);
    });

    it("handles fetchCategories.rejected", () => {
      const state = categoryReducer(undefined, {
        type: "categories/fetchAll/rejected",
        error: { message: "Timeout" },
      });
      expect(state.loading).toBe("failed");
      expect(state.error).toBe("Timeout");
    });

    it("uses default error message on rejected with no message", () => {
      const state = categoryReducer(undefined, {
        type: "categories/fetchAll/rejected",
        error: {},
      });
      expect(state.error).toBe("Failed to fetch categories");
    });
  });
});
