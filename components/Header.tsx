"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { cartCount, useCart } from "@/lib/cart";
import { INSTAGRAM } from "@/lib/products";
import { Logo } from "./Logo";

const NAV = [
  ["/", "Početna"],
  ["/kolekcija", "Kolekcija"],
  ["/nasa-prica", "Naša priča"],
  ["/kontakt", "Kontakt"],
] as const;

export function Header() {
  const menu = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const count = cartCount(useCart());
  const closeMenu = () => menu.current?.close();
  const current = (href: string) => (pathname === href ? ("page" as const) : undefined);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/95 backdrop-blur-sm">
      <div className="wrap grid h-16 grid-cols-[1fr_auto_1fr] items-center">
        <button
          type="button"
          className="-ml-2 grid size-11 place-items-center md:hidden"
          aria-label="Otvori meni"
          onClick={() => menu.current?.showModal()}
        >
          <Menu className="size-6" strokeWidth={1.6} aria-hidden="true" />
        </button>
        <Logo className="col-start-2 md:col-start-1 md:row-start-1 md:justify-self-start" />
        <nav aria-label="Glavna navigacija" className="hidden gap-9 md:col-start-2 md:flex">
          {NAV.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={current(href)}
              className="py-2 text-[0.9375rem] font-medium decoration-cherry decoration-2 underline-offset-8 hover:underline aria-[current]:underline"
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="relative col-start-3 -mr-2 grid size-11 place-items-center justify-self-end"
          aria-label={`Otvori korpu, proizvoda: ${count}`}
          onClick={() => window.dispatchEvent(new Event("cheri:open-cart"))}
        >
          <ShoppingBag className="size-6" strokeWidth={1.6} aria-hidden="true" />
          {count > 0 ? (
            <span className="absolute top-1 right-0 grid h-5 min-w-5 place-items-center rounded-full bg-cherry px-1 text-xs font-semibold text-ivory tabular-nums">
              {count}
            </span>
          ) : null}
        </button>
      </div>

      <dialog
        ref={menu}
        className="drawer drawer-left"
        aria-label="Meni"
        onClick={(e) => e.target === e.currentTarget && closeMenu()}
      >
        <div className="flex h-full flex-col px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Zatvori meni"
            className="-ml-2 grid size-11 place-items-center"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
          <nav aria-label="Meni" className="mt-6 flex flex-col">
            {NAV.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                aria-current={current(href)}
                className="display border-b border-line py-4 text-5xl aria-[current]:text-cherry"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-2">
            <p className="text-mute">Made to move. Made to feel confident.</p>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="link font-medium">
              @cheriiwear na Instagramu
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
