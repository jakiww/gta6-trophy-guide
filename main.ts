// Leonida Trophy Atlas — entry program for the gta6-trophy-guide-01 bounty.
// Node 22, standard library only, no network. It copies app/ and screenshots/
// from this repository into $MAKEFUN_OUTPUT_DIR (default /output) and writes
// /output/dossier.json with buildDossier from vendor/makefun-frontend.ts.
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

if (!existsSync(join(root, "app", "index.html"))) {
  throw new Error("app/index.html is missing: refusing to hand in an empty guide");
}

mkdirSync(outDir, { recursive: true });
cpSync(join(root, "app"), join(outDir, "app"), { recursive: true });
if (existsSync(join(root, "screenshots"))) {
  cpSync(join(root, "screenshots"), join(outDir, "screenshots"), { recursive: true });
}

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
});
writeFileSync(join(outDir, "dossier.json"), dossier);
console.log(`Leonida Trophy Atlas handed in: ${outDir} (${dossier.length} bytes of dossier)`);
