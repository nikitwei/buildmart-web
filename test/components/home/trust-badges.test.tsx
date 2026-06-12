import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TrustBadges from "@/components/home/TrustBadges";

describe("TrustBadges", () => {
  it("renders all four trust badges", () => {
    render(<TrustBadges />);
    expect(screen.getByText("Free Delivery")).toBeInTheDocument();
    expect(screen.getByText("Quality Guarantee")).toBeInTheDocument();
    expect(screen.getByText("Easy Returns")).toBeInTheDocument();
    expect(screen.getByText("24/7 Support")).toBeInTheDocument();
  });

  it("renders descriptions", () => {
    render(<TrustBadges />);
    expect(screen.getByText("On orders above Rp 500K")).toBeInTheDocument();
    expect(screen.getByText("100% authentic products")).toBeInTheDocument();
    expect(screen.getByText("7-day return policy")).toBeInTheDocument();
  });
});
