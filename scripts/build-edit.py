"""Bangun src/script.ts (semua keputusan edit) untuk klip kFhF0ArcMQs-2.24-2.55.

Semua ucapan jadi typography Montserrat: kata muncul SATU PER SATU (waktu tiap kata dari scripts/words.json),
tiap kata dari arah berbeda, 1-2 kata sebelumnya mengabur saat kata baru masuk, lalu semuanya menyatu jadi satu
lockup. Edit teks/penekanan di PHRASES, ukuran bingkai di SHOTS, lalu jalankan: python3 scripts/build-edit.py
Notasi teks:  baris dipisah " / ".  *KATA* = kata penting (sedang)  **KATA** = kata kunci besar
^KATA^ = hero merah raksasa di BELAKANG subjek.  Sisanya teks kecil (label).
"""
import json
import re
import sys

from PIL import ImageFont

START = 0.6            # klip kFhF0ArcMQs: 0.6 dtk pertama video putih (kilat), klip mulai saat pembicara muncul
END = 30.4             # durasi klip (detik, relatif START): video sumber 31.0 dtk, ucapan berakhir di "ubah" (~30.97 dtk sumber)
HOLD = 0.7             # detik: frame terakhir ditahan (audio senyap) supaya kata terakhir (UBAH) sempat terbaca sebelum turun ke hitam
TOTAL = END + HOLD
AUDIO_END = 30.4       # detik klip: audio utuh sampai akhir (tidak ada kalimat lain sesudah "ubah")
FPS = 30
MB = ImageFont.truetype("public/Fonts/Montserrat-Black.ttf", 1000)
LS = {"s": 0.16, "m": 0.0, "l": -0.01, "h": -0.01}  # letter-spacing per jenis (em), harus sama dengan Captions.tsx

# ---------------- KAMERA: (dari, sampai, zoom awal, zoom akhir, posisi wajah x, y, blur) ----------------
# wide 1.0 | MCU 1.35-1.5 | CU 1.55-1.9 | ECU ~2.0. Zoom pelan saja, tanpa goyang.
SHOTS = [
    (0.00, 2.20, 1.40, 1.48, 0.50, 0.42, 0),
    (2.20, 4.50, 1.00, 1.05, 0.50, 0.44, 10),
    (4.50, 6.70, 1.60, 1.70, 0.38, 0.42, 12),
    (6.70, 8.80, 1.35, 1.45, 0.64, 0.42, 12),
    (8.80, 11.00, 1.75, 1.90, 0.62, 0.40, 12),
    (11.00, 13.20, 1.00, 1.05, 0.50, 0.44, 10),
    (13.20, 15.00, 1.35, 1.45, 0.38, 0.42, 12),
    (15.00, 17.20, 1.60, 1.70, 0.62, 0.42, 12),
    (17.20, 19.30, 1.00, 1.05, 0.50, 0.44, 10),
    (19.30, 20.70, 1.40, 1.50, 0.64, 0.42, 12),
    (20.70, 23.00, 1.70, 1.85, 0.38, 0.40, 12),
    (23.00, 25.00, 1.00, 1.05, 0.50, 0.44, 10),
    (25.00, 27.10, 1.45, 1.55, 0.62, 0.42, 12),
    (27.10, 28.95, 1.75, 1.85, 0.62, 0.40, 14),
    (28.95, TOTAL, 2.00, 2.15, 0.38, 0.40, 14),
]

