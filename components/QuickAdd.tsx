"use client";

import { addToCart } from "@/lib/cart";
import { SIZES, sizeLabel } from "@/lib/products";

export function QuickAdd({ slug, name, parts }: { slug: string; name: string; parts: readonly string[] }) {
  return (
    <div
      className="mt-3 grid grid-cols-5 border border-line"
      role="group"
      aria-label={`Brzo dodaj u korpu: ${name}`}
    >
      {SIZES.map((size) => (
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
          className="h-10 border-l border-line text-sm font-medium transition-colors first:border-l-0 hover:bg-ink hover:text-ivory"
        >
          {size}
        </button>
      ))}
    </div>
  );
}
