import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SortToolbar from "@/components/filters/SortToolbar";
import type { SearchFilters } from "@/domain/entities";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
];

describe("SortToolbar", () => {
  it("renders total count with correct pluralization", () => {
    render(
      <SortToolbar total={42} sortBy="relevance" onSortChange={() => {}} onMobileFilterOpen={() => {}} />,
    );
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText(/products found/)).toBeInTheDocument();
  });

  it("uses singular for 1 product", () => {
    render(
      <SortToolbar total={1} sortBy="relevance" onSortChange={() => {}} onMobileFilterOpen={() => {}} />,
    );
    // The text is split across elements: <span>1</span> product found
    expect(screen.getByText("product found")).toBeInTheDocument();
  });

  it("renders all sort options", () => {
    render(
      <SortToolbar total={10} sortBy="relevance" onSortChange={() => {}} onMobileFilterOpen={() => {}} />,
    );
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option"));
    expect(options.map((o) => o.textContent)).toEqual(sortOptions.map((o) => o.label));
  });

  it("selects the current sort value", () => {
    render(
      <SortToolbar total={10} sortBy="price-asc" onSortChange={() => {}} onMobileFilterOpen={() => {}} />,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("price-asc");
  });

  it("shows filter button", () => {
    render(
      <SortToolbar total={10} sortBy="relevance" onSortChange={() => {}} onMobileFilterOpen={() => {}} />,
    );
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });
});
