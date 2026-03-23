"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export function StarRating({ value, onChange, readonly = false }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => {
            if (onChange) {
              // Toggle off if clicking the same star
              onChange(value === star ? 0 : star);
            }
          }}
          className={`transition-transform ${
            readonly
              ? "cursor-default"
              : "cursor-pointer hover:scale-110"
          }`}
        >
          <Star
            className="w-5 h-5"
            fill={star <= value ? "#DAA520" : "transparent"}
            stroke={star <= value ? "#DAA520" : "#6b7280"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}
