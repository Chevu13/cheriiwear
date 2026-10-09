import Image from "next/image";
import Link from "next/link";
import { COLORS, formatPrice, products, type Product } from "@/lib/products";
import { QuickAdd } from "./QuickAdd";

const sizes = "(min-width: 1024px) 30vw, 50vw";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const [first, second] = product.photos;
  const href = `/proizvod/${product.slug}`;

  return (
    <article>
      {/* the name below is the accessible link; the photo is a second, pointer-only way in */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="group relative block aspect-[4/5] overflow-hidden bg-blush-soft"
      >
        <Image
          src={first.src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: first.pos ?? "top" }}
        />
        {second ? (
          <Image
            src={second.src}
            alt=""
            fill
            sizes={sizes}
            className="hidden object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block"
            style={{ objectPosition: second.pos ?? "top" }}
          />
        ) : null}
      </Link>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3">
        <h3 className="font-semibold">
          <Link href={href} className="hover:text-cherry">
            {product.name}{" "}
            <span className="font-normal text-mute">{COLORS[product.color].name.toLowerCase()}</span>
          </Link>
        </h3>
        <p className="tabular-nums">{formatPrice(product.price)}</p>
      </div>
      <ul className="mt-1.5 -ml-1.5 flex" aria-label="Boje">
        {products
          .filter((x) => x.style === product.style)
          .map((s) => (
            <li key={s.slug}>
              <Link
                href={`/proizvod/${s.slug}`}
                aria-label={`${s.name}, ${COLORS[s.color].name}`}
                aria-current={s.slug === product.slug ? "true" : undefined}
                className="grid size-9 place-items-center"
              >
                <span
                  className="size-5 rounded-full ring-ink ring-offset-2 ring-offset-ivory [[aria-current]>&]:ring-1"
                  style={{ background: COLORS[s.color].hex }}
                />
              </Link>
            </li>
          ))}
      </ul>
      <QuickAdd slug={product.slug} name={product.name} parts={product.parts} />
    </article>
  );
}
