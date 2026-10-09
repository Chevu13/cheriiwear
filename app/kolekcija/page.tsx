import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, products, type CategoryId } from "@/lib/products";

export const metadata: Metadata = {
  title: "Kolekcija",
  description: "Kompleti, topovi i helanke CHÉRI WEAR u crnoj, sivoj i lila boji.",
};

export default async function Kolekcija({ searchParams }: { searchParams: Promise<{ kategorija?: string }> }) {
  const { kategorija } = await searchParams;
  const active = kategorija && kategorija in CATEGORIES ? (kategorija as CategoryId) : null;
  const list = active ? products.filter((x) => x.category === active) : products;
  const tabs: [string, string, boolean][] = [
    ["/kolekcija", "Sve", !active],
    ...Object.entries(CATEGORIES).map(([id, name]): [string, string, boolean] => [
      `/kolekcija?kategorija=${id}`,
      name,
      id === active,
    ]),
  ];

  return (
    <div className="wrap pt-10 pb-24 md:pt-16 md:pb-36">
      <h1 className="display text-7xl md:text-9xl">{active ? CATEGORIES[active] : "Kolekcija"}</h1>
      <p className="mt-4 max-w-lg text-lg">
        Jedan kroj u tri boje. Uzmi ceo komplet ili spoji top i helanke po svojoj meri.
      </p>

      <div className="mt-8 mb-8 flex items-center justify-between gap-4 border-y border-line md:mb-12">
        <nav aria-label="Kategorije" className="snap-row -mx-1 gap-1">
          {tabs.map(([href, label, on]) => (
            <Link
              key={href}
              href={href}
              scroll={false}
              aria-current={on ? "page" : undefined}
              className="px-3 py-4 text-[0.9375rem] font-medium decoration-cherry decoration-2 underline-offset-8 hover:underline aria-[current]:underline"
            >
              {label}
            </Link>
          ))}
        </nav>
        <p className="hidden shrink-0 text-sm text-mute sm:block">Proizvoda: {list.length}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-6 md:gap-y-14 lg:grid-cols-3">
        {list.map((product, i) => (
          <ProductCard key={product.slug} product={product} priority={i < 2} />
        ))}
      </div>
    </div>
  );
}
