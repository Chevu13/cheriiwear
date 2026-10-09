"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { setQty, type Line } from "@/lib/cart";
import { COLORS, formatPrice, getProduct } from "@/lib/products";

export function CartLines({ lines }: { lines: Line[] }) {
  return (
    <ul className="divide-y divide-line">
      {lines.map((line) => {
        const product = getProduct(line.slug);
        if (!product) return null;
        const label = `${product.name}, ${COLORS[product.color].name}, ${line.size}`;
        return (
          <li key={line.slug + line.size} className="flex gap-4 py-4">
            <div className="relative aspect-[4/5] w-20 shrink-0 self-start bg-blush-soft">
              <Image
                src={product.photos[0].src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
                style={{ objectPosition: product.photos[0].pos ?? "top" }}
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex justify-between gap-3">
                <p className="font-semibold">{product.name}</p>
                <p className="shrink-0 tabular-nums">{formatPrice(product.price * line.qty)}</p>
              </div>
              <p className="mt-0.5 text-sm text-mute">
                {COLORS[product.color].name}, {line.size}
              </p>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center border border-line">
                  <button
                    type="button"
                    className="grid size-10 place-items-center"
                    aria-label={`Smanji količinu: ${label}`}
                    onClick={() => setQty(line.slug, line.size, line.qty - 1)}
                  >
                    <Minus className="size-4" aria-hidden="true" />
                  </button>
                  <span className="w-7 text-center text-sm tabular-nums">{line.qty}</span>
                  <button
                    type="button"
                    className="grid size-10 place-items-center"
                    aria-label={`Povećaj količinu: ${label}`}
                    onClick={() => setQty(line.slug, line.size, line.qty + 1)}
                  >
                    <Plus className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <button
                  type="button"
                  className="link py-2 text-sm text-mute"
                  aria-label={`Ukloni iz korpe: ${label}`}
                  onClick={() => setQty(line.slug, line.size, 0)}
                >
                  Ukloni
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
