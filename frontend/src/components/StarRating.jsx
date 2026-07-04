import { Star } from "lucide-react";

export default function StarRating({ value = 0, size = 14, interactive = false, onChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
          aria-label={`${star} star`}
        >
          <Star
            size={size}
            className={
              star <= Math.round(value)
                ? "fill-[#D4AF37] text-[#D4AF37]"
                : "text-gray-700"
            }
          />
        </button>
      ))}
    </div>
  );
}