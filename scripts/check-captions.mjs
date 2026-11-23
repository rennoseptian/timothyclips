// Cek cepat: tiap caption harus cocok dengan kata yang diucapkan pada waktunya (words.json),
// berurutan, dan caption "di belakang subjek" tidak boleh saling tumpang tindih.
// Jalankan: node scripts/check-captions.mjs
import { readFileSync } from "node:fs";
import { CAPTIONS, START_SEC } from "../src/script.ts";

const words = JSON.parse(readFileSync(new URL("./words.json", import.meta.url), "utf-8"));
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, "");
let bad = 0;
let prev = -1;
let prevBehindEnd = -1;
for (const [i, c] of CAPTIONS.entries()) {
  const first = norm(c.lines[0].map((s) => s.t).join(" ").split(" ")[0]);
  const hit = words.find((w) => norm(w.w) === first && Math.abs(w.t0 - START_SEC - c.at) < 0.4);
  if (!hit) {
    console.log(`#${i + 1} @${c.at}s: kata "${first}" tidak ditemukan di sekitar waktu itu`);
    bad++;
  }
  if (c.at < prev) { console.log(`#${i + 1}: urutan waktu mundur`); bad++; }
  if (c.end <= c.at) { console.log(`#${i + 1}: end <= at`); bad++; }
  if (c.behind) {
    if (c.at < prevBehindEnd) { console.log(`#${i + 1}: tumpang tindih dengan caption belakang sebelumnya`); bad++; }
    prevBehindEnd = c.end;
  }
  prev = c.at;
}
console.log(bad ? `${bad} masalah` : `OK: ${CAPTIONS.length} caption cocok dengan ucapan`);
process.exit(bad ? 1 : 0);
