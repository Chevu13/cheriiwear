import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { CARE, CATEGORIES, COLORS, FABRIC, formatPrice, getProduct, products } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => products.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const title = `${product.name}, ${COLORS[product.color].name.toLowerCase()}`;
  return { title, description: product.description, openGraph: { title, images: [product.photos[0].src] } };
}

function Details({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="group border-b border-line">
      <summary className="flex items-center justify-between py-4 font-semibold">
        {title}
        <Plus className="size-5 transition-transform group-open:rotate-45" aria-hidden="true" />
      </summary>
      <div className="space-y-3 pb-5 leading-relaxed">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const color = COLORS[product.color];
  const otherColors = products.filter((x) => x.style === product.style);
  // same colour, other pieces: the rest of the outfit
  const pairs = products.filter((x) => x.color === product.color && x.style !== product.style);

  return (
    <div className="pb-24 md:pb-0">
      <div className="md:wrap md:grid md:grid-cols-12 md:gap-x-10 md:pt-8">
        <div className="snap-row gap-1.5 md:col-span-7 md:grid md:grid-cols-2 md:gap-3 md:overflow-visible">
          {product.photos.map((photo, i) => (
            <div key={photo.src} className="relative aspect-[4/5] w-[86%] overflow-hidden bg-blush-soft md:w-auto">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 768px) 30vw, 86vw"
                className="photo-in object-cover"
                style={{ objectPosition: photo.pos ?? "top", animationDelay: `${i * 90}ms` }}
              />
            </div>
          ))}
          {product.photos.length % 2 ? (
            <div className="hidden aspect-[4/5] flex-col justify-end bg-blush p-6 md:flex">
              <p className="display text-5xl text-cherry">{FABRIC.composition}</p>
              <p className="mt-3">{FABRIC.notes[0]}.</p>
            </div>
          ) : null}
        </div>

        <div className="px-[1.125rem] pt-6 md:col-span-5 md:px-0 md:pt-0">
          <div className="md:sticky md:top-24">
            <nav aria-label="Putanja" className="text-sm text-mute">
              <Link href="/kolekcija" className="hover:text-ink">
                Kolekcija
              </Link>
              <span aria-hidden="true"> / </span>
              <Link href={`/kolekcija?kategorija=${product.category}`} className="hover:text-ink">
                {CATEGORIES[product.category]}
              </Link>
            </nav>
            <h1 className="display mt-3 text-6xl md:text-7xl">{product.name}</h1>
            <p className="mt-3 flex items-baseline gap-3 text-xl">
              <span className="tabular-nums">{formatPrice(product.price)}</span>
              <span className="text-sm text-mute">demo cena</span>
            </p>

            <div className="mt-7">
              <p className="font-semibold">
                Boja <span className="ml-2 font-normal text-mute">{color.name}</span>
              </p>
              <ul className="mt-2 -ml-1 flex gap-1">
                {otherColors.map((x) => (
                  <li key={x.slug}>
                    <Link
                      href={`/proizvod/${x.slug}`}
                      scroll={false}
                      aria-label={COLORS[x.color].name}
                      aria-current={x.slug === product.slug ? "true" : undefined}
                      className="grid size-11 place-items-center"
                    >
                      <span
                        className="size-8 rounded-full transition-transform duration-300 hover:scale-110 ring-ink ring-offset-[3px] ring-offset-ivory [[aria-current]>&]:ring-1"
                        style={{ background: COLORS[x.color].hex }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <AddToCart key={product.slug} slug={product.slug} price={product.price} parts={product.parts} />
            </div>

            <div className="mt-8 border-t border-line">
              <Details title="Opis" open>
                <p>{product.description}</p>
              </Details>
              <Details title="Materijal i sastav">
                <p>
                  {FABRIC.name}, {FABRIC.composition}.
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  {FABRIC.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </Details>
              <Details title="Održavanje">
                <p className="font-semibold">Peri ih pažljivo</p>
                <ul className="list-disc space-y-1 pl-5">
                  {CARE.do.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
                <p className="pt-1 font-semibold">Izbegavaj</p>
                <ul className="list-disc space-y-1 pl-5">
                  {CARE.avoid.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </Details>
              <Details title="Dostava i povraćaj">
                <p>
                  Uslove dostave, zamene i povraćaja dodaje CHÉRI WEAR pre objave sajta.{" "}
                  <Link href="/informacije" className="link">
                    Informacije
                  </Link>
                </p>
              </Details>
            </div>
          </div>
        </div>
      </div>

      <section className="wrap py-20 md:py-32" aria-labelledby="uz-ovo">
        <h2 id="uz-ovo" className="display mb-8 text-5xl md:mb-12 md:text-7xl">
          {product.style === "komplet" ? "Ili komad po komad" : "Upotpuni komplet"}
        </h2>
        <div className="reveal-grid grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-6 lg:grid-cols-3">
          {pairs.map((x) => (
            <ProductCard key={x.slug} product={x} />
          ))}
        </div>
      </section>
    </div>
  );
}
