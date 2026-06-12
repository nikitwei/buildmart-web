import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/utils";
import Button from "@/components/ui/Button";

describe("Badge", () => {
  it("renders children", async () => {
    const Badge = (await import("@/components/ui/Badge")).default;
    render(<Badge>SALE</Badge>);
    expect(screen.getByText("SALE")).toBeInTheDocument();
  });

  it("renders each variant without error", async () => {
    const Badge = (await import("@/components/ui/Badge")).default;
    const variants = ["sale", "new", "best", "eco", "out-of-stock", "low-stock"] as const;
    for (const variant of variants) {
      const { container } = render(<Badge variant={variant}>Test</Badge>);
      expect(container.firstChild).toBeTruthy();
    }
  });

  it("defaults variant to sale", async () => {
    const Badge = (await import("@/components/ui/Badge")).default;
    render(<Badge>Test</Badge>);
    const el = screen.getByText("Test");
    expect(el.className).toContain("bg-secondary");
  });
});

describe("StarRating", () => {
  it("renders 5 stars", async () => {
    const StarRating = (await import("@/components/ui/StarRating")).default;
    const { container } = render(<StarRating rating={3} />);
    const stars = container.querySelectorAll(".lucide-star");
    expect(stars.length).toBeGreaterThanOrEqual(5);
  });

  it("shows review count when provided", async () => {
    const StarRating = (await import("@/components/ui/StarRating")).default;
    render(<StarRating rating={4.5} reviewCount={42} />);
    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    expect(screen.getByText(/42/)).toBeInTheDocument();
  });

  it("renders without review count", async () => {
    const StarRating = (await import("@/components/ui/StarRating")).default;
    render(<StarRating rating={3.5} />);
    expect(screen.queryByText(/\(/)).not.toBeInTheDocument();
  });
});

describe("QuantitySelector", () => {
  it("shows the current value", async () => {
    const QuantitySelector = (await import("@/components/ui/QuantitySelector")).default;
    render(
      <QuantitySelector value={5} max={10} onChange={() => {}} />,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onChange with incremented value on plus click", async () => {
    const QuantitySelector = (await import("@/components/ui/QuantitySelector")).default;
    const user = userEvent.setup();
    let captured = 0;
    render(
      <QuantitySelector value={5} max={10} onChange={(v) => (captured = v)} />,
    );
    await user.click(screen.getByLabelText("Increase quantity"));
    expect(captured).toBe(6);
  });

  it("calls onChange with decremented value on minus click", async () => {
    const QuantitySelector = (await import("@/components/ui/QuantitySelector")).default;
    const user = userEvent.setup();
    let captured = 0;
    render(
      <QuantitySelector value={5} max={10} onChange={(v) => (captured = v)} />,
    );
    await user.click(screen.getByLabelText("Decrease quantity"));
    expect(captured).toBe(4);
  });

  it("disables minus when value equals min", async () => {
    const QuantitySelector = (await import("@/components/ui/QuantitySelector")).default;
    render(
      <QuantitySelector value={1} min={1} max={10} onChange={() => {}} />,
    );
    expect(screen.getByLabelText("Decrease quantity")).toBeDisabled();
  });

  it("disables plus when value equals max", async () => {
    const QuantitySelector = (await import("@/components/ui/QuantitySelector")).default;
    render(
      <QuantitySelector value={10} max={10} onChange={() => {}} />,
    );
    expect(screen.getByLabelText("Increase quantity")).toBeDisabled();
  });

  it("does not exceed max even if onChange fires", async () => {
    const QuantitySelector = (await import("@/components/ui/QuantitySelector")).default;
    const user = userEvent.setup();
    let captured = 0;
    render(
      <QuantitySelector value={10} max={10} onChange={(v) => (captured = v)} />,
    );
    await user.click(screen.getByLabelText("Increase quantity"));
    // button is disabled, so click should not trigger; captured stays 0
    expect(captured).toBe(0);
  });
});

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("shows spinner when loading", () => {
    render(<Button loading>Submit</Button>);
    const svg = document.querySelector("svg.animate-spin");
    expect(svg).toBeTruthy();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when loading or disabled prop", () => {
    const { rerender } = render(<Button loading>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();

    rerender(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies default variant classes", () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-primary");
  });

  it("applies secondary variant classes", () => {
    render(<Button variant="secondary">CTA</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-secondary");
  });

  it("applies size classes", () => {
    render(<Button size="lg">Large</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("px-6");
  });

  it("calls onClick", async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(<Button onClick={() => (clicked = true)}>Click</Button>);
    await user.click(screen.getByText("Click"));
    expect(clicked).toBe(true);
  });
});
