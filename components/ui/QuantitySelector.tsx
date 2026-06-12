"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
}

export default function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
  size = "md",
}: QuantitySelectorProps) {
  const btnSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const textSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className="inline-flex items-center border border-border rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${btnSize} flex items-center justify-center text-text-secondary hover:bg-primary-light hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        className={`${textSize} font-semibold w-10 text-center border-x border-border`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${btnSize} flex items-center justify-center text-text-secondary hover:bg-primary-light hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
