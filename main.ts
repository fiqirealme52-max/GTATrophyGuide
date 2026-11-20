// Neon Bay Trophy Guide — the program that hands the guide in (Node 22, standard library only).
// The guide itself is plain static files in app/ (index.html, style.css, app.js and
// data/trophies.json — no build step, nothing fetched over the network), plus 3–4 real browser
// screenshots in screenshots/. This program copies both folders from beside this file into
// /output and writes /output/dossier.json with the vendored make.fun library, exactly as the
// kit's starter did. Leave vendor/makefun-frontend.ts untouched: the scorer rebuilds the
// dossier with its own copy and requires the two to match byte for byte.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// It is deterministic: two runs over the same tree write the same dossier.json bytes, which
// the grader checks by running it twice.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the
// others refuse an entry the scorer would refuse (more than 4 screenshots or one over
// 256 KiB; more than 993 files and directories in app/ or 48 MiB of app files: app/ counts
// beside /output's own 1000-entry cap, its screenshots/ and dossier.json). Keep the app
// small — it is a handful of files, and the first load is just index.html, style.css,
// app.js and the trophy data the page fetches on open.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
