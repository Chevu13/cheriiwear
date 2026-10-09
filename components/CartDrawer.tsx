"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cartCount, cartTotal, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { CartLines } from "./CartLines";

export function CartDrawer() {
  const ref = useRef<HTMLDialogElement>(null);
  const lines = useCart();
  const close = () => ref.current?.close();

  useEffect(() => {
    const open = () => ref.current?.showModal();
    window.addEventListener("cheri:open-cart", open);
    return () => window.removeEventListener("cheri:open-cart", open);
  }, []);

  return (
    <dialog
      ref={ref}
      className="drawer"
      aria-labelledby="cart-title"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="cart-title" className="display text-3xl">
            Tvoja korpa{lines.length > 0 ? ` (${cartCount(lines)})` : ""}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Zatvori korpu"
            className="-mr-2 grid size-11 place-items-center"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-5 px-5">
            <p className="text-lg">Korpa je još prazna. Izaberi boju i veličinu, ostalo ide brzo.</p>
            <Link href="/kolekcija" onClick={close} className="btn">
              Pogledaj kolekciju
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5">
              <CartLines lines={lines} />
            </div>
            <div className="border-t border-line px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="flex justify-between text-lg font-semibold">
                <span>Međuzbir</span>
                <span className="tabular-nums">{formatPrice(cartTotal(lines))}</span>
              </div>
              <p className="mt-1 text-sm text-mute">Dostava se obračunava u sledećem koraku.</p>
              <Link href="/placanje" onClick={close} className="btn mt-4 w-full">
                Nastavi na porudžbinu
              </Link>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
