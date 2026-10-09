import Link from "next/link";
import { CATEGORIES, INSTAGRAM } from "@/lib/products";
import { Logo } from "./Logo";

const item = "block py-1.5 text-ivory/80 hover:text-ivory";

export function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="wrap grid gap-10 py-16 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="sm:col-span-3 lg:col-span-1">
          <Logo onDark className="text-4xl" />
          <p className="mt-4 max-w-xs text-ivory/80">
            Made to move. Made to feel confident. Sportska odeća ručno izrađena u Srbiji.
          </p>
        </div>
        <nav aria-label="Kupovina">
          <h2 className="mb-3 font-semibold">Kupovina</h2>
          {Object.entries(CATEGORIES).map(([id, name]) => (
            <Link key={id} href={`/kolekcija?kategorija=${id}`} className={item}>
              {name}
            </Link>
          ))}
        </nav>
        <nav aria-label="Brend">
          <h2 className="mb-3 font-semibold">Brend</h2>
          <Link href="/nasa-prica" className={item}>
            Naša priča
          </Link>
          <Link href="/kontakt" className={item}>
            Kontakt
          </Link>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={item}>
            Instagram
          </a>
        </nav>
        <nav aria-label="Informacije">
          <h2 className="mb-3 font-semibold">Informacije</h2>
          <Link href="/informacije#dostava" className={item}>
            Dostava
          </Link>
          <Link href="/informacije#povrat" className={item}>
            Povraćaj i zamena
          </Link>
          <Link href="/informacije#privatnost" className={item}>
            Privatnost
          </Link>
          <Link href="/informacije#uslovi" className={item}>
            Uslovi korišćenja
          </Link>
        </nav>
      </div>
      <div className="wrap border-t border-ivory/15 py-5 text-sm text-ivory/70">
        © 2026 CHÉRI WEAR. Demo prezentacija sajta.
      </div>
    </footer>
  );
}
