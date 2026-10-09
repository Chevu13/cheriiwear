"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { dropFromCart } from "@/lib/cart";
import { deleteProduct, newSlug, resetCatalog, saveProduct, useCatalog } from "@/lib/catalog";
import { COLORS, PHOTO_LIBRARY, formatPrice, type ColorId, type Product } from "@/lib/products";

const SET_PARTS = ["Top", "Helanke"];
const label = "mb-1.5 block text-sm font-medium";
const option =
  "grid h-11 place-items-center border border-line bg-paper px-3 text-sm font-medium transition-colors hover:border-ink has-checked:border-ink has-checked:bg-ink has-checked:text-ivory has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-cherry";

export function ProductEditor() {
  const catalog = useCatalog();
  const dialog = useRef<HTMLDialogElement>(null);
  // null = closed, "new" = adding, otherwise the product being edited
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [error, setError] = useState("");
  const current = editing === "new" || editing === null ? null : editing;

  function open(target: Product | "new") {
    setEditing(target);
    setError("");
    dialog.current?.showModal();
  }

  function remove(product: Product) {
    if (!confirm(`Obrisati artikal „${product.name}“?`)) return;
    deleteProduct(product.slug);
    dropFromCart(product.slug);
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const color = String(form.get("color")) as ColorId;
    const src = String(form.get("photo"));
    const price = Number(form.get("price"));
    const photos =
      current && current.photos[0].src === src
        ? current.photos
        : [{ src, alt: `${name}, ${COLORS[color]?.name.toLowerCase()}` }, ...(current?.photos.filter((x) => x.src !== src) ?? [])];

    const ok = saveProduct({
      slug: current?.slug ?? newSlug(name, color),
      name,
      color,
      price,
      parts: form.get("parts") === "komplet" ? SET_PARTS : [""],
      description: String(form.get("description") ?? "").trim(),
      photos,
    });
    if (!ok) {
      setError("Proveri unos: naziv je obavezan, a cena je ceo broj od 0 do 1.000.000.");
      return;
    }
    dialog.current?.close();
  }

  return (
    <section className="mt-3 border border-line bg-ivory p-4 md:p-6" aria-labelledby="artikli">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="artikli" className="display text-3xl md:text-4xl">
          Artikli
        </h2>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            className="link py-2 text-sm text-mute"
            onClick={() => confirm("Vratiti početne artikle? Tvoje izmene artikala se brišu.") && resetCatalog()}
          >
            Vrati početne artikle
          </button>
          <button type="button" className="btn min-h-11 px-5" onClick={() => open("new")}>
            Novi artikal
          </button>
        </div>
      </div>

      {catalog.length === 0 ? (
        <p className="mt-5 border border-dashed border-line p-6 text-center text-lg">
          Nema artikala. Dodaj novi ili vrati početne.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {catalog.map((product) => (
            <li key={product.slug} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
              <span className="relative aspect-[4/5] w-14 shrink-0 bg-blush-soft">
                <Image src={product.photos[0].src} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1 basis-40">
                <span className="block truncate font-semibold">{product.name}</span>
                <span className="flex items-center gap-2 text-sm text-mute">
                  <span className="size-3 rounded-full" style={{ background: COLORS[product.color].hex }} />
                  {COLORS[product.color].name}
                </span>
              </span>
              <span className="tabular-nums">{formatPrice(product.price)}</span>
              <span className="flex gap-2">
                <button type="button" className="btn btn-quiet min-h-10 px-4 text-sm" onClick={() => open(product)}>
                  Izmeni
                </button>
                <button
                  type="button"
                  className="btn btn-quiet min-h-10 px-4 text-sm"
                  aria-label={`Obriši artikal ${product.name}, ${COLORS[product.color].name}`}
                  onClick={() => remove(product)}
                >
                  Obriši
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-sm text-mute">
        Izmene se odmah vide u prodavnici, ali samo u ovom pregledaču. Slika se bira iz postojećih fotografija; na
        pravom sajtu se ovde otprema nova.
      </p>

      <dialog
        ref={dialog}
        className="sheet"
        aria-labelledby="artikal-naslov"
        onClose={() => setEditing(null)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      >
        {editing ? (
          // keyed so the fields reset to the product being opened
          <form key={current?.slug ?? "new"} onSubmit={submit} className="space-y-5 p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:p-8">
            <div className="flex items-start justify-between">
              <h2 id="artikal-naslov" className="display text-4xl">
                {current ? "Izmeni artikal" : "Novi artikal"}
              </h2>
              <button
                type="button"
                aria-label="Zatvori"
                className="-mt-2 -mr-2 grid size-11 place-items-center"
                onClick={() => dialog.current?.close()}
              >
                <X className="size-6" aria-hidden="true" />
              </button>
            </div>

            <label className="block">
              <span className={label}>Naziv</span>
              <input name="name" required maxLength={60} defaultValue={current?.name} autoComplete="off" className="field" />
            </label>

            <label className="block">
              <span className={label}>Cena (RSD)</span>
              <input
                name="price"
                type="number"
                inputMode="numeric"
                required
                min={0}
                max={1000000}
                step={1}
                defaultValue={current?.price}
                autoComplete="off"
                className="field"
              />
            </label>

            <fieldset>
              <legend className={label}>Boja</legend>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(COLORS) as ColorId[]).map((id, i) => (
                  <label key={id} className={`${option} grid-flow-col gap-2`}>
                    <input
                      type="radio"
                      name="color"
                      value={id}
                      className="sr-only"
                      defaultChecked={current ? current.color === id : i === 0}
                    />
                    <span className="size-3.5 rounded-full ring-1 ring-ivory" style={{ background: COLORS[id].hex }} />
                    {COLORS[id].name}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className={label}>Izbor veličine</legend>
              <div className="grid grid-cols-2 gap-2">
                <label className={option}>
                  <input
                    type="radio"
                    name="parts"
                    value="komplet"
                    className="sr-only"
                    defaultChecked={!current || current.parts.length > 1}
                  />
                  Top i helanke posebno
                </label>
                <label className={option}>
                  <input
                    type="radio"
                    name="parts"
                    value="komad"
                    className="sr-only"
                    defaultChecked={!!current && current.parts.length === 1}
                  />
                  Jedna veličina
                </label>
              </div>
            </fieldset>

            <label className="block">
              <span className={label}>Opis</span>
              <textarea name="description" rows={3} maxLength={600} defaultValue={current?.description} className="field" />
            </label>

            <fieldset>
              <legend className={label}>Glavna slika</legend>
              <div className="grid grid-cols-4 gap-2">
                {PHOTO_LIBRARY.map((src, i) => (
                  <label
                    key={src}
                    className="relative block aspect-[4/5] bg-blush-soft outline-offset-2 outline-cherry has-checked:outline-3 has-focus-visible:outline-3"
                  >
                    <input
                      type="radio"
                      name="photo"
                      value={src}
                      className="sr-only"
                      aria-label={`Slika ${i + 1}`}
                      defaultChecked={current ? current.photos[0].src === src : i === 0}
                    />
                    <Image src={src} alt="" fill sizes="25vw" className="object-cover" />
                  </label>
                ))}
              </div>
            </fieldset>

            <p role="alert" className="min-h-6 text-cherry">
              {error}
            </p>
            <button type="submit" className="btn w-full">
              {current ? "Sačuvaj izmene" : "Dodaj artikal"}
            </button>
          </form>
        ) : null}
      </dialog>
    </section>
  );
}
