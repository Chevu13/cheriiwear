import type { Metadata } from "next";

export const metadata: Metadata = { title: "Informacije" };

// Placeholders only: the brand supplies the real policies before launch.
const sections = [
  ["dostava", "Dostava", "Način dostave, rokove i cenu isporuke"],
  ["povrat", "Povraćaj i zamena", "Uslove zamene veličine i povraćaja"],
  ["privatnost", "Privatnost", "Politiku privatnosti i obradu podataka o ličnosti"],
  ["uslovi", "Uslovi korišćenja", "Uslove kupovine i korišćenja sajta"],
] as const;

export default function Info() {
  return (
    <div className="wrap pt-10 pb-24 md:pt-16 md:pb-36">
      <h1 className="display text-7xl md:text-9xl">Informacije</h1>
      <div className="mt-10 max-w-3xl divide-y divide-line border-y border-line">
        {sections.map(([id, title, what]) => (
          <section key={id} id={id} className="scroll-mt-24 py-8">
            <h2 className="display text-4xl">{title}</h2>
            <p className="mt-3 text-lg text-mute">{what} dodaje CHÉRI WEAR pre objave sajta.</p>
          </section>
        ))}
      </div>
    </div>
  );
}
