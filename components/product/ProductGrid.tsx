import type { Product } from "@/domain/entities";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  title?: string;
}

export default function ProductGrid({
  products,
  loading,
  title,
}: ProductGridProps) {
  if (loading) {
    return (
      <section>
        {title && (
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section>
        {title && (
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            {title}
          </h2>
        )}
        <div className="text-center py-12 text-text-secondary">
          <p>No products found.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {title && (
        <h2 className="text-2xl font-bold text-text-primary mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
