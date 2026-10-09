import Image from "next/image";
import Link from "next/link";
import { CherryMark } from "@/components/Logo";
import { ProductCard } from "@/components/ProductCard";
import { COLORS, FABRIC, INSTAGRAM, formatPrice, products as sets } from "@/lib/products";

function Hero() {
  return (
    <section className="md:wrap md:grid md:grid-cols-12 md:items-center md:gap-x-6 md:pt-10 md:pb-24">
      <div className="hero-img v-bottom relative aspect-[775/1076] bg-blush-soft md:order-2 md:col-span-5 md:col-start-8">
        <Image
          src="/img/grupa-studio.jpg"
          alt="Devojke u CHÉRI WEAR kompletima u pilates studiju"
          fill
          priority
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="rise relative -mt-[9.5vw] px-[1.125rem] pb-16 md:col-span-5 md:col-start-1 md:row-start-1 md:mt-0 md:px-0 md:pb-0">
        <h1 className="display text-[25.5vw] leading-[0.92] text-cherry md:text-[min(13.2vw,12.5rem)]">
          Made to <span className="md:block">move.</span>
        </h1>
        <p className="mt-5 max-w-sm text-lg md:mt-7 md:text-xl">Activewear koji prati svaki tvoj pokret.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/kolekcija" className="btn flex-1 sm:flex-none">
            Istraži kolekciju
          </Link>
          <Link href="/nasa-prica" className="btn btn-quiet flex-1 sm:flex-none">
            Naša priča
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <section className="wrap pb-24 md:pb-36" aria-labelledby="kolekcija-naslov">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 md:mb-12">
          <h2 id="kolekcija-naslov" className="display text-6xl md:text-8xl">
            Prva kolekcija
          </h2>
        </div>
        <div className="reveal-grid grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-6 md:gap-y-14 lg:grid-cols-3">
          {sets.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/kolekcija" className="btn btn-quiet">
            Pogledaj celu kolekciju
          </Link>
        </div>
      </section>

      <section className="wrap grid gap-y-10 pb-24 md:grid-cols-12 md:gap-x-6 md:pb-36" aria-labelledby="prica-naslov">
        <div className="reveal relative aspect-[622/772] bg-blush-soft md:col-span-5">
          <Image
            src="/img/grupa-pod.jpg"
            alt="Tri devojke u CHÉRI WEAR kompletima sede na prostirci za vežbanje"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="reveal md:col-span-6 md:col-start-7 md:pt-24">
          <h2 id="prica-naslov" className="display text-5xl md:text-7xl">
            Od ideje do tvog omiljenog kompleta.
          </h2>
          <div className="mt-6 max-w-[34rem] space-y-4 text-lg leading-relaxed">
            <p>
              CHÉRI WEAR je mali domaći brend sportske odeće. Krenuli smo od jednostavne ideje: komplet u kojem se
              osećaš dobro i dok treniraš i kad izađeš iz sale.
            </p>
            <p>
              Svaki komad se izrađuje ručno, u Srbiji, sa pažnjom prema kroju, šavu i materijalu. Bez žurbe i bez
              kompromisa oko toga kako stoji na telu.
            </p>
          </div>
          <Link href="/nasa-prica" className="link mt-7 inline-block py-2 font-semibold">
            Pročitaj našu priču
          </Link>
        </div>
      </section>

      <section className="pb-14 md:pb-36" aria-labelledby="boje-naslov">
        <div className="reveal wrap mb-8 md:mb-12 md:grid md:grid-cols-12 md:gap-x-6">
          <h2 id="boje-naslov" className="display text-6xl md:col-span-7 md:col-start-6 md:text-8xl">
            Jedan kroj, tri boje
          </h2>
        </div>
        <ul className="reveal snap-row gap-3 px-[1.125rem] md:wrap md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
          {sets.map((set, i) => (
            <li key={set.slug} className={`w-[74%] md:w-auto ${["md:mt-24", "", "md:mt-12"][i]}`}>
              <Link href={`/proizvod/${set.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-blush-soft">
                  <Image
                    src={set.photos[1].src}
                    alt={set.photos[1].alt}
                    fill
                    sizes="(min-width: 768px) 30vw, 74vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="flex items-center gap-2.5 font-semibold">
                    <span className="size-4 rounded-full" style={{ background: COLORS[set.color].hex }} />
                    {COLORS[set.color].name}
                  </p>
                  <p className="text-mute tabular-nums">Komplet, {formatPrice(set.price)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative mt-10 md:mt-28" aria-labelledby="srbija-naslov">
        <div className="v-top absolute inset-0 bg-blush" />
        <div className="wrap relative grid gap-y-10 pt-20 pb-20 md:grid-cols-12 md:gap-x-6 md:pt-28 md:pb-28">
          <div className="reveal md:col-span-5 md:self-center">
            <CherryMark className="size-14 text-cherry" />
            <h2 id="srbija-naslov" className="display mt-5 text-[19vw] text-cherry md:text-[min(9.5vw,9rem)]">
              Sa ljubavlju, u Srbiji.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed">
              Od kroja do poslednjeg šava, CHÉRI nastaje ovde. Lokalna izrada znači da svaki komad prođe kroz naše
              ruke pre nego što stigne u tvoje.
            </p>
            <dl className="mt-8 max-w-md divide-y divide-ink/15 border-y border-ink/15">
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-ink/75">Materijal</dt>
                <dd className="text-right font-semibold">{FABRIC.name}</dd>
              </div>
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-ink/75">Sastav</dt>
                <dd className="text-right font-semibold">{FABRIC.composition}</dd>
              </div>
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-ink/75">Rastegljivost</dt>
                <dd className="text-right font-semibold">U sva četiri smera</dd>
              </div>
            </dl>
          </div>
          <div className="reveal relative aspect-[1088/800] bg-blush-soft md:col-span-6 md:col-start-7 md:self-center">
            <Image
              src="/img/hero-plank.jpg"
              alt="Crni i sivi CHÉRI komplet tokom vežbe na prostirci"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="wrap grid items-center gap-8 py-24 md:grid-cols-12 md:gap-x-6 md:py-36" aria-labelledby="instagram-naslov">
        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Otvori Instagram profil @cheriiwear"
          className="reveal relative block aspect-square max-w-64 overflow-hidden md:col-span-3"
        >
          <Image
            src="/img/logo-cheri.jpg"
            alt=""
            fill
            sizes="16rem"
            className="object-cover transition-transform duration-700 hover:scale-[1.04]"
          />
        </a>
        <div className="reveal md:col-span-8 md:col-start-5">
          <h2 id="instagram-naslov" className="display text-5xl md:text-7xl">
            Follow the Chéri story
          </h2>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn btn-quiet mt-7">
            @cheriiwear na Instagramu
          </a>
        </div>
      </section>
    </>
  );
}
