"use client";

// Demo order inbox. Orders live in this browser's localStorage only; a real shop
// would send them to a server. shortcut: no backend or login, replace both before launch.
import { useSyncExternalStore } from "react";
import type { Line } from "./cart";
import { getProduct } from "./products";

export const CUSTOMER_FIELDS = ["name", "tel", "email", "address", "city", "zip", "note"] as const;
export type Customer = Record<(typeof CUSTOMER_FIELDS)[number], string>;
export const STATUSES = { nova: "Nova", priprema: "U pripremi", poslata: "Poslata" } as const;
export type Status = keyof typeof STATUSES;
export type Order = {
  id: string;
  date: string; // ISO
  customer: Customer;
  lines: Line[];
  total: number;
  status: Status;
};

const KEY = "cheri-orders-v1";
const EMPTY: Order[] = [];
const listeners = new Set<() => void>();
let orders: Order[] | null = null;

function load(): Order[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(raw)) return EMPTY;
    // localStorage is user-editable: keep only entries with the expected shape
    return raw.filter(
      (o): o is Order =>
        typeof o?.id === "string" &&
        typeof o.date === "string" &&
        typeof o.total === "number" &&
        Array.isArray(o.lines) &&
        typeof o.customer === "object" &&
        o.customer !== null,
    );
  } catch {
    return EMPTY;
  }
}

function set(next: Order[]) {
  orders = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable: the inbox still works until the tab closes
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

const snapshot = () => (orders ??= load());

export const useOrders = () => useSyncExternalStore(subscribe, snapshot, () => EMPTY);

export function addOrder(customer: Customer, lines: Line[], total: number) {
  const id = `CW-${Date.now().toString(36).toUpperCase().slice(-5)}`;
  set([{ id, date: new Date().toISOString(), customer, lines, total, status: "nova" }, ...snapshot()]);
  return id;
}

export const setStatus = (id: string, status: Status) =>
  set(snapshot().map((o) => (o.id === id ? { ...o, status } : o)));

export const removeOrder = (id: string) => set(snapshot().filter((o) => o.id !== id));

export const clearOrders = () => set(EMPTY);

/** Fills the inbox with obviously fake orders so the panel can be shown without placing any. */
export function seedOrders() {
  const day = 86_400_000;
  const sample: [string, string, string, Status, number, number][] = [
    ["komplet-lila", "Top S / Helanke M", "Novi Sad", "nova", 1, 0.1],
    ["komplet-crna", "Top M / Helanke M", "Beograd", "nova", 2, 0.6],
    ["komplet-siva", "Top XS / Helanke S", "Niš", "priprema", 1, 1.3],
    ["komplet-crna", "Top L / Helanke L", "Kragujevac", "poslata", 1, 2.4],
    ["komplet-lila", "Top M / Helanke L", "Subotica", "poslata", 1, 4.2],
  ];
  set([
    ...sample.map(([slug, size, city, status, qty, daysAgo], i) => ({
      id: `CW-DEMO${i + 1}`,
      date: new Date(Date.now() - daysAgo * day).toISOString(),
      customer: {
        name: `Demo kupac ${i + 1}`,
        tel: "060 000 000",
        email: `kupac${i + 1}@example.com`,
        address: `Primer ulica ${i + 1}`,
        city,
        zip: "00000",
        note: i === 1 ? "Primer napomene: pozvati pre dostave." : "",
      },
      lines: [{ slug, size, qty }],
      total: (getProduct(slug)?.price ?? 0) * qty,
      status,
    })),
    ...snapshot().filter((o) => !o.id.startsWith("CW-DEMO")),
  ]);
}
