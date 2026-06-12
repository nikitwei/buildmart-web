import { describe, it, expect } from "vitest";
import uiReducer, {
  addToast,
  removeToast,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleFilterDrawer,
  setFilterDrawerOpen,
} from "@/redux/slices/ui-slice";

describe("ui slice", () => {
  it("returns initial state", () => {
    const state = uiReducer(undefined, { type: "unknown" });
    expect(state.toasts).toEqual([]);
    expect(state.mobileMenuOpen).toBe(false);
    expect(state.filterDrawerOpen).toBe(false);
  });

  describe("toasts", () => {
    it("adds a toast with an auto-generated id", () => {
      const state = uiReducer(
        undefined,
        addToast({ type: "success", message: "Item added!" }),
      );
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].type).toBe("success");
      expect(state.toasts[0].message).toBe("Item added!");
      expect(state.toasts[0].id).toBeDefined();
    });

    it("stacks multiple toasts", () => {
      const first = uiReducer(
        undefined,
        addToast({ type: "info", message: "Toast 1" }),
      );
      expect(first.toasts).toHaveLength(1);

      const second = uiReducer(first, addToast({ type: "error", message: "Toast 2" }));
      expect(second.toasts).toHaveLength(2);
      expect(second.toasts[0].message).toBe("Toast 1");
      expect(second.toasts[1].message).toBe("Toast 2");
    });

    it("removes a toast by id", () => {
      const first = uiReducer(
        undefined,
        addToast({ type: "success", message: "Hello" }),
      );
      const id = first.toasts[0].id;
      const state = uiReducer(first, removeToast(id));
      expect(state.toasts).toHaveLength(0);
    });
  });

  describe("mobile menu", () => {
    it("toggles mobile menu", () => {
      const state = uiReducer(undefined, toggleMobileMenu());
      expect(state.mobileMenuOpen).toBe(true);

      const toggled = uiReducer(state, toggleMobileMenu());
      expect(toggled.mobileMenuOpen).toBe(false);
    });

    it("sets mobile menu to a specific value", () => {
      const state = uiReducer(undefined, setMobileMenuOpen(false));
      expect(state.mobileMenuOpen).toBe(false);

      const opened = uiReducer(state, setMobileMenuOpen(true));
      expect(opened.mobileMenuOpen).toBe(true);
    });
  });

  describe("filter drawer", () => {
    it("toggles filter drawer", () => {
      const state = uiReducer(undefined, toggleFilterDrawer());
      expect(state.filterDrawerOpen).toBe(true);
    });

    it("sets filter drawer to a specific value", () => {
      const state = uiReducer(undefined, setFilterDrawerOpen(false));
      expect(state.filterDrawerOpen).toBe(false);
    });
  });
});
