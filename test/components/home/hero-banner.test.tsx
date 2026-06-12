import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import HeroBanner from "@/components/home/HeroBanner";
import type { HeroBanner as HeroBannerType } from "@/domain/entities";

const banners: HeroBannerType[] = [
  { id: "b1", title: "Sale Banner", subtitle: "Up to 50% off", image: "/b1.jpg", link: "/sale", cta: "Shop" },
  { id: "b2", title: "New Tools", subtitle: "Check them out", image: "/b2.jpg", link: "/tools", cta: "Explore" },
];

describe("HeroBanner", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders loading skeleton", () => {
    render(<HeroBanner banners={[]} loading />);
    expect(document.querySelector(".animate-pulse")).toBeTruthy();
  });

  it("renders loading skeleton when banners empty and not loading", () => {
    render(<HeroBanner banners={[]} />);
    expect(document.querySelector(".animate-pulse")).toBeTruthy();
  });

  it("renders the first banner title", () => {
    render(<HeroBanner banners={banners} />);
    expect(screen.getByText("Sale Banner")).toBeInTheDocument();
  });

  it("renders the banner subtitle", () => {
    render(<HeroBanner banners={banners} />);
    expect(screen.getByText("Up to 50% off")).toBeInTheDocument();
  });

  it("renders the CTA with correct link", () => {
    render(<HeroBanner banners={banners} />);
    const cta = screen.getByText("Shop");
    expect(cta.closest("a")).toHaveAttribute("href", "/sale");
  });

  it("shows navigation arrows on hover (single banner has no arrows)", () => {
    render(<HeroBanner banners={banners} />);
    // multi-banner: arrows exist
    expect(screen.getByLabelText("Previous banner")).toBeInTheDocument();
    expect(screen.getByLabelText("Next banner")).toBeInTheDocument();
  });

  it("does not show arrows for single banner", () => {
    render(<HeroBanner banners={[banners[0]]} />);
    expect(screen.queryByLabelText("Previous banner")).toBeNull();
    expect(screen.queryByLabelText("Next banner")).toBeNull();
  });

  it("auto-rotates banners every 5s", () => {
    render(<HeroBanner banners={banners} />);
    expect(screen.getByText("Sale Banner")).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(5000); });
    expect(screen.getByText("New Tools")).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(5000); });
    expect(screen.getByText("Sale Banner")).toBeInTheDocument();
  });

  it("does not auto-rotate when only one banner", () => {
    render(<HeroBanner banners={[banners[0]]} />);
    act(() => { vi.advanceTimersByTime(10000); });
    expect(screen.getByText("Sale Banner")).toBeInTheDocument();
  });

  it("shows carousel indicators", () => {
    render(<HeroBanner banners={banners} />);
    expect(screen.getByLabelText("Go to banner 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to banner 2")).toBeInTheDocument();
  });
});
