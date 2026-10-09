"use client";

import { addToCart } from "@/lib/cart";
import { sizeLabel } from "@/lib/products";

export function QuickAdd({
  slug,
  name,
  parts,
  sizes,
}: {
  slug: string;
  name: string;
  parts: readonly string[];
  sizes: readonly string[];
}) {
  return (
    <div
      className="mt-3 flex border border-line"
      role="group"
      aria-label={`Brzo dodaj u korpu: ${name}`}
    >
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          aria-label={`Dodaj veličinu ${size} u korpu`}
          onClick={() =>
            addToCart(
              slug,
              sizeLabel(
                parts,
                parts.map(() => size),
              ),
            )
          }
          className="h-10 flex-1 border-l border-line text-sm font-medium transition-colors first:border-l-0 hover:bg-ink hover:text-ivory active:bg-cherry active:text-ivory"
        >
          {size}
        </button>
      ))}
    </div>
  );
}
