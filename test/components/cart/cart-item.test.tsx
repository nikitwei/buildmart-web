import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/utils";
import CartItemComponent from "@/components/cart/CartItem";
import type { CartItem } from "@/domain/entities";

const sampleItem: CartItem = {
  productId: "prod-1",
  name: "Portland Cement 50kg",
  image: "/cement.jpg",
  price: 58000,
  quantity: 2,
  maxStock: 250,
  unit: "bag (50kg)",
};

describe("CartItem", () => {
  it("renders product name and unit", () => {
    renderWithProviders(<CartItemComponent item={sampleItem} />);
    expect(screen.getByText("Portland Cement 50kg")).toBeInTheDocument();
  });

  it("shows the item unit", () => {
    renderWithProviders(<CartItemComponent item={sampleItem} />);
    expect(screen.getByText("bag (50kg)")).toBeInTheDocument();
  });

  it("shows formatted price", () => {
    renderWithProviders(<CartItemComponent item={sampleItem} />);
    expect(screen.getByText("Rp 58.000")).toBeInTheDocument();
  });

  it("shows computed subtotal (price * quantity)", () => {
    renderWithProviders(<CartItemComponent item={sampleItem} />);
    // 58000 * 2 = 116000
    expect(screen.getByText("Rp 116.000")).toBeInTheDocument();
  });

  it("shows in-stock badge for high stock", () => {
    renderWithProviders(<CartItemComponent item={sampleItem} />);
    expect(screen.getByText("In Stock")).toBeInTheDocument();
  });

  it("shows low stock badge for stock between 11-50", () => {
    const lowStockItem = { ...sampleItem, maxStock: 30 };
    renderWithProviders(<CartItemComponent item={lowStockItem} />);
    expect(screen.getByText("Low Stock")).toBeInTheDocument();
  });

  it("shows exact count when stock <= 10", () => {
    const limitedItem = { ...sampleItem, maxStock: 5 };
    renderWithProviders(<CartItemComponent item={limitedItem} />);
    expect(screen.getByText("Only 5 left")).toBeInTheDocument();
  });

  it("shows out of stock when maxStock is 0", () => {
    const outOfStockItem = { ...sampleItem, maxStock: 0 };
    renderWithProviders(<CartItemComponent item={outOfStockItem} />);
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("renders a link to product detail", () => {
    renderWithProviders(<CartItemComponent item={sampleItem} />);
    const links = screen.getAllByRole("link");
    const productLinks = links.filter((l) =>
      l.getAttribute("href") === "/products/prod-1",
    );
    expect(productLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("has a remove button", () => {
    renderWithProviders(<CartItemComponent item={sampleItem} />);
    expect(screen.getByLabelText("Remove item")).toBeInTheDocument();
  });

  it("renders quantity selector with correct value", () => {
    renderWithProviders(<CartItemComponent item={sampleItem} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    const increaseBtn = screen.getByLabelText("Increase quantity");
    const decreaseBtn = screen.getByLabelText("Decrease quantity");
    expect(increaseBtn).toBeInTheDocument();
    expect(decreaseBtn).toBeInTheDocument();
  });
});
