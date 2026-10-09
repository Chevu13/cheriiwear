"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CartLines } from "@/components/CartLines";
import { cartTotal, clearCart, useCart, useHydrated, type Line } from "@/lib/cart";
import { CUSTOMER_FIELDS, addOrder, type Customer } from "@/lib/orders";
import { findProduct } from "@/lib/catalog";
import { COLORS, formatPrice } from "@/lib/products";

function Field({ label, className = "", ...input }: { label: string } & React.ComponentProps<"input">) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input className="field" required {...input} />
    </label>
  );
}

export default function Checkout() {
  const lines = useCart();
  const hydrated = useHydrated();
  const [placed, setPlaced] = useState<Line[] | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (placed) doneRef.current?.focus();
  }, [placed]);

  if (!hydrated) return <div className="min-h-[70svh]" />;

  if (placed) {
    return (
      <div className="wrap py-16 md:py-24">
        <div className="max-w-2xl">
        <h1 ref={doneRef} tabIndex={-1} className="display text-6xl text-cherry md:text-8xl">
          Hvala na porudžbini.
        </h1>
        <p className="mt-6 text-lg leading-relaxed">
          Ovo je bila demo porudžbina. Ništa nije poslato niti naplaćeno, a podaci su sačuvani samo u ovom pregledaču.
          Na pravom sajtu kupac ovde dobija potvrdu, a CHÉRI WEAR porudžbinu sa svim detaljima, bez dopisivanja.{" "}
          <Link href="/admin" className="link font-semibold">
            Pogledaj kako porudžbina izgleda u adminu
          </Link>
        </p>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {placed.map((line) => {
            const product = findProduct(line.slug);
            if (!product) return null;
            return (
              <li key={line.slug + line.size} className="flex justify-between gap-4 py-3">
                <span>
                  {line.qty} × {product.name}, {COLORS[product.color].name.toLowerCase()}, {line.size}
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(product.price * line.qty)}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 flex justify-between text-lg font-semibold">
          <span>Ukupno</span>
          <span className="tabular-nums">{formatPrice(cartTotal(placed))}</span>
        </p>
        <Link href="/kolekcija" className="btn mt-10">
          Nazad na kolekciju
        </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="wrap min-h-[60svh] py-16 md:py-24">
        <h1 className="display text-6xl md:text-8xl">Korpa je prazna</h1>
        <p className="mt-5 text-lg">Dodaj komplet, top ili helanke, pa se vrati ovde da završiš porudžbinu.</p>
        <Link href="/kolekcija" className="btn mt-8">
          Pogledaj kolekciju
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap pt-10 pb-24 md:pt-16 md:pb-32">
      <h1 className="display text-6xl md:text-8xl">Porudžbina</h1>
      <div className="mt-8 grid gap-x-16 gap-y-10 md:mt-12 lg:grid-cols-[1fr_26rem]">
        <section aria-labelledby="pregled" className="lg:order-2">
          <div className="border border-line bg-paper p-5 lg:sticky lg:top-24">
            <h2 id="pregled" className="text-lg font-semibold">
              Pregled porudžbine
            </h2>
            <CartLines lines={lines} />
            <dl className="space-y-2 border-t border-line pt-4">
              <div className="flex justify-between">
                <dt>Međuzbir</dt>
                <dd className="tabular-nums">{formatPrice(cartTotal(lines))}</dd>
              </div>
              <div className="flex justify-between gap-6 text-mute">
                <dt>Dostava</dt>
                <dd className="text-right">Cenu dostave dodaje brend</dd>
              </div>
              <div className="flex justify-between pt-2 text-xl font-semibold">
                <dt>Ukupno</dt>
                <dd className="tabular-nums">{formatPrice(cartTotal(lines))}</dd>
              </div>
            </dl>
          </div>
        </section>

        <form
          className="space-y-10"
          onSubmit={(e) => {
            e.preventDefault(); // demo: nothing leaves the browser
            const form = new FormData(e.currentTarget);
            const customer = Object.fromEntries(
              CUSTOMER_FIELDS.map((field) => [field, String(form.get(field) ?? "").trim()]),
            ) as Customer;
            addOrder(customer, lines, cartTotal(lines));
            setPlaced(lines);
            clearCart();
            window.scrollTo(0, 0);
          }}
        >
          <fieldset>
            <legend className="mb-4 text-lg font-semibold">Kontakt</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ime i prezime" name="name" autoComplete="name" className="sm:col-span-2" />
              <Field label="Telefon" name="tel" type="tel" inputMode="tel" autoComplete="tel" />
              <Field label="E-mail" name="email" type="email" autoComplete="email" spellCheck={false} />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 text-lg font-semibold">Adresa za dostavu</legend>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Ulica i broj" name="address" autoComplete="street-address" className="sm:col-span-3" />
              <Field label="Grad" name="city" autoComplete="address-level2" className="sm:col-span-2" />
              <Field label="Poštanski broj" name="zip" inputMode="numeric" autoComplete="postal-code" />
            </div>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium">Napomena (opciono)</span>
              <textarea name="note" rows={3} className="field" />
            </label>
          </fieldset>

          <fieldset>
            <legend className="mb-4 text-lg font-semibold">Plaćanje</legend>
            <div className="space-y-2">
              <label className="flex items-center gap-3 border border-line bg-paper p-4 has-checked:border-ink">
                <input type="radio" name="payment" value="pouzece" defaultChecked className="size-4 accent-cherry" />
                <span className="font-medium">Plaćanje pouzećem</span>
              </label>
              <label className="flex items-center gap-3 border border-line p-4 text-mute">
                <input type="radio" name="payment" value="kartica" disabled className="size-4" />
                <span>Platnom karticom (nije uključeno u demo)</span>
              </label>
            </div>
          </fieldset>

          <div>
            <button type="submit" className="btn w-full justify-between">
              <span>Pošalji demo porudžbinu</span>
              <span className="tabular-nums">{formatPrice(cartTotal(lines))}</span>
            </button>
            <p className="mt-3 text-sm text-mute">
              Demo: porudžbina se ne šalje i ništa se ne naplaćuje. Podaci se čuvaju samo u tvom pregledaču, da bi se videli u demo adminu.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
