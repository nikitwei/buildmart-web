import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
}

export default function StarRating({ rating, reviewCount }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < fullStars) {
            return (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-warning text-warning"
              />
            );
          }
          if (i === fullStars && hasHalf) {
            return (
              <div key={i} className="relative">
                <Star className="h-3.5 w-3.5 text-warning" />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                </div>
              </div>
            );
          }
          return (
            <Star key={i} className="h-3.5 w-3.5 text-border" />
          );
        })}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-text-secondary">
          {rating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  );
}
