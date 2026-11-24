"""Bangun src/windah.ts (semua keputusan caption klip Windah Basudara, kamera DIAM).

Gaya: caption kata-per-kata (seperti klip Timothy) tetapi memakai DUA font: Montserrat Black (label kecil)
dan Coolvetica Hv Comp (kata besar / hero merah). Ukuran besar mengisi area kosong footage (halaman web putih
saat live). Di footage orang, caption ditaruh di zona bebas wajah. Teks gelap di adegan terang, putih di adegan gelap.
Edit PHRASES lalu jalankan: python3 scripts/build-windah.py
Notasi teks: baris dipisah " / ". *KATA*=sedang  **KATA**=besar  ^KATA^=hero merah raksasa. Sisanya label kecil.
"""
import json
import re

from PIL import ImageFont

FPS = 30
DURATION = 64.3
WORDS = json.load(open("scripts/words-windah.json"))
MB = ImageFont.truetype("public/Fonts/Montserrat-Black.ttf", 1000)
HV = ImageFont.truetype("public/Fonts/Coolvetica Hv Comp.otf", 1000)
LS = {"s": 0.14, "m": 0.02, "l": 0.0, "h": 0.0}  # harus sama dengan WindahCaptions.tsx

# adegan terang (halaman web putih) -> teks gelap. Selain itu footage berwarna -> teks putih.
LIGHT = [(0.0, 2.35), (5.72, 11.55), (29.88, 39.62), (45.85, 51.68), (58.23, 64.3)]

# (dari indeks kata, sampai indeks kata (inklusif), teks, zona, [snap detik])
PHRASES = [
    (0, 9, "dan tahu nggak / apa yang paling / bikin gue / ^TERHARU^ / teman-teman", "R"),
    (10, 15, "apa yang paling / bikin gue **TERHARU**", "T"),
    (16, 19, "selain dari / **KALIAN** guys", "T"),
    (20, 22, "kak / ^AGNES^ / guys", "R"),
    (23, 28, "dan yang paling / bikin gue / ^TERHARU^", "TR"),
    (29, 36, "akhirnya kan dia / **NUNGGU** / di bawah gue streaming", "TR"),
    (37, 38, "^4 JAM^", "T"),
    (39, 44, "gue streaming di bawah / kita ada", "T"),
    (45, 47, "**TV** sama **SOFA**", "TR"),
    (48, 52, "sebelum / gue streaming / gua bilang", "TR"),
    (53, 59, "**AGNES** / aku kayaknya / bakal **LAMA** / di sini", "L"),
    (60, 64, "Agnes / ^TURUN AJA^ / nggak papa", "R2"),
    (65, 67, "Agnes / **TURUN AJA**", "R", 29.9),
    (68, 75, "takutnya / **BERISIK** / kan gua / **LIVE** / gua berisik ya", "R"),
    (76, 79, "gua turun / ke **BAWAH**", "R"),
    (80, 85, "Agnes lagi / nonton gue / di ^TV^", "R"),
    (86, 92, "Agnes nonton gue / di TV sampai / ^KETIDURAN^", "L"),
    (93, 99, "terlepas dari / **SOLO STREAM** ini / teman-teman ya", "R"),
    (100, 105, "*terlepas dari* / *solo stream ini guys*", "R"),
    (106, 109, "gua nggak / ^SENDIRI^ / guys", "R"),
    (110, 113, "ada emang **SUPPORT SYSTEM**", "TT"),
    (114, 117, "**SUPPORT SYSTEM** yang **MENEMANI**", "TT"),
    (118, 119, "**GRINDING** gua", "TT"),
    (120, 125, "**BRANDING-AN** / gua **MARKETING** game / **ATTENTION** game", "R", 58.23),
    (126, 132, "gua **KERJA KERAS** / **KONSISTENSI** gua / ^8 TAHUN^", "R"),
]

def parse_line(line):
    toks = []
    for m in re.finditer(r"\^([^^]+)\^|\*\*([^*]+)\*\*|\*([^*]+)\*|([^*^]+)", line):
        kind, span = ("h", m.group(1)) if m.group(1) else ("l", m.group(2)) if m.group(2) else ("m", m.group(3)) if m.group(3) else ("s", m.group(4))
        for w in span.split():
            toks.append((w, kind))
    return toks

norm = lambda t: re.sub(r"[^a-z0-9']", "", t.lower())
def light_at(t):
    return any(a - 0.001 <= t < b for a, b in LIGHT)
def run_end(t):
    """akhir deretan adegan dengan tema sama yang memuat t"""
    for a, b in LIGHT:
        if a - 0.001 <= t < b:
            return b
    # footage: sampai awal adegan terang berikutnya
    nxt = [a for a, b in LIGHT if a > t]
    return min(nxt) if nxt else DURATION

GROUPS = [{"T", "TR", "TT"}, {"R", "R2"}, {"L"}]
def overlaps(a, b):
    return any(a in g and b in g for g in GROUPS)

