import type { Metadata } from "next";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Kolekcija",
  description: "CHÉRI WEAR kompleti u crnoj, sivoj i lila boji.",
};

export default function Kolekcija() {
  return (
    <div className="wrap pt-10 pb-24 md:pt-16 md:pb-36">
      <h1 className="display text-7xl md:text-9xl">Kolekcija</h1>
      <p className="mt-4 mb-10 max-w-lg text-lg md:mb-14">
        Jedan kroj u tri boje. Veličinu biraš posebno za top, posebno za helanke.
      </p>
      <ProductGrid priority />
    </div>
  );
}
