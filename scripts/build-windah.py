"""Bangun src/windah.ts (semua keputusan caption + kamera klip Windah Basudara v2).

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
LS = {"s": 0.04, "m": 0.02, "l": -0.01, "h": -0.01}  # harus sama dengan WindahCaptions.tsx

# adegan terang (halaman web putih) -> teks gelap. Selain itu footage berwarna -> teks putih.
LIGHT = [(0.0, 2.35), (5.72, 11.55), (29.88, 39.62), (45.85, 51.68), (58.23, 64.3)]

# footage terang (dinding putih): teks gelap, tanpa veil putih
BRIGHT = [(22.12, 24.77)]

# Kamera: HANYA di adegan halaman web (Windah bicara ke kamera, webcam kanan bawah). B-roll = diam.
# (dari, sampai, zoom awal, zoom akhir, titik tetap (ox, oy) px sumber, blur masuk). Zoom pelan, bingkai tetap per shot.
SHOTS = [
    (0.0, 2.35, 1.00, 1.08, (1760, 900), 0),
    (5.72, 8.6, 1.12, 1.28, (1760, 900), 0),
    (8.6, 11.55, 1.40, 1.60, (1800, 940), 8),
    (29.88, 33.0, 1.10, 1.25, (1760, 900), 0),
    (33.0, 36.3, 1.40, 1.60, (1800, 940), 8),
    (36.3, 39.62, 1.75, 2.00, (1830, 980), 8),
    (45.85, 49.0, 1.12, 1.30, (1760, 900), 0),
    (49.0, 51.68, 1.50, 1.80, (1810, 950), 8),
    (58.23, 61.4, 1.15, 1.35, (1760, 900), 0),
    (61.4, 64.3, 1.60, 2.00, (1830, 980), 8),
]

# SATU kata fokus per caption: ^HERO^ merah atau **BESAR** (putih/gelap) pada SATU baris (boleh beberapa token);
# sisanya label kecil Montserrat. (dari, sampai, teks, zona, snap, behind=di belakang subjek)
def P(a, b, text, zone, snap=None, behind=False):
    return (a, b, text, zone, snap, behind)

PHRASES = [
    P(0, 9, "dan tahu nggak / apa yang paling / bikin gue / ^TERHARU^ / teman-teman", "R"),
    P(10, 15, "apa yang paling / bikin gue **TERHARU**", "T"),
    P(16, 19, "selain dari / **KALIAN** guys", "T"),
    P(20, 22, "kak / ^AGNES^ / guys", "RB", behind=True),
    P(23, 28, "dan yang paling / bikin gue / ^TERHARU^", "TR"),
    P(29, 36, "akhirnya kan dia / **NUNGGU** / di bawah gue streaming", "TR"),
    P(37, 38, "^4 JAM^", "T"),
    P(39, 44, "gue streaming / di bawah **KITA ADA**", "T"),
    P(45, 47, "**TV** sama sofa", "TR"),
    P(48, 52, "sebelum / gue streaming / **GUA BILANG**", "TR"),
    P(53, 59, "Agnes aku kayaknya / bakal **LAMA** / di sini", "L"),
    P(60, 64, "Agnes / ^TURUN AJA^ / nggak papa", "R2"),
    P(65, 67, "Agnes / **TURUN AJA**", "R", 29.9),
    P(68, 75, "takutnya / **BERISIK** / kan gua live / gua berisik ya", "R"),
    P(76, 79, "gua turun / ke **BAWAH**", "RU"),
    P(80, 85, "Agnes lagi / nonton gue / di **TV**", "RU"),
    P(86, 92, "Agnes nonton gue / di TV sampai / ^KETIDURAN^", "L"),
    P(93, 99, "terlepas dari / **SOLO STREAM** / ini teman-teman ya", "R"),
    P(100, 105, "terlepas dari / **SOLO STREAM** / ini guys", "RU"),
    P(106, 109, "gua nggak / ^SENDIRI^ / guys", "RB", behind=True),
    P(110, 113, "ada emang / **SUPPORT SYSTEM**", "TL"),
    P(114, 117, "support system / yang ^MENEMANI^", "TL"),
    P(118, 119, "**GRINDING** gua", "TL"),
    P(120, 121, "**BRANDING-AN** gua", "R", 58.23),
    P(122, 123, "**MARKETING** game", "R"),
    P(124, 125, "**ATTENTION** game", "R"),
    P(126, 132, "gua kerja keras / konsistensi gua / ^8 TAHUN^", "RBH", behind=True),
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
    return any(a - 0.001 <= t < b for a, b in LIGHT + BRIGHT)
def veil_at(t):
    return any(a - 0.001 <= t < b for a, b in LIGHT)
def run_end(t):
    """akhir deretan adegan dengan tema sama yang memuat t"""
    for a, b in LIGHT:
        if a - 0.001 <= t < b:
            return b
    # footage: sampai awal adegan terang berikutnya
    nxt = [a for a, b in LIGHT if a > t]
    return min(nxt) if nxt else DURATION

GROUPS = [{"T", "TR", "TT", "TL"}, {"R", "R2", "RU", "RB", "RBH"}, {"L"}]
def overlaps(a, b):
    return any(a in g and b in g for g in GROUPS)

caps = []
for ph in PHRASES:
    a, b, text, zone, snap, behind = ph
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
    big_lines = [r for r in out if any(x["k"] in "lh" for x in r)]
    assert len(big_lines) == 1 and all(x["k"] in "lhs" for x in big_lines[0]) and len({x["k"] for x in big_lines[0] if x["k"] != "s"}) == 1, ("harus tepat satu baris fokus", text)
    assert not behind or any(x["k"] == "h" for r in out for x in r), text
    caps.append({"at": first, "t1": ws[-1]["t1"], "lines": out, "zone": zone, "light": light_at(first + 0.01), "veil": veil_at(first + 0.01), "behind": behind,
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
    body.append(f'  {{ at: {c["at"]}, end: {c["end"]}, zone: "{c["zone"]}", light: {str(c["light"]).lower()}, veil: {str(c["veil"]).lower()}, behind: {str(c["behind"]).lower()}, lines: [{lines}] }},')

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

head = f'''// Dihasilkan oleh scripts/build-windah.py (edit di sana lalu jalankan ulang). Klip Windah Basudara v2 (kamera bergerak hanya di adegan halaman web).
export const W_FPS = {FPS};
export const W_DURATION_FRAMES = {int(round(DURATION * FPS))};
export type WZone = "R" | "TR" | "T" | "TT" | "TL" | "L" | "R2" | "RU" | "RB" | "RBH";
/** s = label kecil (Montserrat Black), m = sedang (Montserrat Black), l = besar (Coolvetica Hv Comp), h = hero merah (Coolvetica Hv Comp) */
export type WWord = {{ t: string; k: "s" | "m" | "l" | "h"; at: number; w: number }};
export type WCap = {{ at: number; end: number; zone: WZone; light: boolean; veil: boolean; behind: boolean; lines: WWord[][] }};
export type WShot = {{ from: number; to: number; s0: number; s1: number; ox: number; oy: number; blur: number }};
export const W_SHOTS: WShot[] = {json.dumps([dict(zip(("from","to","s0","s1","ox","oy","blur"),(a,b,c,d,e[0],e[1],f))) for a,b,c,d,e,f in SHOTS])};
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
