// src/CartoonShort/makeAudio.mjs
// Gera os arquivos .wav do curta (música e efeitos) e grava em public/audio/.
// Rode uma vez, e de novo sempre que mudar o audio.ts:
//   npx tsx src/CartoonShort/makeAudio.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderAllAudio } from "./audio.ts";

// Este arquivo fica em <projeto>/src/CartoonShort/, então a pasta public/ é
// dois níveis acima. Assim funciona de qualquer pasta em que você rodar o comando.
const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, "..", "..", "public");

const startedAt = Date.now();
const files = renderAllAudio();
let totalBytes = 0;

for (const [relativePath, bytes] of Object.entries(files)) {
  const target = join(publicDir, relativePath);
    mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, bytes);
        totalBytes += bytes.length;
          console.log(`ok  public/${relativePath}  (${(bytes.length / 1024).toFixed(0)} KB)`);
          }

          const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
          console.log(
            `\nPronto: ${Object.keys(files).length} arquivos, ${(totalBytes / 1024 / 1024).toFixed(1)} MB, em ${seconds} s.`
            );