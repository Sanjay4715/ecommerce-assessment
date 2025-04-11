import { Star } from "lucide-react";

type RatingProps = {
  value: number; // e.g., 3.9
};

export const Rating = ({ value }: RatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starFill =
          i + 1 <= value ? 100 : i < value ? Math.round((value - i) * 100) : 0;

        return (
          <div key={i} className="relative w-4 h-4">
            {/* Base gray star */}
            <Star className="text-muted-foreground absolute" size={16} />

            {/* Filled star clipped to percentage */}
            {starFill > 0 && (
              <div
                className="absolute overflow-hidden h-full"
                style={{ width: `${starFill}%` }}
              >
                <Star
                  className="text-[var(--site-primary)] fill-[var(--site-primary)]"
                  size={16}
                />
              </div>
            )}
          </div>
        );
      })}
      <span className="text-sm text-muted-foreground ml-2">
        {value.toFixed(1)}
      </span>
    </div>
  );
};
