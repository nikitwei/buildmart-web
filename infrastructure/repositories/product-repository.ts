import { apiGet } from "../api-client";
import type { Product, SearchFilters } from "@/domain/entities";
import type { IProductRepository } from "@/domain/repository-interfaces";
import { productMatchesFilters } from "./filter-utils";

export class ProductRepository implements IProductRepository {
  private basePath = "/data/products.json";
  private productsCache: Product[] | null = null;

  private async getAll(): Promise<Product[]> {
    if (!this.productsCache) {
      this.productsCache = await apiGet<Product[]>(this.basePath);
    }
    return this.productsCache;
  }

  invalidateCache(): void {
    this.productsCache = null;
  }

  async getById(id: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find((p) => p.id === id) ?? null;
  }

  async getByCategory(
    categorySlug: string,
    filters: SearchFilters,
  ): Promise<{ products: Product[]; total: number }> {
    const all = await this.getAll();

    const slugToCategoryId: Record<string, string> = {
      "cement-mortar": "cat-1",
      "bricks-blocks": "cat-2",
      "lumber-plywood": "cat-3",
      roofing: "cat-4",
      "paint-coatings": "cat-5",
      "tools-hardware": "cat-6",
      plumbing: "cat-7",
      electrical: "cat-8",
    };

    const catId = slugToCategoryId[categorySlug];
    if (!catId) return { products: [], total: 0 };

    const filtered = all.filter(
      (p) => p.categoryId === catId && productMatchesFilters(p, filters),
    );
    return this.paginateAndSort(filtered, filters);
  }

  async search(
    filters: SearchFilters,
  ): Promise<{ products: Product[]; total: number }> {
    const all = await this.getAll();
    const q = filters.query.toLowerCase();

    const filtered = all.filter((p) => {
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.brand.toLowerCase().includes(q) &&
        !p.description.toLowerCase().includes(q)
      )
        return false;
      return productMatchesFilters(p, filters);
    });

    return this.paginateAndSort(filtered, filters);
  }

  async getBestSellers(limit = 8): Promise<Product[]> {
    const all = await this.getAll();
    return all
      .filter((p) => p.isBestSeller)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  async getNewArrivals(limit = 8): Promise<Product[]> {
    const all = await this.getAll();
    return all
      .filter((p) => p.isNew)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  }

  async getByIds(ids: string[]): Promise<Product[]> {
    const all = await this.getAll();
    const idSet = new Set(ids);
    return all.filter((p) => idSet.has(p.id));
  }

  private paginateAndSort(
    products: Product[],
    filters: SearchFilters,
  ): { products: Product[]; total: number } {
    const sorted = [...products];

    switch (filters.sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );
        break;
      default:
        break; // relevance — keep original order
    }

    const total = sorted.length;
    const start = (filters.page - 1) * filters.pageSize;
    const paginated = sorted.slice(start, start + filters.pageSize);

    return { products: paginated, total };
  }
}
