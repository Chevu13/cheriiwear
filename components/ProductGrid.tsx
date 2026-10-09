"use client";

import { useCatalog } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

/** The current catalog as cards, optionally without one product (used on its own page). */
export function ProductGrid({ exclude, priority }: { exclude?: string; priority?: boolean }) {
  const list = useCatalog().filter((x) => x.slug !== exclude);
  if (list.length === 0) return <p className="text-lg text-mute">Trenutno nema drugih artikala.</p>;
  return (
    <div className="reveal-grid grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-6 md:gap-y-14 lg:grid-cols-3">
      {list.map((product, i) => (
        <ProductCard key={product.slug} product={product} priority={priority && i < 2} />
      ))}
    </div>
  );
}
