"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { dropFromCart } from "@/lib/cart";
import { deleteProduct, newSlug, resetCatalog, saveProduct, useCatalog } from "@/lib/catalog";
import { COLORS, SIZES, formatPrice, type ColorId, type Product } from "@/lib/products";

const label = "mb-1.5 block text-sm font-medium";
const option =
  "grid h-11 place-items-center border border-line bg-paper px-3 text-sm font-medium transition-colors hover:border-ink has-checked:border-ink has-checked:bg-ink has-checked:text-ivory has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-cherry";

const ERRORS = {
  invalid: "Proveri unos: naziv je obavezan, cena je ceo broj od 0 do 1.000.000, a bar jedna veličina mora biti izabrana.",
  full: "Nema više mesta u pregledaču za slike. Obriši neki artikal sa otpremljenom slikom pa pokušaj ponovo.",
  photo: "Dodaj sliku artikla.",
  file: "Ovaj fajl ne može da se učita kao slika. Izaberi JPG ili PNG.",
};

/** Shrinks an uploaded photo to at most 1000px on its longer side, as a JPEG data URL. Never crops. */
async function toJpeg(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}

export function ProductEditor() {
  const catalog = useCatalog();
  const dialog = useRef<HTMLDialogElement>(null);
  // null = closed, "new" = adding, otherwise the product being edited
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [photo, setPhoto] = useState(""); // main photo shown in the form
  const [error, setError] = useState("");
  const current = editing === "new" || editing === null ? null : editing;

  function open(target: Product | "new") {
    setEditing(target);
    setPhoto(target === "new" ? "" : target.photos[0].src);
    setError("");
    dialog.current?.showModal();
  }

  function remove(product: Product) {
    if (!confirm(`Obrisati artikal „${product.name}“?`)) return;
    deleteProduct(product.slug);
    dropFromCart(product.slug);
  }

  async function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhoto(await toJpeg(file));
      setError("");
    } catch {
      setError(ERRORS.file);
    }
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!photo) return setError(ERRORS.photo);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const color = String(form.get("color")) as ColorId;
    const photos =
      current && current.photos[0].src === photo
        ? current.photos
        : [{ src: photo, alt: `${name}, ${COLORS[color]?.name.toLowerCase()}` }, ...(current?.photos.slice(1) ?? [])];

    const result = saveProduct({
      slug: current?.slug ?? newSlug(name, color),
      name,
      color,
      price: Number(form.get("price")),
      sizes: SIZES.filter((size) => form.getAll("sizes").includes(size)),
      parts: current?.parts ?? [""],
      description: String(form.get("description") ?? "").trim(),
      photos,
    });
    if (result !== "ok") return setError(ERRORS[result]);
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
                  <span className="size-3 shrink-0 rounded-full" style={{ background: COLORS[product.color].hex }} />
                  {COLORS[product.color].name}, {product.sizes.join(" ")}
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
      <p className="mt-3 text-sm text-mute">Izmene se odmah vide u prodavnici, ali samo u ovom pregledaču.</p>

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
              <legend className={label}>Dostupne veličine</legend>
              <div className="grid grid-cols-5 gap-2">
                {SIZES.map((size) => (
                  <label key={size} className={option}>
                    <input
                      type="checkbox"
                      name="sizes"
                      value={size}
                      className="sr-only"
                      defaultChecked={current ? current.sizes.includes(size) : true}
                    />
                    {size}
                  </label>
                ))}
              </div>
              <p className="mt-1.5 text-sm text-mute">Kupac može da izabere samo označene veličine.</p>
            </fieldset>

            <label className="block">
              <span className={label}>Opis</span>
              <textarea name="description" rows={3} maxLength={600} defaultValue={current?.description} className="field" />
            </label>

            <div>
              <span className={label} id="slika-oznaka">
                Slika
              </span>
              <div className="flex items-start gap-4">
                <span className="relative block aspect-[4/5] w-24 shrink-0 border border-line bg-blush-soft">
                  {photo ? <Image src={photo} alt="Izabrana slika artikla" fill sizes="96px" className="object-cover" /> : null}
                </span>
                <div className="min-w-0">
                  <input
                    type="file"
                    accept="image/*"
                    aria-labelledby="slika-oznaka"
                    onChange={pickFile}
                    className="block w-full text-sm file:mr-3 file:h-11 file:cursor-pointer file:border file:border-ink file:bg-transparent file:px-4 file:font-medium"
                  />
                  <p className="mt-2 text-sm text-mute">
                    Uspravna slika odnosa 4:5, preporuka 1080 × 1350 px, JPG ili PNG. Slika drugog odnosa biće odsečena po
                    ivicama okvira.
                  </p>
                </div>
              </div>
            </div>

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
