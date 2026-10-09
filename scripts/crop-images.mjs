// Cuts clean photo regions out of the Instagram graphics in assets/originals
// into public/images. Originals are never modified. Run: npm run images
import sharp from "sharp";
import { readdirSync } from "node:fs";

const SRC = "assets/originals";
const OUT = "public/images";
const files = readdirSync(SRC);

// name: [original id, left, top, width, height]
const crops = {
  "hero-plank": ["810867894", 0, 285, 1088, 800],
  "plank-crna": ["810867894", 150, 520, 650, 565],
  "plank-siva": ["810867894", 470, 400, 618, 480],
  "grupa-studio": ["797939421", 0, 268, 775, 1076],
  "lila-sedi": ["797939421", 440, 690, 335, 654],
  "siva-lopta": ["817390793", 0, 248, 800, 1096],
  "siva-helanke-detalj": ["817390793", 380, 600, 420, 520],
  "lila-reformer": ["795507990", 184, 437, 722, 724],
  "lila-reformer-portret": ["795507990", 400, 600, 400, 560],
  "grupa-pod": ["817719320", 234, 434, 622, 772],
  "lila-studio": ["801882132", 0, 625, 472, 1063],
  "crna-studio": ["801882132", 473, 827, 445, 861],
  "siva-studio": ["801882132", 999, 641, 351, 1047],
  "lila-top": ["801882132", 0, 625, 459, 658],
  "crna-top": ["801882132", 473, 827, 445, 557],
  "siva-top": ["801882132", 999, 641, 351, 658],
  "lila-helanke": ["801882132", 0, 1130, 486, 430],
  "crna-helanke-studio": ["801882132", 486, 1240, 405, 400],
  "siva-helanke": ["801882132", 945, 1180, 405, 420],
  "crna-pilates": ["803101267", 378, 582, 486, 532],
  "crna-helanke": ["803101267", 405, 709, 486, 405],
  "siva-pilates": ["807577886", 324, 591, 500, 557],
  "logo-cheri": ["800224139", 0, 0, 1080, 1080],
};

for (const [name, [id, left, top, width, height]] of Object.entries(crops)) {
  const file = files.find((f) => f.includes(id));
  await sharp(`${SRC}/${file}`)
    .extract({ left, top, width, height })
    .jpeg({ quality: 92 })
    .toFile(`${OUT}/${name}.jpg`);
}
console.log(`${Object.keys(crops).length} images written to ${OUT}`);