# ---------------- CAPTION: ([indeks frasa otomatis]) atau ((kata_dari, kata_sampai) indeks kata terfilter, inklusif), teks ----------------
PHRASES = [
    ((0, 5), "Jangan pernah / **BERGANTUNG** sama / *ORANG LAIN*"),
    ((6, 10), "Jangan pernah / **BERGANTUNG** sama / *KELUARGA*"),
    ((11, 14), "jangan pernah / **BERGANTUNG** sama"),
    ((15, 17), "lu itu / ^SENDIRI^"),
    ((18, 22), "dan kalau tahu / lu *SENDIRI*"),
    ((23, 27), "**SATU-SATUNYA** / hal yang lu bisa"),
    ((28, 31), "**KONTROL** itu adalah / ^OTAK^"),
    ((32, 35), "lu *KALIAN* / enggak bisa"),
    ((36, 41), "**MILIH** kok mau / lahir di *KELUARGA*"),
    ((42, 44), "**MISKIN** / atau / **KAYA**"),
    ((45, 50), "*KALIAN* enggak bisa / **MILIH** kok lahir"),
    ((51, 56), "di *KEBETULAN* / keluarga yang banyak / **HUTANG**"),
    ((57, 61), "*KALIAN* juga / enggak bisa **PILIH**"),
    ((62, 68), "ibaratnya / mau besok itu / **HUJAN** atau enggak"),
    ((69, 73), "tapi yang bisa / kita **LAKUKAN**"),
    ((74, 77), "adalah kita / ^UPGRADE^ / *OTAK*"),
    ((78, 81), "kita kita *ASA* / **SKILL**"),
    ((82, 86), "kita kita upgrade / *KEMAMPUAN* / **INTERNAL**"),
    ((87, 91), "kita *FOKUS* di / yang **INTERNAL**"),
    ((92, 96), "ya di / **MINDSET** / di *OTAK*"),
    ((97, 100), "yang kita bisa / ^UBAH^"),
]

# ---------------- bangun frasa otomatis dari words.json ----------------
words = [w for w in json.load(open("scripts/words.json")) if not w.get("x") and w["t1"] > START]
# SRT menyertakan "sesayang-sayangnya ya orang" setelah penanda (selesai): tidak terucap, sudah ditandai x oleh align-words.py.
cut = max(i for i, w in enumerate(words) if w["w"] == "ubah")
words = words[:cut + 1]
auto, cur = [], []
for x in words:
    if cur and (x["t0"] - cur[-1]["t1"] > 0.2 or len(cur) >= 4
                or sum(len(c["w"]) + 1 for c in cur) + len(x["w"]) > 26
                or re.search(r"[.,?!]$", cur[-1]["w"])):
        auto.append(cur)
        cur = []
    cur.append(x)
if cur:
    auto.append(cur)
auto = [None, None] + auto[2:] if False else auto  # indeks di PHRASES dihitung dari frasa ke-0 = "akan hidup lu cuman"
# frasa 0 dan 1 (sebelum START) sudah terbuang oleh filter; geser indeks
OFFSET = 0  # jumlah frasa otomatis sebelum START pada daftar lengkap tak berfilter

def parse_line(line):
    """Pecah satu baris DSL menjadi daftar (kata, jenis); span multi-kata dipecah per kata."""
    toks = []
    for m in re.finditer(r"\^([^^]+)\^|\*\*([^*]+)\*\*|\*([^*]+)\*|([^*^]+)", line):
        kind, span = ("h", m.group(1)) if m.group(1) else ("l", m.group(2)) if m.group(2) else ("m", m.group(3)) if m.group(3) else ("s", m.group(4))
        for w in span.split():
            toks.append((w, kind))
    return toks

if "--print" in sys.argv:
    print(" ".join(f'{i}:{w["w"]}@{w["t0"]:.2f}' for i, w in enumerate(words)))
    sys.exit(0)

