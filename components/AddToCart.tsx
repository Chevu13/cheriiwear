"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { SIZE_GUIDE, formatPrice, sizeLabel } from "@/lib/products";

type Chart = keyof typeof SIZE_GUIDE;

export function AddToCart({
  slug,
  price,
  parts,
  sizes,
}: {
  slug: string;
  price: number;
  parts: readonly string[];
  sizes: readonly string[];
}) {
  const [picked, setPicked] = useState<(string | null)[]>(() => parts.map(() => null));
  const [missing, setMissing] = useState(false);
  const [added, setAdded] = useState(false);
  const [chart, setChart] = useState<Chart>("Topovi");
  const guide = useRef<HTMLDialogElement>(null);
  const sizesRef = useRef<HTMLDivElement>(null);
  const ready = picked.every(Boolean);
  // which size to highlight in the guide: the one picked for the chart being shown
  const highlighted = picked[parts.length > 1 && chart === "Helanke" ? 1 : 0];

  function submit() {
    if (!ready) {
      setMissing(true);
      sizesRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    addToCart(slug, sizeLabel(parts, picked as string[]));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <>
      <div ref={sizesRef} className="space-y-5">
        {parts.map((part, i) => (
          <fieldset key={part}>
            <div className="mb-2.5 flex items-baseline justify-between">
              <legend className="float-left font-semibold">
                Veličina{part ? `: ${part.toLowerCase()}` : ""}
                {picked[i] ? <span className="ml-2 font-normal text-mute">{picked[i]}</span> : null}
              </legend>
              {i === 0 ? (
                <button type="button" className="link py-1 text-sm" onClick={() => guide.current?.showModal()}>
                  Vodič za veličine
                </button>
              ) : null}
            </div>
            <div className="clear-both grid grid-cols-5 gap-2">
              {sizes.map((size) => (
                <label
                  key={size}
                  className="grid h-12 place-items-center border border-line bg-paper font-medium transition-colors hover:border-ink has-checked:border-ink has-checked:bg-ink has-checked:text-ivory has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-cherry"
                >
                  <input
                    type="radio"
                    name={`velicina-${part || "komad"}`}
                    value={size}
                    className="sr-only"
                    checked={picked[i] === size}
                    onChange={() => {
                      setPicked((cur) => cur.map((v, j) => (j === i ? size : v)));
                      setMissing(false);
                    }}
                  />
                  {size}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <p role="alert" className="min-h-6 text-cherry">
          {missing && !ready ? "Izaberi veličinu pre dodavanja u korpu." : ""}
        </p>
      </div>

      {/* on phones the main action stays under the thumb */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory px-[1.125rem] pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:border-0 md:bg-transparent md:p-0">
        <button type="button" className="btn w-full justify-between" onClick={submit}>
          <span key={String(added)} className="swap" aria-live="polite">
            {added ? "Dodato u korpu" : "Dodaj u korpu"}
          </span>
          <span className="tabular-nums">{formatPrice(price)}</span>
        </button>
      </div>

      <dialog
        ref={guide}
        className="sheet"
        aria-labelledby="vodic-naslov"
        onClick={(e) => e.target === e.currentTarget && guide.current?.close()}
      >
        <div className="p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:p-8">
          <div className="flex items-start justify-between">
            <h2 id="vodic-naslov" className="display text-4xl">
              Vodič za veličine
            </h2>
            <button
              type="button"
              aria-label="Zatvori vodič"
              className="-mt-2 -mr-2 grid size-11 place-items-center"
              onClick={() => guide.current?.close()}
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-5 grid grid-cols-2 border border-ink" role="group" aria-label="Tabela za">
            {(Object.keys(SIZE_GUIDE) as Chart[]).map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={chart === name}
                onClick={() => setChart(name)}
                className="h-11 font-medium aria-pressed:bg-ink aria-pressed:text-ivory"
              >
                {name}
              </button>
            ))}
          </div>
          <table className="mt-5 w-full text-left tabular-nums">
            <caption className="sr-only">Mere u centimetrima: {chart}</caption>
            <thead>
              <tr className="border-b border-ink text-sm">
                <th scope="col" className="py-2.5 font-semibold">
                  Veličina
                </th>
                {SIZE_GUIDE[chart].columns.map((c) => (
                  <th key={c} scope="col" className="py-2.5 font-semibold">
                    {c} (cm)
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(SIZE_GUIDE[chart].rows).map(([size, cells]) => (
                <tr key={size} className={`border-b border-line ${size === highlighted ? "bg-blush" : ""}`}>
                  <th scope="row" className="px-2 py-3 font-semibold">
                    {size}
                    {size === highlighted ? <span className="sr-only"> (izabrana)</span> : null}
                  </th>
                  {cells.map((cell, k) => (
                    <td key={k} className="py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-mute">
            Mere u tabeli su primer za demo prezentaciju. Proverenu tabelu dodaje CHÉRI WEAR pre objave sajta.
          </p>
        </div>
      </dialog>
    </>
  );
}
