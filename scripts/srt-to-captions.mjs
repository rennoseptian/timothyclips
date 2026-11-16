// Ubah public/Caption/*.srt menjadi src/captions.ts (array Caption per kata).
// Pakai: node scripts/srt-to-captions.mjs "public/Caption/nama-file.srt"
//
// SRT hanya punya waktu per baris, jadi waktu tiap kata diperkirakan
// secara proporsional terhadap panjang katanya di dalam baris tersebut.
import { readFileSync, writeFileSync } from "node:fs";

const input = process.argv[2] ?? "public/Caption/keluarga-sederhana-6.34-6.58.srt";
const output = process.argv[3] ?? "src/captions.ts";

const toMs = (s) => {
  const [h, m, rest] = s.trim().split(":");
  const [sec, ms] = rest.split(",");
  return (+h * 3600 + +m * 60 + +sec) * 1000 + +ms;
};

const blocks = readFileSync(input, "utf8")
  .replace(/\r/g, "")
  .trim()
  .split(/\n\n+/);

const words = [];
for (const block of blocks) {
  const lines = block.split("\n");
  const time = lines.find((l) => l.includes("-->"));
  if (!time) continue;
  const [a, b] = time.split("-->");
  const start = toMs(a);
  const end = toMs(b);
  const text = lines.slice(lines.indexOf(time) + 1).join(" ").trim();
  const tokens = text.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) continue;

  // bobot = panjang kata + jeda kecil untuk tanda baca
  const weights = tokens.map((t) => t.length + (/[.,?!]$/.test(t) ? 3 : 0));
  const total = weights.reduce((x, y) => x + y, 0);
  let cursor = start;
  tokens.forEach((t, i) => {
    const dur = ((end - start) * weights[i]) / total;
    const s = Math.round(cursor);
    const e = Math.round(cursor + dur);
    words.push({ text: t, startMs: s, endMs: e });
    cursor += dur;
  });
}

const body = words
  .map(
    (w) =>
      `  { text: ${JSON.stringify(w.text)}, startMs: ${w.startMs}, endMs: ${w.endMs}, timestampMs: ${Math.round((w.startMs + w.endMs) / 2)}, confidence: null },`
  )
  .join("\n");

writeFileSync(
  output,
  `// File ini dibuat otomatis oleh scripts/srt-to-captions.mjs dari ${input}
// Waktu per kata adalah perkiraan di dalam tiap baris SRT.
import type { Caption } from "@remotion/captions";

export const captions: Caption[] = [
${body}
];
`
);

console.log(`${words.length} kata -> ${output}`);