norm = lambda t: re.sub(r"[^a-z0-9']", "", t.lower())
caps = []
for entry in PHRASES:
    idxs, text = entry[0], entry[1]
    ws = words[idxs[0]:idxs[1] + 1] if isinstance(idxs, tuple) else [w for i in idxs for w in auto[i - OFFSET]]
    if len(entry) > 2:
        ws = ws[entry[2][0]:entry[2][1]]
    lines = [parse_line(l.strip()) for l in text.split(" / ")]
    flat = [t for l in lines for t in l]
    assert len(flat) == len(ws) and all(norm(a) == norm(b["w"]) for (a, _), b in zip(flat, ws)), (idxs, [a for a, _ in flat], [b["w"] for b in ws])
    k = 0
    out_lines = []
    for l in lines:
        row = []
        for w, kind in l:
            word = ws[k]; k += 1
            row.append({"t": w.rstrip(".,?!") if kind != "s" else w, "k": kind, "at": round(max(word["t0"] - START, 0.0), 2),
                        "w": round(MB.getlength(w.upper()) / 1000 + LS[kind] * len(w), 3)})
        out_lines.append(row)
    caps.append({"at": out_lines[0][0]["at"], "t1": round(ws[-1]["t1"] - START, 2), "lines": out_lines,
                 "behind": any(x["k"] == "h" for r in out_lines for x in r)})

for i, c in enumerate(caps):
    nxt = caps[i + 1]["at"] if i + 1 < len(caps) else TOTAL
    c["end"] = round(min(max(c["t1"] + 0.45, c["at"] + 0.55), nxt + 0.12, TOTAL), 2)
for i, c in enumerate(caps[:-1]):
    if c["behind"] and caps[i + 1]["behind"]:
        c["end"] = round(min(c["end"], caps[i + 1]["at"]), 2)  # teks belakang berurutan tidak boleh bertumpuk

FLICK = {"SENDIRI"}
def ts_word(x):
    return f'{{ t: {json.dumps(x["t"], ensure_ascii=False)}, k: "{x["k"]}", at: {x["at"]}, w: {x["w"]} }}'

out = []
for c in caps:
    flick = any(x["t"].upper() in FLICK for r in c["lines"] for x in r if x["k"] == "h")
    lines = ", ".join("[" + ", ".join(ts_word(x) for x in r) + "]" for r in c["lines"])
    out.append(f'  {{ at: {c["at"]}, end: {c["end"]}, behind: {str(c["behind"]).lower()}{", flicker: true" if flick else ""}, lines: [{lines}] }},')

shots = "\n".join(f"  {{ from: {a}, to: {b}, s: [{s0}, {s1}], px: {px}, py: {py}, blur: {bl} }}," for a, b, s0, s1, px, py, bl in SHOTS)

# ---------------- SFX otomatis ----------------
# tick halus HANYA di kata kunci (bukan tiap kata); glitch/digital pendek untuk hero; whoosh/focus di potongan shot
ticks = ["tickA", "tickD", "tickB", "tickF", "tickC", "tickE"]
cues, n, last = [], 0, -9.0
for c in caps:
    for r in c["lines"]:
        for x in r:
            if x["k"] in ("m", "l", "h") and x["at"] - last > 0.3:
                if x["k"] == "h":
                    cues.append((x["at"], "glitch" if n % 2 == 0 else "digital", 1.0 + 0.05 * (n % 3), 0.7, 0.3 if n % 2 == 0 else 0.4))
                else:
                    cues.append((x["at"], ticks[n % len(ticks)], [1.0, 1.08, 0.95, 1.12][n % 4], 1.0, 0.2))
                n += 1
                last = x["at"]
for j, (a, *_r) in enumerate(SHOTS[1:], 1):
    cues.append((round(a - 0.05, 2), "whoosh" if j % 2 else "focus", [1.0, 1.08, 0.92][j % 3], 0.8, 0.45))
cues.append((round(END - 1.5, 2), "riser", 1.0, 0.8, 0.9))
cues.sort()
sfx = "\n".join(f'  {{ at: {a}, k: "{k}", rate: {r}, gain: {g}, fade: {f} }},' for a, k, r, g, f in cues)

