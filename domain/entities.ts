export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brand: string;
  sku: string;
  price: number;
  originalPrice?: number;
  stock: number;
  unit: string;
  weight: number;
  images: string[];
  rating: number;
  reviewCount: number;
  isBestSeller: boolean;
  isNew: boolean;
  tags: string[];
  specifications: Record<string, string>;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  maxStock: number;
  unit: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  cta: string;
}

export interface SearchFilters {
  query: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  minRating?: number;
  sortBy: "relevance" | "price-asc" | "price-desc" | "rating" | "newest";
  page: number;
  pageSize: number;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
