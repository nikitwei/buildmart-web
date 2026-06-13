import { describe, it, expect, vi, beforeEach } from "vitest";
import { CategoryRepository } from "@/infrastructure/repositories/category-repository";
import type { Category } from "@/domain/entities";

const categories: Category[] = [
  { id: "cat-1", name: "Cement & Mortar", slug: "cement-mortar", icon: "package", image: "/cat1.jpg", productCount: 45 },
  { id: "cat-2", name: "Bricks & Blocks", slug: "bricks-blocks", icon: "box", image: "/cat2.jpg", productCount: 32 },
  { id: "cat-6", name: "Tools & Hardware", slug: "tools-hardware", icon: "wrench", image: "/cat6.jpg", productCount: 120 },
];

function mockFetch(data: unknown) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

describe("CategoryRepository", () => {
  let repo: CategoryRepository;

  beforeEach(() => {
    repo = new CategoryRepository();
    repo.invalidateCache();
    mockFetch(categories);
  });

  describe("getAll", () => {
    it("returns all categories", async () => {
      const result = await repo.getAll();
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("Cement & Mortar");
    });
  });

  describe("getBySlug", () => {
    it("returns a category by slug", async () => {
      const result = await repo.getBySlug("tools-hardware");
      expect(result).not.toBeNull();
      expect(result!.name).toBe("Tools & Hardware");
      expect(result!.productCount).toBe(120);
    });

    it("returns null for unknown slug", async () => {
      const result = await repo.getBySlug("non-existent");
      expect(result).toBeNull();
    });
  });

  describe("caching", () => {
    it("caches and fetches only once for multiple calls", async () => {
      mockFetch(categories);
      await repo.getAll();
      await repo.getBySlug("bricks-blocks");
      await repo.getAll();
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("invalidates cache so next call fetches fresh", async () => {
      mockFetch(categories);
      await repo.getAll();
      repo.invalidateCache();
      await repo.getAll();
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
