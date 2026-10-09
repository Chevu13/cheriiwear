"use client";

// Editable demo catalog. The shop reads products from here; edits made in /admin are
// kept in this browser's localStorage and fall back to the defaults in products.ts.
// shortcut: no backend, so edits are per browser; move to a database before launch.
import { useSyncExternalStore } from "react";
import { COLORS, products as defaults, type Product } from "./products";

const KEY = "cheri-catalog-v1";
const listeners = new Set<() => void>();
let catalog: Product[] | null = null;

const isText = (v: unknown, max: number): v is string => typeof v === "string" && v.length <= max;

// localStorage is user-editable: accept only well-formed products with local images
function isProduct(x: unknown): x is Product {
  const v = x as Product;
  return (
    typeof v === "object" &&
    v !== null &&
    isText(v.slug, 80) &&
    /^[a-z0-9-]+$/.test(v.slug) &&
    isText(v.name, 60) &&
    v.name.trim() !== "" &&
    v.color in COLORS &&
    Number.isInteger(v.price) &&
    v.price >= 0 &&
    v.price <= 1_000_000 &&
    isText(v.description, 600) &&
    Array.isArray(v.parts) &&
    v.parts.length > 0 &&
    v.parts.every((part) => isText(part, 20)) &&
    Array.isArray(v.photos) &&
    v.photos.length > 0 &&
    v.photos.every((photo) => /^\/img\/[a-z0-9-]+\.jpg$/.test(photo?.src) && isText(photo.alt, 300))
  );
}

function load(): Product[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return defaults;
    const list: unknown = JSON.parse(raw);
    return Array.isArray(list) ? list.filter(isProduct) : defaults;
  } catch {
    return defaults;
  }
}

function set(next: Product[]) {
  catalog = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable: edits last until the tab closes
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

const snapshot = () => (catalog ??= load());

export const useCatalog = () => useSyncExternalStore(subscribe, snapshot, () => defaults);

/** Current product by slug. Client-only; on the server it sees the defaults. */
export const findProduct = (slug: string) =>
  (typeof window === "undefined" ? defaults : snapshot()).find((x) => x.slug === slug);

/** Adds the product, or replaces the one with the same slug. Returns false if it is not valid. */
export function saveProduct(product: Product) {
  if (!isProduct(product)) return false;
  const list = snapshot();
  set(list.some((x) => x.slug === product.slug) ? list.map((x) => (x.slug === product.slug ? product : x)) : [...list, product]);
  return true;
}

export const deleteProduct = (slug: string) => set(snapshot().filter((x) => x.slug !== slug));

export function resetCatalog() {
  catalog = defaults;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing stored, nothing to remove
  }
  listeners.forEach((fn) => fn());
}

/** URL-safe id from a product name, unique within the current catalog. */
export function newSlug(name: string, color: string) {
  const base =
    `${name}-${color}`
      .toLowerCase()
      .replace(/đ/g, "dj")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "artikal";
  let slug = base;
  for (let n = 2; snapshot().some((x) => x.slug === slug); n++) slug = `${base}-${n}`;
  return slug;
}
