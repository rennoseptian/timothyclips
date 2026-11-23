"""Bangun src/script.ts (semua keputusan edit) untuk klip MmU4rSTmI5I-4.07-4.26.

Semua ucapan jadi typography Montserrat: kata muncul SATU PER SATU (waktu tiap kata dari scripts/words.json),
tiap kata dari arah berbeda, 1-2 kata sebelumnya mengabur saat kata baru masuk, lalu semuanya menyatu jadi satu
lockup. Edit teks/penekanan di PHRASES, ukuran bingkai di SHOTS, lalu jalankan: python3 scripts/build-edit.py
Notasi teks:  baris dipisah " / ".  *KATA* = kata penting (sedang)  **KATA** = kata kunci besar
^KATA^ = hero merah raksasa di BELAKANG subjek.  Sisanya teks kecil (label).
"""
import json
import re

from PIL import ImageFont

START = 0.0            # klip MmU4rSTmI5I: seluruh video 19 dtk dipakai
END = 19.0             # akhir klip; ucapan berakhir di "...yang ngeri." (~18.6 dtk)
FPS = 24
MB = ImageFont.truetype("public/Fonts/Montserrat-Black.ttf", 1000)
LS = {"s": 0.16, "m": 0.0, "l": -0.01, "h": -0.01}  # letter-spacing per jenis (em), harus sama dengan Captions.tsx

# ---------------- KAMERA: (dari, sampai, zoom awal, zoom akhir, posisi wajah x, y, blur) ----------------
# wide 1.0 | MCU 1.35-1.5 | CU 1.55-1.9 | ECU ~2.0. Zoom pelan saja, tanpa goyang.
SHOTS = [
    (0.00, 1.08, 1.40, 1.48, 0.62, 0.42, 0),
    (1.08, 3.72, 1.00, 1.05, 0.50, 0.44, 10),
    (3.72, 5.61, 1.60, 1.70, 0.38, 0.42, 12),
    (5.61, 7.55, 1.35, 1.45, 0.64, 0.42, 12),
    (7.55, 9.32, 1.75, 1.90, 0.62, 0.40, 12),
    (9.32, 12.06, 1.00, 1.05, 0.50, 0.44, 10),
    (12.06, 14.16, 1.75, 1.90, 0.38, 0.40, 12),
    (14.16, 15.60, 1.00, 1.04, 0.50, 0.44, 10),
    (15.60, 17.68, 1.70, 1.85, 0.62, 0.42, 12),
    (17.68, END, 2.00, 2.10, 0.38, 0.40, 14),
]

# ---------------- CAPTION: (indeks frasa otomatis yang digabung, teks) ----------------
PHRASES = [
    ([0], "Gua enggak pernah / ^TAKUT^"),
    ([1], "ibaratnya sama / *ORANG* yang"),
    ([2], "seumur hidupnya / *HIDUPNYA*"),
    ([3], "selalu / **GAMPANG.**"),
    ([4, 5], "Ya, dari kecil / dia *GAMPANG,*"),
    ([6, 7], "dia besar hidupnya itu / **GAMPANG.**"),
    ([8, 9], "Orang seperti itu enggak / ^NGERI.^"),
    ([10], "Orang **NGERI** / adalah orang"),
    ([11], "yang *HIDUPNYA* / ini sudah"),
    ([12], "mau / **DIHANCURIN** / sama"),
    ([13], "berbagai macam / **CARA** di"),
    ([14], "dunia lalu / dia **TETAP**"),
    ([15], "^BERDIRI,^"),
    ([16], "dia tetap / **JALAN.**"),
    ([17, 18, 19], "Nah, itu orangnya yang gua / **TAKUT,**"),
    ([20], "itu orang yang / ^NGERI.^"),
]

# ---------------- bangun frasa otomatis dari words.json ----------------
words = [w for w in json.load(open("scripts/words.json")) if not w.get("x") and w["t1"] > START]
# SRT menyertakan "Uang itu bisa selalu dicari lagi." tetapi audio klip berhenti (hening) setelah "ngeri." (~18.6 dtk):
# kalimat itu tidak terucap, jadi tidak dijadikan caption (caption harus sesuai ucapan).
cut = max(i for i, w in enumerate(words) if w["w"] == "ngeri.")
words = words[:cut + 1]
words[-1]["t1"] = 18.6
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

norm = lambda t: re.sub(r"[^a-z0-9']", "", t.lower())
caps = []
for entry in PHRASES:
    idxs, text = entry[0], entry[1]
    ws = [w for i in idxs for w in auto[i - OFFSET]]
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
    nxt = caps[i + 1]["at"] if i + 1 < len(caps) else END
    c["end"] = round(min(max(c["t1"] + 0.45, c["at"] + 0.55), nxt + 0.12, END), 2)
for i, c in enumerate(caps[:-1]):
    if c["behind"] and caps[i + 1]["behind"]:
        c["end"] = round(min(c["end"], caps[i + 1]["at"]), 2)  # teks belakang berurutan tidak boleh bertumpuk

FLICK = {"TAKUT"}
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

HEADER = """// Edit script untuk klip MmU4rSTmI5I-4.07-4.26 (dihasilkan oleh scripts/build-edit.py; edit di sana lalu jalankan ulang,
// atau edit langsung file ini untuk perubahan kecil). Waktu dalam detik dari awal klip. Tanpa import
// supaya bisa dibaca skrip lain.

export const FPS = 24;
/** klip final dimulai di detik ini pada video sumber (seluruh video) */
export const START_SEC = 0;
export const START_FRAME = 0;
/** 19 dtk penuh: 456 frame */
export const DURATION_FRAMES = 456;

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
open("src/script.ts", "w", encoding="utf-8").write(body)
print(len(caps), "caption,", len(cues), "cue sfx,", len(SHOTS), "shot")
for c in caps:
    print(f'{c["at"]:6.2f}-{c["end"]:6.2f} {"B" if c["behind"] else " "} ' + " / ".join(" ".join(x["t"] for x in r) for r in c["lines"]))
