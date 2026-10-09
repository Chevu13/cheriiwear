"use client";

// Demo order inbox. Orders live in this browser's localStorage only; a real shop
// would send them to a server. shortcut: no backend or login, replace both before launch.
import { useSyncExternalStore } from "react";
import type { Line } from "./cart";

export const CUSTOMER_FIELDS = ["name", "tel", "email", "address", "city", "zip", "note"] as const;
export type Customer = Record<(typeof CUSTOMER_FIELDS)[number], string>;
export type Order = {
  id: string;
  date: string; // ISO
  customer: Customer;
  lines: Line[];
  total: number;
  status: "nova" | "poslata";
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

export const setStatus = (id: string, status: Order["status"]) =>
  set(snapshot().map((o) => (o.id === id ? { ...o, status } : o)));

export const clearOrders = () => set(EMPTY);
