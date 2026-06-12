import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterSidebar from "@/components/filters/FilterSidebar";
import type { Category, SearchFilters } from "@/domain/entities";

const categories: Category[] = [
  { id: "cat-1", name: "Cement", slug: "cement", icon: "package", image: "/cement.jpg", productCount: 45 },
  { id: "cat-2", name: "Bricks", slug: "bricks", icon: "box", image: "/bricks.jpg", productCount: 32 },
];

const brands = ["BrandA", "BrandB"];

const defaultFilters: SearchFilters = {
  query: "",
  sortBy: "relevance",
  page: 1,
  pageSize: 12,
};

describe("FilterSidebar", () => {
  describe("desktop mode", () => {
    it("renders filter sections", () => {
      render(
        <FilterSidebar
          categories={categories}
          filters={defaultFilters}
          onFilterChange={() => {}}
          onReset={() => {}}
          allBrands={brands}
        />,
      );
      expect(screen.getByText("Filters")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("Price Range")).toBeInTheDocument();
      expect(screen.getByText("Brand")).toBeInTheDocument();
      expect(screen.getByText("Minimum Rating")).toBeInTheDocument();
    });

    it("renders category checkboxes with product counts", () => {
      render(
        <FilterSidebar
          categories={categories}
          filters={defaultFilters}
          onFilterChange={() => {}}
          onReset={() => {}}
          allBrands={brands}
        />,
      );
      expect(screen.getByText("Cement")).toBeInTheDocument();
      expect(screen.getByText("(45)")).toBeInTheDocument();
      expect(screen.getByText("Bricks")).toBeInTheDocument();
      expect(screen.getByText("(32)")).toBeInTheDocument();
    });

    it("renders brand radio buttons", () => {
      render(
        <FilterSidebar
          categories={categories}
          filters={defaultFilters}
          onFilterChange={() => {}}
          onReset={() => {}}
          allBrands={brands}
        />,
      );
      expect(screen.getByText("BrandA")).toBeInTheDocument();
      expect(screen.getByText("BrandB")).toBeInTheDocument();
    });

    it("shows price range inputs", () => {
      render(
        <FilterSidebar
          categories={categories}
          filters={{ ...defaultFilters, minPrice: 10000, maxPrice: 500000 }}
          onFilterChange={() => {}}
          onReset={() => {}}
          allBrands={brands}
        />,
      );
      const minInput = screen.getByPlaceholderText("Min") as HTMLInputElement;
      const maxInput = screen.getByPlaceholderText("Max") as HTMLInputElement;
      expect(minInput.value).toBe("10000");
      expect(maxInput.value).toBe("500000");
    });

    it("shows Reset All button when filters are active", () => {
      render(
        <FilterSidebar
          categories={categories}
          filters={{ ...defaultFilters, brand: "BrandA" }}
          onFilterChange={() => {}}
          onReset={() => {}}
          allBrands={brands}
        />,
      );
      expect(screen.getByText("Reset All")).toBeInTheDocument();
    });

    it("hides Reset All when no filters active", () => {
      render(
        <FilterSidebar
          categories={categories}
          filters={defaultFilters}
          onFilterChange={() => {}}
          onReset={() => {}}
          allBrands={brands}
        />,
      );
      expect(screen.queryByText("Reset All")).toBeNull();
    });

    it("checks the correct category checkbox", () => {
      render(
        <FilterSidebar
          categories={categories}
          filters={{ ...defaultFilters, categoryId: "cat-1" }}
          onFilterChange={() => {}}
          onReset={() => {}}
          allBrands={brands}
        />,
      );
      const checkbox = screen.getByLabelText(/Cement/) as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it("renders as desktop aside (not drawer) when mobile not set", () => {
      render(
        <FilterSidebar
          categories={categories}
          filters={defaultFilters}
          onFilterChange={() => {}}
          onReset={() => {}}
          allBrands={brands}
        />,
      );
      // desktop: <aside>
      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });
  });

  describe("mobile mode", () => {
    it("renders as fixed drawer with close and backdrop", () => {
      render(
        <FilterSidebar
          categories={categories}
          filters={defaultFilters}
          onFilterChange={() => {}}
          onReset={() => {}}
          allBrands={brands}
          mobile
          onClose={() => {}}
        />,
      );
      expect(screen.getByLabelText("Close filters")).toBeInTheDocument();
    });
  });

  describe("callbacks", () => {
    it("calls onFilterChange when checking a category", async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();
      render(
        <FilterSidebar
          categories={categories}
          filters={defaultFilters}
          onFilterChange={onFilterChange}
          onReset={() => {}}
          allBrands={brands}
        />,
      );
      await user.click(screen.getByLabelText(/Cement/));
      expect(onFilterChange).toHaveBeenCalledWith({ categoryId: "cat-1" });
    });

    it("calls onReset from Reset All button", async () => {
      const user = userEvent.setup();
      const onReset = vi.fn();
      render(
        <FilterSidebar
          categories={categories}
          filters={{ ...defaultFilters, brand: "BrandA" }}
          onFilterChange={() => {}}
          onReset={onReset}
          allBrands={brands}
        />,
      );
      await user.click(screen.getByText("Reset All"));
      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });
});
