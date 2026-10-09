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

export const CATEGORIES = {
  kompleti: "Kompleti",
  topovi: "Topovi",
  helanke: "Helanke",
} as const;

export type ColorId = keyof typeof COLORS;
export type CategoryId = keyof typeof CATEGORIES;
type StyleId = "komplet" | "top" | "helanke";
type Photo = { src: string; alt: string; pos?: string };

const STYLES: Record<
  StyleId,
  {
    name: string; // DEMO naziv
    category: CategoryId;
    price: number; // DEMO cena u RSD
    parts: string[]; // delovi za koje se bira veličina
    description: string;
  }
> = {
  komplet: {
    name: "Chéri komplet",
    category: "kompleti",
    price: 8900,
    parts: ["Top", "Helanke"],
    description:
      "Top i helanke u istoj boji, sa belom paspul trakom i izvezenom trešnjom. Veličinu biraš posebno za top, posebno za helanke.",
  },
  top: {
    name: "Chéri top",
    category: "topovi",
    price: 3900,
    parts: [""],
    description:
      "Sportski top sa oblim izrezom i belom paspul trakom duž ivica. Nosi se uz helanke iste boje ili sam.",
  },
  helanke: {
    name: "Chéri helanke",
    category: "helanke",
    price: 5500,
    parts: [""],
    description:
      "Helanke sa preklopljenim V pojasom, belom paspul trakom i izvezenom trešnjom na kuku.",
  },
};

// Focal point per photograph (CSS object-position), so a crop can be tuned in one place.
// Anything not listed is anchored to the top, which keeps faces in frame on tall shots.
export const FOCUS: Record<string, string> = {
  "grupa-studio": "50% 20%",
  "hero-plank": "50% 50%",
  "plank-crna": "0% 50%",
  "plank-siva": "8% 50%",
  "crna-pilates": "50% 50%",
  "siva-pilates": "62% 50%",
  "lila-reformer": "65% 50%",
  "lila-reformer-portret": "50% 15%",
  "lila-sedi": "50% 8%",
  "siva-top": "50% 6%",
  "siva-helanke-detalj": "60% 50%",
  "crna-helanke": "50% 50%",
};
export const focal = (name: string) => ({ objectPosition: FOCUS[name] ?? "50% 0%" });

const p = (file: string, alt: string): Photo => ({
  src: `/images/${file}.jpg`,
  alt,
  pos: FOCUS[file],
});

// The first photo is the product card; no two cards share a photograph.
const PHOTOS: Record<`${StyleId}-${ColorId}`, Photo[]> = {
  "komplet-crna": [
    p("crna-pilates", "Crni Chéri komplet u pilates studiju"),
    p("crna-studio", "Crni Chéri komplet, top i helanke sa belom trakom"),
    p("plank-crna", "Crni komplet tokom vežbe na prostirci"),
    p("grupa-studio", "Chéri kompleti u tri boje u studiju"),
  ],
  "komplet-siva": [
    p("siva-pilates", "Sivi Chéri komplet u pilates studiju"),
    p("siva-lopta", "Sivi komplet tokom vežbe na pilates lopti"),
    p("siva-studio", "Sivi komplet, top i helanke sa belom trakom"),
    p("plank-siva", "Sivi komplet tokom vežbe na prostirci"),
  ],
  "komplet-lila": [
    p("lila-reformer-portret", "Lila Chéri komplet na pilates reformeru"),
    p("lila-studio", "Lila komplet, top i helanke sa belom trakom"),
    p("lila-sedi", "Lila komplet, pogled spreda"),
    p("grupa-pod", "Chéri kompleti u tri boje"),
  ],
  "top-crna": [
    p("plank-crna", "Crni Chéri top tokom vežbe na prostirci"),
    p("crna-top", "Crni top sa belom trakom"),
  ],
  "top-siva": [
    p("plank-siva", "Sivi Chéri top tokom vežbe na prostirci"),
    p("siva-top", "Sivi top sa belom trakom"),
  ],
  "top-lila": [
    p("lila-top", "Lila Chéri top sa belom trakom"),
    p("lila-sedi", "Lila top, pogled spreda"),
  ],
  "helanke-crna": [
    p("crna-helanke-studio", "Crne Chéri helanke, detalj pojasa i izvezene trešnje"),
    p("crna-helanke", "Crne helanke sa V pojasom u pilates studiju"),
  ],
  "helanke-siva": [
    p("siva-helanke-detalj", "Sive Chéri helanke, detalj izvezene trešnje"),
    p("siva-helanke", "Sive helanke sa V pojasom"),
  ],
  "helanke-lila": [
    p("lila-helanke", "Lila Chéri helanke sa V pojasom"),
    p("lila-reformer", "Lila helanke na pilates reformeru"),
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
