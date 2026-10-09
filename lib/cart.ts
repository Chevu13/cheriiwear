"use client";

import { useSyncExternalStore } from "react";
import { findProduct } from "./catalog";

export type Line = { slug: string; size: string; qty: number };

const KEY = "cheri-cart-v1";
const EMPTY: Line[] = [];
const listeners = new Set<() => void>();
let lines: Line[] | null = null;

function load(): Line[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(raw)) return EMPTY;
    // localStorage is user-editable: keep only lines that match the catalog.
    return raw.filter(
      (l): l is Line =>
        !!findProduct(l?.slug) && typeof l.size === "string" && Number.isInteger(l.qty) && l.qty > 0 && l.qty < 100,
    );
  } catch {
    return EMPTY;
  }
}

function set(next: Line[]) {
  lines = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // private mode / storage full: the cart still works for this visit
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    lines = load();
    fn();
  };
  listeners.add(fn);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

const snapshot = () => (lines ??= load());

export const useCart = () => useSyncExternalStore(subscribe, snapshot, () => EMPTY);

export function addToCart(slug: string, size: string) {
  const cur = snapshot();
  const found = cur.some((l) => l.slug === slug && l.size === size);
  set(
    found
      ? cur.map((l) => (l.slug === slug && l.size === size ? { ...l, qty: Math.min(l.qty + 1, 99) } : l))
      : [...cur, { slug, size, qty: 1 }],
  );
  window.dispatchEvent(new Event("cheri:open-cart"));
}

export function setQty(slug: string, size: string, qty: number) {
  set(
    snapshot().flatMap((l) =>
      l.slug === slug && l.size === size ? (qty > 0 ? [{ ...l, qty: Math.min(qty, 99) }] : []) : [l],
    ),
  );
}

export const clearCart = () => set(EMPTY);

/** Removes a product that no longer exists (deleted in the admin) from the cart. */
export const dropFromCart = (slug: string) => set(snapshot().filter((l) => l.slug !== slug));

const noop = () => () => {};
/** False during SSR and hydration, so cart-dependent screens don't flash "empty". */
export const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

export const cartCount = (ls: Line[]) => ls.reduce((n, l) => n + l.qty, 0);
export const cartTotal = (ls: Line[]) => ls.reduce((n, l) => n + l.qty * (findProduct(l.slug)?.price ?? 0), 0);
