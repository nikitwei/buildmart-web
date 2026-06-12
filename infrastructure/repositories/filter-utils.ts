import type { Product, SearchFilters } from "@/domain/entities";

export function productMatchesFilters(
  product: Product,
  filters: SearchFilters,
): boolean {
  if (filters.categoryId && product.categoryId !== filters.categoryId)
    return false;
  if (filters.minPrice !== undefined && product.price < filters.minPrice)
    return false;
  if (filters.maxPrice !== undefined && product.price > filters.maxPrice)
    return false;
  if (filters.brand && product.brand !== filters.brand) return false;
  if (filters.minRating !== undefined && product.rating < filters.minRating)
    return false;
  return true;
}
