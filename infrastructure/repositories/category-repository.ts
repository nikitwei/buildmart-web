import { apiGet } from "../api-client";
import type { Category } from "@/domain/entities";
import type { ICategoryRepository } from "@/domain/repository-interfaces";

export class CategoryRepository implements ICategoryRepository {
  private basePath = "/data/categories.json";
  private cache: Category[] | null = null;

  private async loadAll(): Promise<Category[]> {
    if (!this.cache) {
      this.cache = await apiGet<Category[]>(this.basePath);
    }
    return this.cache;
  }

  invalidateCache(): void {
    this.cache = null;
  }

  async getAll(): Promise<Category[]> {
    return this.loadAll();
  }

  async getBySlug(slug: string): Promise<Category | null> {
    const categories = await this.loadAll();
    return categories.find((c) => c.slug === slug) ?? null;
  }
}
