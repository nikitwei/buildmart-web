import { Product, Category, HeroBanner, SearchFilters } from "./entities";

export interface IProductRepository {
  getById(id: string): Promise<Product | null>;
  getByCategory(
    categorySlug: string,
    filters: SearchFilters,
  ): Promise<{ products: Product[]; total: number }>;
  search(
    filters: SearchFilters,
  ): Promise<{ products: Product[]; total: number }>;
  getBestSellers(limit?: number): Promise<Product[]>;
  getNewArrivals(limit?: number): Promise<Product[]>;
  getByIds(ids: string[]): Promise<Product[]>;
}

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getBySlug(slug: string): Promise<Category | null>;
}

export interface IHeroBannerRepository {
  getAll(): Promise<HeroBanner[]>;
}
