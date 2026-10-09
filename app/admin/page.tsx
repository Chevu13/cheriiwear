"use client";

import Image from "next/image";
import Link from "next/link";
import { useHydrated } from "@/lib/cart";
import { clearOrders, setStatus, useOrders } from "@/lib/orders";
import { COLORS, SIZES, formatPrice, getProduct, products } from "@/lib/products";

const when = new Intl.DateTimeFormat("sr-Latn-RS", { dateStyle: "medium", timeStyle: "short" });

export default function Admin() {
  const orders = useOrders();
  const hydrated = useHydrated();
  if (!hydrated) return <div className="min-h-[70svh]" />;

  const fresh = orders.filter((o) => o.status === "nova").length;
  const stats = [
    ["Porudžbine", String(orders.length)],
    ["Nove", String(fresh)],
    ["Promet", formatPrice(orders.reduce((n, o) => n + o.total, 0))],
  ];

  return (
    <div className="wrap pt-10 pb-24 md:pt-16 md:pb-32">
      <h1 className="display text-6xl md:text-8xl">Admin</h1>
      <p className="mt-4 max-w-2xl text-lg">
        Demo prikaz onoga što bi CHÉRI WEAR videla umesto Instagram poruka. Porudžbine sa demo forme stižu ovde i čuvaju
        se samo u ovom pregledaču.
      </p>

      <dl className="mt-10 grid grid-cols-3 border-y border-line">
        {stats.map(([label, value]) => (
          <div key={label} className="border-l border-line px-4 py-5 first:border-l-0 first:pl-0">
            <dt className="text-sm text-mute">{label}</dt>
            <dd className="display mt-1 text-3xl tabular-nums md:text-5xl">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-14" aria-labelledby="porudzbine">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 id="porudzbine" className="display text-4xl md:text-5xl">
            Porudžbine
          </h2>
          {orders.length > 0 ? (
            <button
              type="button"
              className="link py-2 text-sm text-mute"
              onClick={() => confirm("Obrisati sve demo porudžbine iz ovog pregledača?") && clearOrders()}
            >
              Obriši demo porudžbine
            </button>
          ) : null}
        </div>

        {orders.length === 0 ? (
          <div className="border border-line bg-paper p-6 md:p-8">
            <p className="text-lg">Još nema porudžbina. Dodaj komplet u korpu i pošalji demo porudžbinu, pojaviće se ovde.</p>
            <Link href="/kolekcija" className="btn mt-5">
              Napravi probnu porudžbinu
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => {
              const c = order.customer;
              const sent = order.status === "poslata";
              return (
                <li key={order.id} className="border border-line bg-paper p-5 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold">
                      {order.id}
                      <span className="ml-3 font-normal text-mute">{when.format(new Date(order.date))}</span>
                    </p>
                    <span className={`px-2.5 py-1 text-sm font-semibold ${sent ? "bg-line" : "bg-blush text-cherry"}`}>
                      {sent ? "Poslata" : "Nova"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-6 md:grid-cols-2">
                    <ul className="divide-y divide-line border-y border-line">
                      {order.lines.map((line) => {
                        const product = getProduct(line.slug);
                        return (
                          <li key={line.slug + line.size} className="flex justify-between gap-4 py-2.5">
                            <span className="min-w-0 break-words">
                              {line.qty} × {product?.name ?? line.slug}
                              {product ? `, ${COLORS[product.color].name.toLowerCase()}` : ""}, {line.size}
                            </span>
                            <span className="shrink-0 tabular-nums">
                              {product ? formatPrice(product.price * line.qty) : ""}
                            </span>
                          </li>
                        );
                      })}
                      <li className="flex justify-between gap-4 py-2.5 font-semibold">
                        <span>Ukupno</span>
                        <span className="tabular-nums">{formatPrice(order.total)}</span>
                      </li>
                    </ul>
                    <address className="min-w-0 space-y-1 break-words not-italic">
                      <p className="font-semibold">{c.name}</p>
                      <p>
                        {c.address}, {c.zip} {c.city}
                      </p>
                      <p>{c.tel}</p>
                      <p>{c.email}</p>
                      {c.note ? <p className="pt-1 text-mute">Napomena: {c.note}</p> : null}
                    </address>
                  </div>

                  <button
                    type="button"
                    className="btn btn-quiet mt-5 min-h-11"
                    onClick={() => setStatus(order.id, sent ? "nova" : "poslata")}
                  >
                    {sent ? "Vrati u nove" : "Označi kao poslatu"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-16" aria-labelledby="proizvodi">
        <h2 id="proizvodi" className="display mb-5 text-4xl md:text-5xl">
          Proizvodi
        </h2>
        <ul className="divide-y divide-line border-y border-line">
          {products.map((product) => (
            <li key={product.slug} className="flex items-center gap-4 py-3">
              <div className="relative aspect-[4/5] w-14 shrink-0 bg-blush-soft">
                <Image src={product.photos[0].src} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {product.name}, {COLORS[product.color].name.toLowerCase()}
                </p>
                <p className="text-sm text-mute">Veličine: {SIZES.join(", ")}</p>
              </div>
              <p className="shrink-0 tabular-nums">{formatPrice(product.price)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-2xl text-sm text-mute">
          U demo verziji proizvodi se samo prikazuju. Na pravom sajtu ovde se menjaju cene, slike, veličine i stanje na
          lageru, uz prijavu lozinkom.
        </p>
      </section>
    </div>
  );
}