caps = []
for ph in PHRASES:
    a, b, text, zone = ph[:4]
    snap = ph[4] if len(ph) > 4 else None
    ws = WORDS[a:b + 1]
    lines = [parse_line(l.strip()) for l in text.split(" / ")]
    flat = [t for l in lines for t in l]
    assert len(flat) == len(ws) and all(norm(x) == norm(y["w"]) for (x, _), y in zip(flat, ws)), (a, b, [x for x, _ in flat], [y["w"] for y in ws])
    k = 0
    out = []
    for l in lines:
        row = []
        for w, kind in l:
            word = ws[k]; k += 1
            at = word["t0"]
            if snap is not None and at < snap:
                at = snap + 0.06 * (k - 1)
            font = MB if kind in "sm" else HV
            row.append({"t": w.rstrip(".,?!") if kind != "s" else w, "k": kind, "at": round(at, 2),
                        "w": round(font.getlength(w.upper().rstrip(".,?!") if kind != "s" else w.upper()) / 1000 + LS[kind] * len(w), 3)})
        out.append(row)
    first = out[0][0]["at"]
    caps.append({"at": first, "t1": ws[-1]["t1"], "lines": out, "zone": zone, "light": light_at(first + 0.01),
                 "hero": any(x["k"] == "h" for r in out for x in r)})

for i, c in enumerate(caps):
    nxt = caps[i + 1]["at"] if i + 1 < len(caps) else DURATION
    end = max(c["t1"] + 0.55, c["at"] + 0.8)
    if i + 1 < len(caps) and overlaps(caps[i + 1]["zone"], c["zone"]):
        end = min(end, nxt + 0.05)  # zona yang saling menimpa tidak boleh bertumpuk
    end = min(end, run_end(c["at"] + 0.01))
    c["end"] = round(min(end, DURATION - 0.1), 2)

def ts_word(x):
    return f'{{ t: {json.dumps(x["t"], ensure_ascii=False)}, k: "{x["k"]}", at: {x["at"]}, w: {x["w"]} }}'

body = []
for c in caps:
    lines = ", ".join("[" + ", ".join(ts_word(x) for x in r) + "]" for r in c["lines"])
    body.append(f'  {{ at: {c["at"]}, end: {c["end"]}, zone: "{c["zone"]}", light: {str(c["light"]).lower()}, lines: [{lines}] }},')

# SFX halus: tick pendek hanya di kata besar/hero (suara asli video tetap dominan)
ticks = ["tickB", "tickF", "tickD", "tickA"]
cues, n, last = [], 0, -9.0
for c in caps:
    for r in c["lines"]:
        for x in r:
            if x["k"] in ("l", "h") and x["at"] - last > 0.45:
                cues.append((x["at"], ticks[n % 4], [1.0, 1.06, 0.94][n % 3], 0.5 if x["k"] == "l" else 0.65, 0.22))
                n += 1; last = x["at"]
sfx = "\n".join(f'  {{ at: {a}, k: "{k}", rate: {r}, gain: {g}, fade: {f} }},' for a, k, r, g, f in cues)

head = f'''// Dihasilkan oleh scripts/build-windah.py (edit di sana lalu jalankan ulang). Klip Windah Basudara, kamera diam.
export const W_FPS = {FPS};
export const W_DURATION_FRAMES = {int(round(DURATION * FPS))};
export type WZone = "R" | "TR" | "T" | "TT" | "L" | "R2";
/** s = label kecil (Montserrat Black), m = sedang (Montserrat Black), l = besar (Coolvetica Hv Comp), h = hero merah (Coolvetica Hv Comp) */
export type WWord = {{ t: string; k: "s" | "m" | "l" | "h"; at: number; w: number }};
export type WCap = {{ at: number; end: number; zone: WZone; light: boolean; lines: WWord[][] }};
export const LIGHT_SCENES: [number, number][] = {json.dumps(LIGHT)};

export const W_SFX_LIB = {{
  tickA: {{ file: "Sfx/App Click 15.wav", dur: 0.7, vol: 0.45 }},
  tickB: {{ file: "Sfx/Click.wav", dur: 0.44, vol: 0.55 }},
  tickD: {{ file: "Sfx/ClicK fingerk.wav", dur: 0.44, vol: 0.55 }},
  tickF: {{ file: "Sfx/normalized/click-1-boost.wav", dur: 0.56, vol: 0.6 }},
}} as const;
export type WSfxKey = keyof typeof W_SFX_LIB;
export type WSfxCue = {{ at: number; k: WSfxKey; rate?: number; gain?: number; fade?: number }};
'''
open("src/windah.ts", "w", encoding="utf-8").write(head + "\nexport const W_CAPTIONS: WCap[] = [\n" + "\n".join(body) + "\n];\n\nexport const W_SFX_CUES: WSfxCue[] = [\n" + sfx + "\n];\n")
print(len(caps), "caption,", len(cues), "cue")
for c in caps:
    print(f'{c["at"]:6.2f}-{c["end"]:6.2f} {c["zone"]:3} {"L" if c["light"] else "D"} ' + " / ".join(" ".join(x["t"] for x in r) for r in c["lines"]))
