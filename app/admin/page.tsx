"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useHydrated } from "@/lib/cart";
import { STATUSES, clearOrders, removeOrder, seedOrders, setStatus, useOrders, type Status } from "@/lib/orders";
import { findProduct } from "@/lib/catalog";
import { COLORS, formatPrice, type ColorId } from "@/lib/products";
import { ProductEditor } from "./ProductEditor";

const when = new Intl.DateTimeFormat("sr-Latn-RS", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const statusIds = Object.keys(STATUSES) as Status[];
const badge: Record<Status, string> = {
  nova: "bg-blush text-cherry",
  priprema: "bg-line text-ink",
  poslata: "bg-ink text-ivory",
};
const chip =
  "h-10 shrink-0 border border-line px-4 text-sm font-medium transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-ivory";

export default function Admin() {
  const orders = useOrders();
  const hydrated = useHydrated();
  const [filter, setFilter] = useState<Status | "sve">("sve");
  if (!hydrated) return <div className="min-h-[70svh]" />;

  const revenue = orders.reduce((n, o) => n + o.total, 0);
  const count = (status: Status) => orders.filter((o) => o.status === status).length;
  const shown = filter === "sve" ? orders : orders.filter((o) => o.status === filter);

  // pieces sold per colour, for the chart and the product list
  const sold = Object.fromEntries(Object.keys(COLORS).map((c) => [c, 0])) as Record<ColorId, number>;
  for (const order of orders) {
    for (const line of order.lines) {
      const product = findProduct(line.slug);
      if (product) sold[product.color] += line.qty;
    }
  }
  const most = Math.max(1, ...Object.values(sold));

  const stats = [
    ["Promet", formatPrice(revenue)],
    ["Porudžbine", String(orders.length)],
    ["Čekaju obradu", String(count("nova"))],
    ["Prosečna porudžbina", formatPrice(orders.length ? Math.round(revenue / orders.length) : 0)],
  ];

  return (
    <div className="bg-paper">
      <div className="wrap pt-8 pb-24 md:pt-12 md:pb-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-block bg-blush px-2.5 py-1 text-sm font-semibold text-cherry">Demo admin</p>
            <h1 className="display mt-3 text-6xl md:text-7xl">Pregled prodaje</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn min-h-11 px-5" onClick={seedOrders}>
              Ubaci probne porudžbine
            </button>
            {orders.length > 0 ? (
              <button
                type="button"
                className="btn btn-quiet min-h-11 px-5"
                onClick={() => confirm("Obrisati sve porudžbine iz ovog pregledača?") && clearOrders()}
              >
                Obriši sve
              </button>
            ) : null}
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(([label, value], i) => (
            <div key={label} className={`border p-4 md:p-6 ${i === 2 ? "border-cherry bg-blush-soft" : "border-line bg-ivory"}`}>
              <dt className="text-sm text-mute">{label}</dt>
              <dd className="display mt-2 text-3xl tabular-nums md:text-5xl">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_22rem]">
          <section className="border border-line bg-ivory p-4 md:p-6" aria-labelledby="porudzbine">
            <h2 id="porudzbine" className="display text-3xl md:text-4xl">
              Porudžbine
            </h2>
            <div className="snap-row mt-4 gap-2" role="group" aria-label="Filter po statusu">
              <button type="button" className={chip} aria-pressed={filter === "sve"} onClick={() => setFilter("sve")}>
                Sve ({orders.length})
              </button>
              {statusIds.map((id) => (
                <button key={id} type="button" className={chip} aria-pressed={filter === id} onClick={() => setFilter(id)}>
                  {STATUSES[id]} ({count(id)})
                </button>
              ))}
            </div>

            {shown.length === 0 ? (
              <div className="mt-6 border border-dashed border-line p-6 text-center">
                <p className="text-lg">
                  {orders.length === 0
                    ? "Još nema porudžbina. Ubaci probne ili napravi jednu kroz sajt."
                    : "Nema porudžbina sa ovim statusom."}
                </p>
                {orders.length === 0 ? (
                  <Link href="/kolekcija" className="link mt-3 inline-block py-2 font-semibold">
                    Napravi porudžbinu kroz sajt
                  </Link>
                ) : null}
              </div>
            ) : (
              <ul className="mt-4 border-t border-line">
                {shown.map((order) => {
                  const c = order.customer;
                  return (
                    <li key={order.id} className="border-b border-line">
                      <details className="group">
                        <summary className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 md:grid-cols-[7.5rem_1fr_8rem_7.5rem_1.5rem]">
                          <span className="font-semibold tabular-nums">{order.id}</span>
                          <span className="col-start-1 row-start-2 min-w-0 truncate text-mute md:col-start-2 md:row-start-1 md:text-ink">
                            {c.name}
                            <span className="ml-2 text-sm text-mute">{when.format(new Date(order.date))}</span>
                          </span>
                          <span className="col-start-2 row-start-2 text-right tabular-nums md:col-start-3 md:row-start-1">
                            {formatPrice(order.total)}
                          </span>
                          <span className={`col-start-2 row-start-1 justify-self-end px-2.5 py-1 text-sm font-semibold md:col-start-4 ${badge[order.status]}`}>
                            {STATUSES[order.status]}
                          </span>
                          <ChevronDown className="hidden size-5 transition-transform group-open:rotate-180 md:block" aria-hidden="true" />
                        </summary>

                        <div className="grid gap-6 pb-6 md:grid-cols-2">
                          <ul className="divide-y divide-line border-y border-line">
                            {order.lines.map((line) => {
                              const product = findProduct(line.slug);
                              return (
                                <li key={line.slug + line.size} className="flex items-center gap-3 py-2.5">
                                  {product ? (
                                    <span className="relative aspect-[4/5] w-11 shrink-0 bg-blush-soft">
                                      <Image src={product.photos[0].src} alt="" fill sizes="44px" className="object-cover" />
                                    </span>
                                  ) : null}
                                  <span className="min-w-0 flex-1 break-words">
                                    {line.qty} × {product?.name ?? line.slug}
                                    {product ? `, ${COLORS[product.color].name.toLowerCase()}` : ""}
                                    <span className="block text-sm text-mute">{line.size}</span>
                                  </span>
                                  <span className="shrink-0 tabular-nums">
                                    {product ? formatPrice(product.price * line.qty) : ""}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                          <div className="min-w-0">
                            <address className="space-y-1 break-words not-italic">
                              <p className="font-semibold">{c.name}</p>
                              <p>
                                {c.address}, {c.zip} {c.city}
                              </p>
                              <p>{c.tel}</p>
                              <p>{c.email}</p>
                              {c.note ? <p className="pt-1 text-mute">Napomena: {c.note}</p> : null}
                            </address>
                            <div className="mt-5 grid grid-cols-3 border border-ink" role="group" aria-label={`Status porudžbine ${order.id}`}>
                              {statusIds.map((id) => (
                                <button
                                  key={id}
                                  type="button"
                                  aria-pressed={order.status === id}
                                  onClick={() => setStatus(order.id, id)}
                                  className="h-11 border-l border-ink text-sm font-medium transition-colors first:border-l-0 aria-pressed:bg-ink aria-pressed:text-ivory"
                                >
                                  {STATUSES[id]}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              className="link mt-3 py-2 text-sm text-mute"
                              onClick={() => confirm(`Obrisati porudžbinu ${order.id}?`) && removeOrder(order.id)}
                            >
                              Obriši porudžbinu
                            </button>
                          </div>
                        </div>
                      </details>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div>
            <section className="border border-line bg-ivory p-4 md:p-6" aria-labelledby="boje">
              <h2 id="boje" className="display text-3xl">
                Prodaja po boji
              </h2>
              <ul className="mt-5 space-y-4">
                {(Object.keys(COLORS) as ColorId[]).map((id) => (
                  <li key={id}>
                    <p className="flex justify-between text-sm">
                      <span className="font-semibold">{COLORS[id].name}</span>
                      <span className="text-mute tabular-nums">Komada: {sold[id]}</span>
                    </p>
                    <div className="mt-1.5 h-3 bg-line">
                      <div
                        className="h-full origin-left transition-transform duration-700"
                        style={{ background: COLORS[id].hex, transform: `scaleX(${sold[id] / most})` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

          </div>
        </div>

        <ProductEditor />

        <p className="mt-6 max-w-2xl text-sm text-mute">
          Demo: porudžbine i izmene artikala čuvaju se samo u ovom pregledaču i nema prijave. Pravi admin ima lozinku, a porudžbine stižu
          sa svih uređaja kupaca.
        </p>
      </div>
    </div>
  );
}
