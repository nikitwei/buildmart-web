import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductRepository } from "@/infrastructure/repositories/product-repository";
import type { Product, SearchFilters } from "@/domain/entities";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p-1",
    name: "Test Cement 50kg",
    slug: "test-cement-50kg",
    description: "A cement product for testing",
    categoryId: "cat-1",
    brand: "TestBrand",
    sku: "TST-001",
    price: 50000,
    stock: 100,
    unit: "bag (50kg)",
    weight: 50,
    images: [],
    rating: 4.5,
    reviewCount: 10,
    isBestSeller: false,
    isNew: false,
    tags: [],
    specifications: {},
    createdAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

const products: Product[] = [
  makeProduct({ id: "p-1", name: "Cement A", description: "High quality construction cement", categoryId: "cat-1", price: 50000, rating: 4.5, isBestSeller: true, brand: "BrandA" }),
  makeProduct({ id: "p-2", name: "Cement B", description: "Premium cement for heavy duty", categoryId: "cat-1", price: 60000, rating: 4.2, brand: "BrandB" }),
  makeProduct({ id: "p-3", name: "Brick Red", description: "Clay bricks for walls", categoryId: "cat-2", price: 85000, rating: 4.8, isBestSeller: true, brand: "BrandC" }),
  makeProduct({ id: "p-4", name: "Drill Pro", description: "Powerful cordless drill", categoryId: "cat-6", price: 1500000, rating: 4.9, isNew: true, brand: "BrandD", createdAt: "2026-06-01T00:00:00Z" }),
  makeProduct({ id: "p-5", name: "Saw Master", description: "Circular saw for woodworking", categoryId: "cat-6", price: 800000, rating: 4.0, isNew: true, brand: "BrandE", createdAt: "2026-05-01T00:00:00Z" }),
  makeProduct({ id: "p-6", name: "Paint White", description: "Interior wall paint", categoryId: "cat-5", price: 165000, rating: 4.6, isBestSeller: true, brand: "BrandF", originalPrice: 200000 }),
  makeProduct({ id: "p-7", name: "Pipe PVC", description: "Plumbing PVC pipes", categoryId: "cat-7", price: 35000, rating: 3.8, brand: "BrandG" }),
  makeProduct({ id: "p-8", name: "Cable 2.5mm", description: "Electrical wiring cable", categoryId: "cat-8", price: 250000, rating: 4.5, stock: 0, brand: "BrandH" }),
];

function mockFetch(data: unknown) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

const defaultFilters: SearchFilters = {
  query: "",
  sortBy: "relevance",
  page: 1,
  pageSize: 10,
};

