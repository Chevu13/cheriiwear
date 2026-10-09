import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CARE, FABRIC } from "@/lib/products";

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
        <div className="relative aspect-[775/1076] bg-blush-soft md:col-span-5 md:mt-20">
          <Image
            src="/images/grupa-studio.jpg"
            alt="Tri devojke u CHÉRI WEAR kompletima u pilates studiju"
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
          <div className="reveal relative aspect-[1088/800] bg-blush-soft md:col-span-6">
            <Image
              src="/images/hero-plank.jpg"
              alt="Crni i sivi CHÉRI komplet tokom vežbe na prostirci"
              fill
              sizes="(min-width: 768px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="reveal md:col-span-5 md:col-start-8 md:self-center">
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

      <section className="wrap grid gap-y-12 py-20 md:grid-cols-12 md:gap-x-6 md:py-32" aria-labelledby="nega">
        <h2 id="nega" className="reveal display text-5xl md:col-span-5 md:text-7xl">
          Kako da ti helanke duže traju
        </h2>
        <div className="reveal grid gap-10 sm:grid-cols-2 md:col-span-6 md:col-start-7">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Peri ih pažljivo</h3>
            <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
              {CARE.do.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Izbegavaj ovo</h3>
            <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
              {CARE.avoid.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ol>
          </div>
        </div>
        <div className="md:col-span-12">
          <Link href="/kolekcija" className="btn">
            Istraži kolekciju
          </Link>
        </div>
      </section>
    </>
  );
}
