"use client";

// Editable demo catalog. The shop reads products from here; edits made in /admin are
// kept in this browser's localStorage and fall back to the defaults in products.ts.
// shortcut: no backend, so edits are per browser; move to a database before launch.
import { useSyncExternalStore } from "react";
import { COLORS, SIZES, products as defaults, type Product } from "./products";

const KEY = "cheri-catalog-v2";
const listeners = new Set<() => void>();
let catalog: Product[] | null = null;

const isText = (v: unknown, max: number): v is string => typeof v === "string" && v.length <= max;
// a file from public/img, or a photo uploaded in the admin (resized JPEG, see ProductEditor)
const isPhotoSrc = (v: unknown) =>
  isText(v, 700_000) && (/^\/img\/[a-z0-9-]+\.jpg$/.test(v) || /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(v));

// localStorage is user-editable: accept only well-formed products
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
    Array.isArray(v.sizes) &&
    v.sizes.length > 0 &&
    v.sizes.every((size) => (SIZES as readonly string[]).includes(size)) &&
    Array.isArray(v.parts) &&
    v.parts.length > 0 &&
    v.parts.every((part) => isText(part, 20)) &&
    Array.isArray(v.photos) &&
    v.photos.length > 0 &&
    v.photos.every((photo) => isPhotoSrc(photo?.src) && isText(photo.alt, 300))
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

/** Stores the catalog; false (and nothing changes) when the browser has no room left for it. */
function set(next: Product[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    return false;
  }
  catalog = next;
  listeners.forEach((fn) => fn());
  return true;
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

/** Adds the product, or replaces the one with the same slug. */
export function saveProduct(product: Product): "ok" | "invalid" | "full" {
  if (!isProduct(product)) return "invalid";
  const list = snapshot();
  const next = list.some((x) => x.slug === product.slug)
    ? list.map((x) => (x.slug === product.slug ? product : x))
    : [...list, product];
  return set(next) ? "ok" : "full";
}

export const deleteProduct = (slug: string) => void set(snapshot().filter((x) => x.slug !== slug));

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