describe("ProductRepository", () => {
  let repo: ProductRepository;

  beforeEach(() => {
    repo = new ProductRepository();
    repo.invalidateCache();
    mockFetch(products);
  });

  describe("getById", () => {
    it("returns a product by id", async () => {
      const result = await repo.getById("p-1");
      expect(result).not.toBeNull();
      expect(result!.name).toBe("Cement A");
    });

    it("returns null for unknown id", async () => {
      const result = await repo.getById("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("getBestSellers", () => {
    it("returns only best sellers sorted by rating desc", async () => {
      const result = await repo.getBestSellers();
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((p) => p.isBestSeller)).toBe(true);
      // sorted by rating descending
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].rating).toBeGreaterThanOrEqual(result[i].rating);
      }
    });

    it("respects the limit parameter", async () => {
      const result = await repo.getBestSellers(1);
      expect(result).toHaveLength(1);
    });
  });

  describe("getNewArrivals", () => {
    it("returns only new products sorted by createdAt desc", async () => {
      const result = await repo.getNewArrivals();
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((p) => p.isNew)).toBe(true);
      expect(result[0].id).toBe("p-4"); // newest first (June > May)
    });
  });

  describe("getByIds", () => {
    it("returns products matching given ids", async () => {
      const result = await repo.getByIds(["p-1", "p-3"]);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id).sort()).toEqual(["p-1", "p-3"]);
    });

    it("returns empty for unknown ids", async () => {
      const result = await repo.getByIds(["no-such"]);
      expect(result).toEqual([]);
    });
  });

  describe("getByCategory", () => {
    it("returns products only in the given category", async () => {
      const { products: result } = await repo.getByCategory("tools-hardware", defaultFilters);
      expect(result.every((p) => p.categoryId === "cat-6")).toBe(true);
      expect(result.map((p) => p.id).sort()).toEqual(["p-4", "p-5"]);
    });

    it("returns empty for unknown slug", async () => {
      const { products, total } = await repo.getByCategory("unknown-slug", defaultFilters);
      expect(products).toEqual([]);
      expect(total).toBe(0);
    });

    it("applies filters on top of category matching", async () => {
      const filters: SearchFilters = { ...defaultFilters, minPrice: 1000000 };
      const { products } = await repo.getByCategory("tools-hardware", filters);
      expect(products).toHaveLength(1);
      expect(products[0].id).toBe("p-4");
    });
  });

  describe("search", () => {
    it("matches by name (case-insensitive)", async () => {
      const filters: SearchFilters = { ...defaultFilters, query: "cement" };
      const { products } = await repo.search(filters);
      expect(products.map((p) => p.id).sort()).toEqual(["p-1", "p-2"]);
    });

    it("matches by brand (case-insensitive)", async () => {
      const filters: SearchFilters = { ...defaultFilters, query: "brandd" };
      const { products } = await repo.search(filters);
      expect(products).toHaveLength(1);
      expect(products[0].id).toBe("p-4");
    });

    it("matches by description", async () => {
      const filters: SearchFilters = { ...defaultFilters, query: "plumbing PVC" };
      const { products } = await repo.search(filters);
      expect(products.map((p) => p.id)).toEqual(["p-7"]);
    });

    it("returns empty when no matches", async () => {
      const filters: SearchFilters = { ...defaultFilters, query: "zzzznotfound" };
      const { products, total } = await repo.search(filters);
      expect(products).toEqual([]);
      expect(total).toBe(0);
    });

    it("applies price filters on top of search", async () => {
      const filters: SearchFilters = { ...defaultFilters, query: "cement", maxPrice: 55000 };
      const { products } = await repo.search(filters);
      expect(products).toHaveLength(1);
      expect(products[0].id).toBe("p-1");
    });

  });

  describe("paginateAndSort", () => {
    it("paginates correctly", async () => {
      const filters: SearchFilters = { ...defaultFilters, page: 1, pageSize: 2, sortBy: "relevance" };
      const { products, total } = await repo.getByCategory("cement-mortar", filters);
      expect(products).toHaveLength(2);
      expect(total).toBe(2);
    });

    it("returns second page correctly", async () => {
      // add more products to cat-1 to test pagination
      const manyProducts = Array.from({ length: 12 }, (_, i) =>
        makeProduct({ id: `p-${10 + i}`, name: `Cement ${i}`, categoryId: "cat-1", price: 50000 + i * 1000 })
      );
      const allProducts = [...products, ...manyProducts];
      repo.invalidateCache();
      mockFetch(allProducts);

      const filters: SearchFilters = { ...defaultFilters, page: 2, pageSize: 5, sortBy: "relevance" };
      const { products: page2, total } = await repo.getByCategory("cement-mortar", filters);
      expect(page2).toHaveLength(5);
      expect(total).toBe(14); // 2 original + 12 new
    });

    it("sorts by price asc", async () => {
      const filters: SearchFilters = { ...defaultFilters, sortBy: "price-asc", pageSize: 20 };
      const { products: sorted } = await repo.getByCategory("cement-mortar", filters);
      expect(sorted[0].price).toBeLessThanOrEqual(sorted[1].price);
    });

    it("sorts by price desc", async () => {
      const filters: SearchFilters = { ...defaultFilters, sortBy: "price-desc", pageSize: 20 };
      const { products: sorted } = await repo.getByCategory("cement-mortar", filters);
      expect(sorted[0].price).toBeGreaterThanOrEqual(sorted[1].price);
    });

    it("sorts by rating desc", async () => {
      const filters: SearchFilters = { ...defaultFilters, sortBy: "rating", pageSize: 20 };
      const { products: sorted } = await repo.getByCategory("cement-mortar", filters);
      expect(sorted[0].rating).toBeGreaterThanOrEqual(sorted[1].rating);
    });

    it("sorts by newest first", async () => {
      const filters: SearchFilters = { ...defaultFilters, sortBy: "newest", pageSize: 20 };
      const { products: sorted } = await repo.getByCategory("cement-mortar", filters);
      expect(new Date(sorted[0].createdAt).getTime()).toBeGreaterThanOrEqual(
        new Date(sorted[1].createdAt).getTime()
      );
    });
  });

  describe("caching", () => {
    it("caches products and only fetches once", async () => {
      mockFetch(products);
      await repo.getById("p-1");
      await repo.getById("p-2");
      await repo.getBestSellers();
      // fetch should have been called only once for all three calls
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("invalidates cache so the next call fetches again", async () => {
      mockFetch(products);
      await repo.getById("p-1");
      repo.invalidateCache();
      await repo.getById("p-1");
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
