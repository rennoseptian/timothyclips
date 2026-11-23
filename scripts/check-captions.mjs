// Pastikan setiap caption di src/script.ts memang diucapkan di SRT, pada waktu yang masuk akal.
// Pakai: node scripts/check-captions.mjs [path.srt]
// Waktu per kata di SRT adalah perkiraan (SRT hanya punya waktu per baris), jadi toleransinya 1,0 dtk.
import { readFileSync } from "node:fs";
import { CAPTIONS } from "../src/script.ts";

const srt = process.argv[2] ?? "public/Caption/77k-ugH5yF0-1.37.16-1.37.50.srt";
const TOL = 1.0;

const toS = (s) => {
  const [h, m, r] = s.trim().split(":");
  const [sec, ms] = r.split(",");
  return +h * 3600 + +m * 60 + +sec + +ms / 1000;
};
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, "");

const words = [];
for (const block of readFileSync(srt, "utf8").replace(/\r/g, "").trim().split(/\n\n+/)) {
  const L = block.split("\n");
  const [a, e] = L[1].split("-->").map(toS);
  const toks = L.slice(2).join(" ").split(/\s+/).filter(Boolean);
  const w = toks.map((t) => t.length + (/[.,?!]$/.test(t) ? 3 : 0));
  const tot = w.reduce((x, y) => x + y, 0);
  let c = a;
  toks.forEach((t, i) => {
    words.push({ w: norm(t), t: c });
    c += ((e - a) * w[i]) / tot;
  });
}

let bad = 0;
for (const ev of CAPTIONS) {
  for (const line of ev.lines) {
    const target = line.text.split(/\s+/).map(norm);
    let found = false;
    for (let i = 0; i + target.length <= words.length; i++) {
      if (target.every((w, k) => words[i + k].w === w) && Math.abs(words[i].t - line.at) <= TOL) {
        found = true;
        break;
      }
    }
    if (!found) {
      bad++;
      console.log(`TIDAK COCOK  @${line.at}s  "${line.text}"`);
    }
  }
}
const n = CAPTIONS.reduce((a, e) => a + e.lines.length, 0);
console.log(bad === 0 ? `OK: ${n} baris caption cocok dengan ucapan di SRT` : `${bad} dari ${n} baris tidak cocok`);
process.exit(bad === 0 ? 0 : 1);
