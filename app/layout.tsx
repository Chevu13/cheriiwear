import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Sans } from "next/font/google";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-anton" });
const instrument = Instrument_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-instrument" });

export const metadata: Metadata = {
  title: { default: "CHÉRI WEAR — Made to move", template: "%s | CHÉRI WEAR" },
  description:
    "CHÉRI WEAR je domaći brend sportske odeće. Helanke, topovi i kompleti za pilates i trening, ručno izrađeni u Srbiji.",
  openGraph: {
    title: "CHÉRI WEAR — Made to move",
    description: "Activewear koji prati svaki tvoj pokret. Ručno izrađeno u Srbiji.",
    images: ["/images/grupa-studio.jpg"],
    locale: "sr_RS",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#faf6f0" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr-Latn" data-scroll-behavior="smooth" className={`${anton.variable} ${instrument.variable}`}>
      <body>
        <a href="#sadrzaj" className="btn sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50">
          Preskoči na sadržaj
        </a>
        <p className="bg-ink px-4 py-2 text-center text-[0.8125rem] text-ivory">
          Demo prezentacija sajta. Cene i veličine su primer, porudžbine se ne šalju.
        </p>
        <Header />
        <main id="sadrzaj">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
