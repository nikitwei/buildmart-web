import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/utils";
import CategoryGrid from "@/components/home/CategoryGrid";

describe("CategoryGrid", () => {
  it("renders loading skeletons when loading", () => {
    renderWithProviders(<CategoryGrid />, {
      preloadedState: {
        categories: { items: [], loading: "loading", error: null },
      },
    } as any);
    expect(screen.getByText("Shop by Category")).toBeInTheDocument();
    // 8 skeleton pills rendered
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(8);
  });

  it("renders categories when loaded", () => {
    renderWithProviders(<CategoryGrid />, {
      preloadedState: {
        categories: {
          items: [
            { id: "cat-1", name: "Cement & Mortar", slug: "cement-mortar", icon: "package", image: "/cement.jpg", productCount: 45 },
          ],
          loading: "succeeded",
          error: null,
        },
      },
    } as any);
    expect(screen.getByText("Cement & Mortar")).toBeInTheDocument();
  });

  it("shows View All link", () => {
    renderWithProviders(<CategoryGrid />, {
      preloadedState: {
        categories: {
          items: [
            { id: "cat-1", name: "Cement", slug: "cement", icon: "package", image: "/cement.jpg", productCount: 45 },
          ],
          loading: "succeeded",
          error: null,
        },
      },
    } as any);
    expect(screen.getByText(/View All/)).toBeInTheDocument();
  });

  it("renders each category as a link with correct href", () => {
    renderWithProviders(<CategoryGrid />, {
      preloadedState: {
        categories: {
          items: [
            { id: "cat-1", name: "Cement", slug: "cement", icon: "package", image: "/cement.jpg", productCount: 45 },
            { id: "cat-2", name: "Bricks", slug: "bricks", icon: "box", image: "/bricks.jpg", productCount: 32 },
          ],
          loading: "succeeded",
          error: null,
        },
      },
    } as any);
    const links = screen.getAllByRole("link");
    const catLink = links.find((l) => l.getAttribute("href") === "/categories/cement");
    expect(catLink).toBeTruthy();
  });
});
