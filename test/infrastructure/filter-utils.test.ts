import { describe, it, expect } from "vitest";
import { productMatchesFilters } from "@/infrastructure/repositories/filter-utils";
import type { Product, SearchFilters } from "@/domain/entities";

const baseProduct: Product = {
  id: "test-1",
  name: "Test Cement 50kg",
  slug: "test-cement-50kg",
  description: "A test product",
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
};

const defaultFilters: SearchFilters = {
  query: "",
  sortBy: "relevance",
  page: 1,
  pageSize: 12,
};

describe("productMatchesFilters", () => {
  it("returns true when no filters are set", () => {
    expect(productMatchesFilters(baseProduct, defaultFilters)).toBe(true);
  });

  it("filters by categoryId", () => {
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, categoryId: "cat-2" })).toBe(false);
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, categoryId: "cat-1" })).toBe(true);
  });

  it("filters by minPrice (inclusive boundary)", () => {
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, minPrice: 60000 })).toBe(false);
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, minPrice: 40000 })).toBe(true);
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, minPrice: 50000 })).toBe(true);
  });

  it("filters by maxPrice (inclusive boundary)", () => {
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, maxPrice: 40000 })).toBe(false);
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, maxPrice: 50000 })).toBe(true);
  });

  it("filters by brand (exact match)", () => {
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, brand: "OtherBrand" })).toBe(false);
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, brand: "TestBrand" })).toBe(true);
  });

  it("filters by minRating (inclusive boundary)", () => {
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, minRating: 5 })).toBe(false);
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, minRating: 4 })).toBe(true);
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, minRating: 4.5 })).toBe(true);
  });

  it("combines multiple filters with AND logic", () => {
    const filters: SearchFilters = {
      ...defaultFilters,
      categoryId: "cat-1",
      brand: "TestBrand",
      minPrice: 40000,
      maxPrice: 60000,
    };
    expect(productMatchesFilters(baseProduct, filters)).toBe(true);

    const wrongBrand = { ...filters, brand: "Wrong" };
    expect(productMatchesFilters(baseProduct, wrongBrand)).toBe(false);
  });

  it("returns false when minPrice and maxPrice both conflict", () => {
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, minPrice: 60000, maxPrice: 70000 })).toBe(false);
  });

  it("returns true when categoryId is undefined (no category filter)", () => {
    expect(productMatchesFilters(baseProduct, { ...defaultFilters, categoryId: undefined })).toBe(true);
  });
});
