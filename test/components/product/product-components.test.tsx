import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import type { Product } from "@/domain/entities";
import ProductGrid from "@/components/product/ProductGrid";
import { renderWithProviders } from "@/test/utils";

describe("ProductCardSkeleton", () => {
  it("renders a skeleton card", () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container.querySelector(".animate-pulse")).toBeTruthy();
  });
});

describe("ProductGrid", () => {
  const sampleProduct: Product = {
    id: "p-1",
    name: "Test Product",
    slug: "test-product",
    description: "A test",
    categoryId: "cat-1",
    brand: "TestBrand",
    sku: "T-001",
    price: 50000,
    stock: 100,
    unit: "pc",
    weight: 1,
    images: ["/test.jpg"],
    rating: 4.0,
    reviewCount: 5,
    isBestSeller: false,
    isNew: false,
    tags: [],
    specifications: {},
    createdAt: "2026-01-01T00:00:00Z",
  };

  it("renders loading skeletons when loading", () => {
    const { container } = renderWithProviders(
      <ProductGrid products={[]} loading />,
    );
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders title when loading", () => {
    renderWithProviders(
      <ProductGrid products={[]} loading title="Best Sellers" />,
    );
    expect(screen.getByText("Best Sellers")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    renderWithProviders(<ProductGrid products={[]} />);
    expect(screen.getByText("No products found.")).toBeInTheDocument();
  });

  it("renders product cards for each product", () => {
    const products = [
      { ...sampleProduct, id: "a", name: "Product A" },
      { ...sampleProduct, id: "b", name: "Product B" },
    ];
    renderWithProviders(<ProductGrid products={products} />);
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });

  it("renders title when not loading", () => {
    const products = [{ ...sampleProduct, id: "a", name: "Product A" }];
    renderWithProviders(
      <ProductGrid products={products} title="Featured" />,
    );
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });
});