HEADER = """// Edit script untuk klip kFhF0ArcMQs-2.24-2.55 (dihasilkan oleh scripts/build-edit.py; edit di sana lalu jalankan ulang,
// atau edit langsung file ini untuk perubahan kecil). Waktu dalam detik dari awal klip. Tanpa import
// supaya bisa dibaca skrip lain.

export const FPS = __FPS__;
/** klip final dimulai di detik ini pada video sumber */
export const START_SEC = __START__;
export const START_FRAME = __SF__;
/** audio dimatikan di detik klip ini (sesudah kata terakhir) */
export const AUDIO_END_SEC = __AE__;
export const VIDEO_FRAMES = __VF__; // frame klip yang punya footage; sesudahnya frame terakhir ditahan
export const DURATION_FRAMES = __DUR__;

export type Shot = {
  from: number;
  to: number;
  /** zoom awal -> akhir (zoom-in pelan). 1 = frame penuh */
  s: [number, number];
  /** posisi wajah di layar 16:9 (0..1); di 9:16 wajah selalu di tengah-atas */
  px: number;
  py: number;
  /** blur sesaat saat shot masuk (px) */
  blur: number;
};

/** kata: s = label kecil, m = kata penting, l = kata kunci besar, h = hero merah di belakang subjek.
 *  at = detik kata diucapkan, w = lebar dalam em (Montserrat Black, termasuk letter-spacing) */
export type Word = { t: string; k: "s" | "m" | "l" | "h"; at: number; w: number };
export type Cap = { at: number; end: number; behind: boolean; flicker?: boolean; lines: Word[][] };
"""
sfx_lib = """
// vol = volume dasar hasil normalisasi loudness tiap file (jangan dinaikkan sembarangan).
export const SFX_LIB = {
  whoosh: { file: "Sfx/Whoosh click.wav", dur: 0.88, vol: 0.2 },
  focus: { file: "Sfx/normalized/camera-focusing-boost.wav", dur: 1.2, vol: 1 },
  glitch: { file: "Sfx/Glitch click.wav", dur: 0.32, vol: 0.36 },
  digital: { file: "Sfx/Digital Text 03.mp3", dur: 1.28, vol: 1 },
  riser: { file: "Sfx/Click riser.wav", dur: 3.24, vol: 0.35 },
  tickA: { file: "Sfx/App Click 15.wav", dur: 0.7, vol: 0.45 },
  tickB: { file: "Sfx/Click.wav", dur: 0.44, vol: 0.55 },
  tickC: { file: "Sfx/Click-1.wav", dur: 1.04, vol: 0.45 },
  tickD: { file: "Sfx/ClicK fingerk.wav", dur: 0.44, vol: 0.55 },
  tickE: { file: "Sfx/Cut game click.wav", dur: 0.92, vol: 0.28 },
  tickF: { file: "Sfx/normalized/click-1-boost.wav", dur: 0.56, vol: 0.6 },
} as const;

export type SfxKey = keyof typeof SFX_LIB;
/** fade = lama suara terdengar (dtk) dengan fade-out: kata = tick pendek, potongan shot = lebih panjang */
export type SfxCue = { at: number; k: SfxKey; rate?: number; gain?: number; fade?: number };
"""
body = (HEADER + "\nexport const SHOTS: Shot[] = [\n" + shots + "\n];\n\nexport const CAPTIONS: Cap[] = [\n" + "\n".join(out)
        + "\n];\n" + sfx_lib + "\nexport const SFX_CUES: SfxCue[] = [\n" + sfx + "\n];\n")
body = body.replace("__FPS__", str(FPS)).replace("__DUR__", str(round(TOTAL * FPS))).replace("__VF__", str(round(END * FPS))).replace("__START__", str(START)).replace("__SF__", str(round(START * FPS))).replace("__AE__", str(AUDIO_END))
open("src/script.ts", "w", encoding="utf-8").write(body)
print(len(caps), "caption,", len(cues), "cue sfx,", len(SHOTS), "shot")
for c in caps:
    print(f'{c["at"]:6.2f}-{c["end"]:6.2f} {"B" if c["behind"] else " "} ' + " / ".join(" ".join(x["t"] for x in r) for r in c["lines"]))
