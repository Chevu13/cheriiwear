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
export type Photo = { src: string; alt: string };
export type Product = {
  slug: string;
  name: string; // DEMO naziv
  color: ColorId;
  price: number; // DEMO cena u RSD
  parts: string[]; // delovi za koje se bira veličina; [""] znači jedna veličina
  description: string;
  photos: Photo[];
};

const p = (file: string, alt: string): Photo => ({ src: `/img/${file}.jpg`, alt });

const SET = {
  name: "Chéri komplet",
  price: 8900,
  parts: ["Top", "Helanke"],
  description:
    "Top i helanke u istoj boji, sa belom paspul trakom i izvezenom trešnjom. Veličinu biraš posebno za top, posebno za helanke.",
};

// Početni artikli. U demo adminu mogu da se menjaju, brišu i dodaju (lib/catalog.ts).
// Photos in public/img are hand-picked by the brand and shown whole, never cropped.
export const products: Product[] = [
  {
    slug: "komplet-crna",
    color: "crna",
    ...SET,
    photos: [
      p("studio-crna", "Crni Chéri komplet u pilates studiju. Kreirane da traju, mekan i prijatan osećaj na koži"),
      p("objava-poliamid", "Crni Chéri komplet na pilates reformeru. Poliamid: mekan, elastičan, prijatan za kožu"),
    ],
  },
  {
    slug: "komplet-siva",
    color: "siva",
    ...SET,
    photos: [
      p("studio-siva", "Sivi Chéri komplet u pilates studiju. 78% poliamid, 22% elastin, elastični u sva 4 smera"),
      p("objava-helanke-duze-traju", "Sivi i crni Chéri komplet tokom vežbe na prostirci. Kako da ti helanke duže traju?"),
    ],
  },
  {
    slug: "komplet-lila",
    color: "lila",
    ...SET,
    photos: [
      p("studio-lila", "Lila Chéri komplet u pilates studiju. Materijali koji oblikuju telo, nisu providni"),
      p("lila-reformer", "Lila Chéri komplet na pilates reformeru"),
    ],
  },
];

// Fotografije koje se u demo adminu mogu izabrati kao glavna slika artikla.
export const PHOTO_LIBRARY = [
  "studio-crna",
  "studio-siva",
  "studio-lila",
  "objava-poliamid",
  "lila-reformer",
  "objava-helanke-duze-traju",
  "objava-sta-smo-izabrali",
  "grupa-studio",
].map((file) => `/img/${file}.jpg`);

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

// DEMO utisci: izmišljeni primeri, zameniti utiscima stvarnih kupaca pre objave.
export const REVIEWS = [
  { name: "Ime kupca 1", item: "Komplet, lila", text: "Primer utiska: materijal je mekan, a helanke ostaju na mestu tokom celog treninga." },
  { name: "Ime kupca 2", item: "Komplet, crna", text: "Primer utiska: veličina odgovara tabeli, a porudžbina je bila gotova za minut." },
  { name: "Ime kupca 3", item: "Komplet, siva", text: "Primer utiska: nosim ga i na pilatesu i u gradu. Kroj lepo stoji." },
];

export const INSTAGRAM = "https://www.instagram.com/cheriiwear/";

const rsd = new Intl.NumberFormat("sr-Latn-RS");
export const formatPrice = (n: number) => `${rsd.format(n)} RSD`;
