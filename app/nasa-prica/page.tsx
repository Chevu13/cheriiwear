import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CARE, FABRIC } from "@/lib/products";

// The brand's own care posts, shown whole; the tips are repeated in the alt text.
const carePosts = [
  ["objava-helanke-duze-traju", "Kako da ti helanke duže traju? 3 saveta."],
  ["objava-peri-pazljivo", `Peri ih pažljivo: ${CARE.do.join(", ")}.`],
  ["objava-izbegavaj", `Izbegavaj ovo: ${CARE.avoid.join(", ")}.`],
];

export const metadata: Metadata = {
  title: "Naša priča",
  description: "CHÉRI WEAR je mali domaći brend sportske odeće, ručno izrađene u Srbiji.",
};

export default function Story() {
  return (
    <>
      <section className="wrap grid gap-y-10 pt-10 pb-20 md:grid-cols-12 md:gap-x-6 md:pt-16 md:pb-32">
        <div className="md:col-span-7">
          <h1 className="display text-[17vw] text-cherry md:text-[min(9vw,9rem)]">
            Od ideje do tvog omiljenog kompleta.
          </h1>
          <div className="mt-8 max-w-[34rem] space-y-5 text-lg leading-relaxed">
            <p>
              CHÉRI WEAR je mali, nezavisan brend sportske odeće iz Srbije. Pravimo komade za pilates, trening i sve
              ono između, za žene koje žele da se u pokretu osećaju sigurno i svoje.
            </p>
            <p>
              Verujemo da dobar komplet ne mora da bira između toga kako izgleda i kako se nosi. Zato svaki komad
              izrađujemo ručno, ovde, i pratimo ga od kroja do poslednjeg šava.
            </p>
            <p className="font-semibold">Made to move. Made to feel confident.</p>
          </div>
        </div>
        <div className="relative aspect-[4/5] bg-blush-soft md:col-span-5 md:mt-20">
          <Image
            src="/img/objava-sta-smo-izabrali.jpg"
            alt="Šta smo mi izabrali? Za naš prvi sportski komad odabrali smo Vita Zodiaco materijal, sa fokusom na rastegljivost, prijatan osećaj i funkcionalnost tokom pokreta."
            fill
            priority
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="relative" aria-labelledby="materijal">
        <div className="v-top absolute inset-0 bg-blush" />
        <div className="wrap relative grid gap-y-10 py-20 md:grid-cols-12 md:gap-x-6 md:py-32">
          <div className="reveal relative aspect-[4/5] bg-blush-soft md:col-span-5">
            <Image
              src="/img/objava-poliamid.jpg"
              alt="Poliamid (PA): mekan i gladak na dodir, veoma elastičan, prijatan za kožu, dobro prati pokrete tela, često se koristi za kvalitetnu sportsku odeću."
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="reveal md:col-span-6 md:col-start-7 md:self-center">
            <h2 id="materijal" className="display text-5xl md:text-7xl">
              Šta smo izabrali
            </h2>
            <p className="mt-6 text-lg leading-relaxed">
              Za naš prvi sportski komad odabrali smo {FABRIC.name} materijal, sa fokusom na rastegljivost, prijatan
              osećaj i funkcionalnost tokom pokreta.
            </p>
            <p className="display mt-8 text-4xl text-cherry md:text-5xl">{FABRIC.composition}</p>
            <ul className="mt-5 divide-y divide-ink/15 border-y border-ink/15">
              {FABRIC.notes.map((note) => (
                <li key={note} className="py-3">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32" aria-labelledby="nega">
        <h2 id="nega" className="reveal wrap display mb-8 text-5xl md:mb-12 md:text-7xl">
          Kako da ti helanke duže traju
        </h2>
        <ul className="reveal snap-row gap-3 px-[1.125rem] md:wrap md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
          {carePosts.map(([name, alt]) => (
            <li key={name} className="relative aspect-[4/5] w-[82%] bg-blush-soft md:w-auto">
              <Image src={`/img/${name}.jpg`} alt={alt} fill sizes="(min-width: 768px) 30vw, 82vw" className="object-cover" />
            </li>
          ))}
        </ul>
        <div className="wrap mt-12">
          <Link href="/kolekcija" className="btn">
            Istraži kolekciju
          </Link>
        </div>
      </section>
    </>
  );
}
