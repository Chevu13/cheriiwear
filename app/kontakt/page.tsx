import type { Metadata } from "next";
import Image from "next/image";
import { INSTAGRAM } from "@/lib/products";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Piši nam na Instagramu: @cheriiwear.",
};

export default function Contact() {
  return (
    <section className="wrap grid gap-y-10 pt-10 pb-24 md:grid-cols-12 md:gap-x-6 md:pt-16 md:pb-36">
      <div className="md:col-span-6">
        <h1 className="display text-7xl md:text-9xl">Kontakt</h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed">
          Imaš pitanje o veličini, boji ili porudžbini? Najbrže ćemo ti odgovoriti na Instagramu.
        </p>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn mt-8">
          Piši nam na @cheriiwear
        </a>
        <dl className="mt-12 max-w-md divide-y divide-line border-y border-line">
          {["E-mail", "Telefon", "Radno vreme"].map((label) => (
            <div key={label} className="flex justify-between gap-6 py-3.5">
              <dt className="font-semibold whitespace-nowrap">{label}</dt>
              <dd className="text-right text-mute">Dodaje CHÉRI WEAR pre objave sajta</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative aspect-square bg-blush-soft md:col-span-5 md:col-start-8">
        <Image
          src="/images/lila-reformer.jpg"
          alt="Lila CHÉRI komplet na pilates reformeru"
          fill
          priority
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
