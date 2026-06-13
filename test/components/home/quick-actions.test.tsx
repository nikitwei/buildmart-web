import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import QuickActions from "@/components/home/QuickActions";

describe("QuickActions", () => {
  it("renders all four actions", () => {
    render(<QuickActions />);
    expect(screen.getByText("Track Order")).toBeInTheDocument();
    expect(screen.getByText("Bulk Quote")).toBeInTheDocument();
    expect(screen.getByText("Invoices")).toBeInTheDocument();
    expect(screen.getByText("Send Feedback")).toBeInTheDocument();
  });

  it("renders each action as a link", () => {
    render(<QuickActions />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "#");
    });
  });
});
