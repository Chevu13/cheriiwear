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

const p = (file: string, alt: string, pos?: string): Photo => ({
  src: `/images/${file}.jpg`,
  alt,
  pos,
});

const PHOTOS: Record<`${StyleId}-${ColorId}`, Photo[]> = {
  "komplet-crna": [
    p("crna-studio", "Crni Chéri komplet, top i helanke sa belom trakom"),
    p("crna-pilates", "Crni komplet u pilates studiju, detalj pojasa"),
    p("plank-crna", "Crni komplet tokom vežbe na prostirci"),
    p("grupa-studio", "Chéri kompleti u tri boje u studiju"),
  ],
  "komplet-siva": [
    p("siva-lopta", "Sivi Chéri komplet tokom vežbe na pilates lopti"),
    p("siva-studio", "Sivi komplet, top i helanke sa belom trakom"),
    p("siva-pilates", "Sivi komplet u pilates studiju, detalj pojasa"),
    p("plank-siva", "Sivi komplet tokom vežbe na prostirci"),
  ],
  "komplet-lila": [
    p("lila-studio", "Lila Chéri komplet, top i helanke sa belom trakom"),
    p("lila-reformer", "Lila komplet na pilates reformeru", "65% center"),
    p("lila-sedi", "Lila komplet, pogled spreda"),
    p("grupa-pod", "Chéri kompleti u tri boje"),
  ],
  "top-crna": [
    p("crna-top", "Crni Chéri top sa belom trakom"),
    p("plank-crna", "Crni top tokom vežbe na prostirci", "30% center"),
  ],
  "top-siva": [
    p("siva-top", "Sivi Chéri top sa belom trakom"),
    p("plank-siva", "Sivi top tokom vežbe na prostirci", "35% center"),
  ],
  "top-lila": [
    p("lila-top", "Lila Chéri top sa belom trakom"),
    p("lila-reformer-portret", "Lila top na pilates reformeru"),
  ],
  "helanke-crna": [
    p("crna-helanke", "Crne Chéri helanke sa V pojasom"),
    p("crna-helanke-studio", "Crne helanke, detalj pojasa i izvezene trešnje"),
    p("crna-pilates", "Crne helanke u pilates studiju"),
  ],
  "helanke-siva": [
    p("siva-helanke-detalj", "Sive Chéri helanke, detalj izvezene trešnje"),
    p("siva-helanke", "Sive helanke sa V pojasom"),
    p("siva-pilates", "Sive helanke u pilates studiju"),
  ],
  "helanke-lila": [
    p("lila-helanke", "Lila Chéri helanke sa V pojasom"),
    p("lila-reformer-portret", "Lila helanke na pilates reformeru"),
    p("lila-sedi", "Lila helanke, pogled spreda"),
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
