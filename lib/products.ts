// CHÉRI WEAR — demo katalog.
// Sve što je ovde označeno sa DEMO treba zameniti pravim podacima brenda:
// cene, nazivi modela, dostupne veličine i tabela mera.
// Sastav, materijal i saveti za održavanje preuzeti su iz objava @cheriiwear
// i treba ih potvrditi sa brendom pre objave.

export const SIZES = ["XS", "S", "M", "L", "XL"] as const; // DEMO

export const COLORS = {
  crna: { name: "Crna", hex: "#1d1c20" },
  siva: { name: "Siva", hex: "#6f7c86" },
  lila: { name: "Lila", hex: "#c4a9b9" },
} as const;

export type ColorId = keyof typeof COLORS;
type StyleId = "komplet";
type Photo = { src: string; alt: string };

const STYLES: Record<
  StyleId,
  {
    name: string; // DEMO naziv
    price: number; // DEMO cena u RSD
    parts: string[]; // delovi za koje se bira veličina
    description: string;
  }
> = {
  komplet: {
    name: "Chéri komplet",
    price: 8900,
    parts: ["Top", "Helanke"],
    description:
      "Top i helanke u istoj boji, sa belom paspul trakom i izvezenom trešnjom. Veličinu biraš posebno za top, posebno za helanke.",
  },
};

const p = (file: string, alt: string): Photo => ({ src: `/img/${file}.jpg`, alt });

// Photos in public/img are hand-picked by the brand and shown whole, never cropped.
const PHOTOS: Record<`${StyleId}-${ColorId}`, Photo[]> = {
  "komplet-crna": [
    p("studio-crna", "Crni Chéri komplet u pilates studiju. Kreirane da traju, mekan i prijatan osećaj na koži"),
    p("objava-poliamid", "Crni Chéri komplet na pilates reformeru. Poliamid: mekan, elastičan, prijatan za kožu"),
  ],
  "komplet-siva": [
    p("studio-siva", "Sivi Chéri komplet u pilates studiju. 78% poliamid, 22% elastin, elastični u sva 4 smera"),
    p("objava-helanke-duze-traju", "Sivi i crni Chéri komplet tokom vežbe na prostirci. Kako da ti helanke duže traju?"),
  ],
  "komplet-lila": [
    p("studio-lila", "Lila Chéri komplet u pilates studiju. Materijali koji oblikuju telo, nisu providni"),
    p("lila-reformer", "Lila Chéri komplet na pilates reformeru"),
  ],
};

export const products = (Object.keys(STYLES) as StyleId[]).flatMap((style) =>
  (Object.keys(COLORS) as ColorId[]).map((color) => ({
    slug: `${style}-${color}`,
    style,
    color,
    ...STYLES[style],
    photos: PHOTOS[`${style}-${color}`],
  })),
);

export type Product = (typeof products)[number];

export const getProduct = (slug: string) => products.find((x) => x.slug === slug);

// Iz objava @cheriiwear — potvrditi sa brendom.
export const FABRIC = {
  name: "Vita Zodiaco",
  composition: "78% poliamid, 22% elastin",
  notes: ["Elastično u sva četiri smera", "Mekan i prijatan osećaj na koži", "Zadržava oblik i nakon mnogo nošenja"],
};

export const CARE = {
  do: ["Biraj nižu temperaturu pranja", "Okreni ih naopako pre pranja", "Peri ih sa sličnim, nežnijim materijalima"],
  avoid: [
    "Često sušenje na visokoj temperaturi",
    "Omekšivač kada nije preporučen za materijal",
    "Pranje sa rajsferšlusima i čičak-trakama",
  ],
};

// DEMO mere u cm — zameniti proverenom tabelom brenda.
export const SIZE_GUIDE: Record<"Topovi" | "Helanke", { columns: string[]; rows: Record<string, string[]> }> = {
  Topovi: { columns: ["Grudi", "Ispod grudi"], rows: { XS: ["78–82", "63–67"], S: ["83–87", "68–72"], M: ["88–92", "73–77"], L: ["93–97", "78–82"], XL: ["98–102", "83–87"] } },
  Helanke: { columns: ["Struk", "Kukovi"], rows: { XS: ["60–64", "86–90"], S: ["65–69", "91–95"], M: ["70–74", "96–100"], L: ["75–79", "101–105"], XL: ["80–84", "106–110"] } },
};

/** "M" for single pieces, "Top S / Helanke M" for sets. */
export const sizeLabel = (parts: readonly string[], sizes: readonly string[]) =>
  parts.map((part, i) => (part ? `${part} ${sizes[i]}` : sizes[i])).join(" / ");

export const INSTAGRAM ="https://www.instagram.com/cheriiwear/";

const rsd = new Intl.NumberFormat("sr-Latn-RS");
export const formatPrice = (n: number) => `${rsd.format(n)} RSD`;
