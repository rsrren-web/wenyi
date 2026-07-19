import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const docs = resolve(root, "docs");

// Recreate the deployment directory so obsolete hashed assets cannot accumulate.
await rm(docs, { recursive: true, force: true });
await mkdir(docs, { recursive: true });
await cp(dist, docs, { recursive: true });

// GitHub Pages serves this entry for unknown paths. Keeping the requested URL
// lets the client router render direct links such as /wenyi/hexagrams/53.
const entry = await readFile(resolve(dist, "index.html"));
await writeFile(resolve(docs, "404.html"), entry);
await writeFile(resolve(docs, ".nojekyll"), "\n");

console.log("Prepared docs/ with fresh assets and SPA route fallback.");
