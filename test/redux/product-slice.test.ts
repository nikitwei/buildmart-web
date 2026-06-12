import { describe, it, expect } from "vitest";
import productReducer, { clearCurrentProduct } from "@/redux/slices/product-slice";
import type { Product } from "@/domain/entities";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p-1",
    name: "Test",
    slug: "test",
    description: "",
    categoryId: "cat-1",
    brand: "TestBrand",
    sku: "T-001",
    price: 50000,
    stock: 100,
    unit: "pc",
    weight: 1,
    images: [],
    rating: 4.0,
    reviewCount: 10,
    isBestSeller: false,
    isNew: false,
    tags: [],
    specifications: {},
    createdAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("product slice", () => {
  it("returns initial state", () => {
    const state = productReducer(undefined, { type: "unknown" });
    expect(state.items).toEqual({});
    expect(state.bestSellers).toEqual([]);
    expect(state.newArrivals).toEqual([]);
    expect(state.listing).toEqual({ products: [], total: 0 });
    expect(state.currentProduct).toBeNull();
    expect(state.loading).toBe("idle");
    expect(state.error).toBeNull();
  });

  describe("clearCurrentProduct", () => {
    it("clears currentProduct", () => {
      const state = productReducer(
        { items: {}, bestSellers: [], newArrivals: [], listing: { products: [], total: 0 }, currentProduct: makeProduct(), loading: "succeeded" as const, error: null },
        clearCurrentProduct(),
      );
      expect(state.currentProduct).toBeNull();
    });
  });

  describe("extraReducers", () => {
    it("handles fetchBestSellers.pending", () => {
      const state = productReducer(undefined, {
        type: "products/fetchBestSellers/pending",
      });
      expect(state.loading).toBe("loading");
    });

    it("handles fetchBestSellers.fulfilled", () => {
      const products = [makeProduct({ id: "p-1" }), makeProduct({ id: "p-2" })];
      const state = productReducer(undefined, {
        type: "products/fetchBestSellers/fulfilled",
        payload: products,
      });
      expect(state.loading).toBe("succeeded");
      expect(state.bestSellers).toEqual(products);
      expect(state.items["p-1"]).toEqual(products[0]);
      expect(state.items["p-2"]).toEqual(products[1]);
    });

    it("handles fetchBestSellers.rejected", () => {
      const state = productReducer(undefined, {
        type: "products/fetchBestSellers/rejected",
        error: { message: "Failed to fetch best sellers" },
      });
      expect(state.loading).toBe("failed");
      expect(state.error).toBe("Failed to fetch best sellers");
    });

    it("uses default error message when rejected with no message", () => {
      const state = productReducer(undefined, {
        type: "products/fetchBestSellers/rejected",
        error: {},
      });
      expect(state.error).toBe("Failed to fetch best sellers");
    });

    it("handles fetchNewArrivals.fulfilled", () => {
      const products = [makeProduct({ id: "p-3", isNew: true })];
      const state = productReducer(undefined, {
        type: "products/fetchNewArrivals/fulfilled",
        payload: products,
      });
      expect(state.newArrivals).toEqual(products);
      expect(state.items["p-3"]).toEqual(products[0]);
    });

    it("handles fetchProductById.fulfilled with a product", () => {
      const product = makeProduct({ id: "p-5" });
      const state = productReducer(undefined, {
        type: "products/fetchProductById/fulfilled",
        payload: product,
      });
      expect(state.currentProduct).toEqual(product);
      expect(state.items["p-5"]).toEqual(product);
    });

    it("handles fetchProductById.fulfilled with null", () => {
      const state = productReducer(undefined, {
        type: "products/fetchProductById/fulfilled",
        payload: null,
      });
      expect(state.currentProduct).toBeNull();
      expect(state.items).toEqual({});
    });

    it("handles fetchProductsByCategory.fulfilled", () => {
      const products = [makeProduct({ id: "p-10" }), makeProduct({ id: "p-11" })];
      const state = productReducer(undefined, {
        type: "products/fetchByCategory/fulfilled",
        payload: { products, total: 2 },
      });
      expect(state.listing).toEqual({ products, total: 2 });
      expect(state.items["p-10"]).toEqual(products[0]);
      expect(state.items["p-11"]).toEqual(products[1]);
    });

    it("handles fetchProductsByIds.fulfilled", () => {
      const products = [makeProduct({ id: "p-20" })];
      const state = productReducer(undefined, {
        type: "products/fetchByIds/fulfilled",
        payload: products,
      });
      expect(state.items["p-20"]).toEqual(products[0]);
    });
  });
});
