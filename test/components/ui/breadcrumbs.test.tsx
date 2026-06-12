import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders the home link always", () => {
    render(<Breadcrumbs items={[]} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders a single crumb item as current page", () => {
    render(<Breadcrumbs items={[{ label: "Products" }]} />);
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("renders a single item as text (always last, so not a link)", () => {
    render(
      <Breadcrumbs
        items={[{ label: "Products", href: "/products" }]}
      />,
    );
    const el = screen.getByText("Products");
    expect(el.closest("a")).toBeNull();
  });

  it("renders last item as text (not link)", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Products", href: "/products" },
          { label: "Cement A" },
        ]}
      />,
    );
    const last = screen.getByText("Cement A");
    expect(last.closest("a")).toBeNull();
  });

  it("renders intermediate items as links", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Tools & Hardware", href: "/categories/tools-hardware" },
          { label: "Drill Pro" },
        ]}
      />,
    );
    expect(screen.getByText("Tools & Hardware")).toBeInTheDocument();
    const toolsLink = screen.getByText("Tools & Hardware");
    expect(toolsLink.closest("a")).toHaveAttribute("href", "/categories/tools-hardware");

    const drillEl = screen.getByText("Drill Pro");
    expect(drillEl.closest("a")).toBeNull();
  });
});
