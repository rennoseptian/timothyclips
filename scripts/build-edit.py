"""Bangun src/script.ts (semua keputusan edit) untuk klip p1t-074cn38.

Semua ucapan jadi caption bergerak (bukan hanya kata penting). Waktu kata dari scripts/words.json
(hasil scripts/align-words.py). Edit teks/penekanan di PHRASES, ukuran bingkai di SHOTS, lalu jalankan:
    python3 scripts/build-edit.py
Notasi teks caption:  baris dipisah " / ".  *KATA* = kata penting (putih, condensed, sedang)
**KATA** = kata besar (putih)   ^KATA^ = hero merah raksasa di BELAKANG subjek.  Sisanya teks kecil.
"""
import json
import re

from PIL import ImageFont

START = 2.0            # detik di video sumber tempat klip dimulai ("Ini salah satu quotes...")
END = 42.58            # selesai setelah "...enggak akan pernah siap." (jeda sesudahnya)
FPS = 24
HV = ImageFont.truetype("public/Fonts/Coolvetica Hv Comp.otf", 1000)

# ---------------- KAMERA: (dari, sampai, zoom awal, zoom akhir, posisi wajah x, y, blur) ----------------
# wide 1.0 | MCU 1.35-1.5 | CU 1.55-1.9 | ECU ~2.0. Zoom pelan saja, tanpa goyang.
SHOTS = [
    (0.00, 2.11, 1.00, 1.05, 0.50, 0.44, 0),
    (2.11, 4.04, 1.35, 1.45, 0.36, 0.42, 12),
    (4.04, 6.80, 1.70, 1.85, 0.38, 0.42, 12),
    (6.80, 8.07, 1.00, 1.04, 0.50, 0.44, 10),
    (8.07, 10.03, 1.40, 1.50, 0.64, 0.42, 12),
    (10.03, 12.21, 1.55, 1.65, 0.36, 0.42, 10),
    (12.21, 14.56, 1.80, 1.95, 0.62, 0.40, 12),
    (14.56, 16.74, 1.00, 1.06, 0.50, 0.44, 10),
    (16.74, 19.08, 1.75, 1.90, 0.38, 0.42, 12),
    (19.08, 20.49, 1.00, 1.04, 0.50, 0.44, 10),
    (20.49, 22.34, 1.60, 1.70, 0.62, 0.42, 12),
    (22.34, 25.60, 1.35, 1.45, 0.64, 0.42, 10),
    (25.60, 27.34, 1.70, 1.80, 0.38, 0.42, 14),
    (27.34, 29.61, 2.00, 2.10, 0.62, 0.40, 14),
    (29.61, 31.01, 1.00, 1.04, 0.50, 0.44, 10),
    (31.01, 33.00, 1.40, 1.50, 0.62, 0.42, 12),
    (33.00, 35.25, 1.55, 1.65, 0.38, 0.42, 12),
    (35.25, 37.38, 1.00, 1.05, 0.50, 0.44, 10),
    (37.38, 39.62, 1.40, 1.50, 0.62, 0.42, 12),
    (39.62, 40.58, 2.00, 2.05, 0.40, 0.40, 14),
]

# ---------------- CAPTION: (indeks frasa otomatis yang digabung, teks) ----------------
PHRASES = [
    ([2], "Ini salah satu / *QUOTES*"),
    ([3], "yang gua *LUPA* ya"),
    ([4], "siapa yang / **BIKIN**"),
    ([5, 6], "Cuman ini / **MENGUBAH** / **HIDUP GUA**"),
    ([7], "I'm the / ^CAPTAIN OF^"),
    ([8], "my / ^SOUL^ / and the"),
    ([9], "^MASTER^ / of my faith"),
    ([10], "Artinya / **APA?**"),
    ([11], "Gua adalah / *KAPTEN* dari"),
    ([12], "*JIWA* gua sendiri,"),
    ([13, 14], "ya dan *MASTER,* ya."),
    ([15, 16], "Master dari / ^TAKDIR^ / gua sendiri."),
    ([17], "**HANYA GUA** / yang bisa"),
    ([18, 19], "tentuin / *TAKDIR* gua sendiri."),
    ([20], "Ini kayak kayak / *KITA*"),
    ([21, 22], "hidup ini / ^DI KAPAL^ / gitu loh."),
    ([23], "^KITA YANG SETIR,^"),
    ([24], "kita **NAHKODANYA**"),
    ([25], "Memang kadang / bisa ada"),
    ([26, 27], "^BADAI,^ / tapi ini kita yang"),
    ([28, 29], "*DECIDE* kita mau ke mana."),
    ([30], "Lu bisa *PILIH* gitu,"),
    ([31], "besok lu mau / **BANGUN**"),
    ([32], "mau jadi orang / ^SEDIH,^"),
    ([33], "mau jadi / **BAHAGIA,**"),
    ([34], "mau jadi orang / ^DEPRESI,^"),
    ([35], "mau jadi orang / **SUKSES,**"),
    ([36], "itu semua *CUMAN* ada"),
    ([37], "di **PIKIRAN LU.**"),
    ([38, 39], "Lu sendiri yang bisa / **BIKIN ITU.**"),
    ([40], "Saran gua / *JANGAN PERNAH*"),
    ([41, 42], "**NUNGGU** untuk lu siap, ya,"),
    ([43], "untuk melakukan hal-hal"),
    ([44, 45], "*APAPUN,* ya."),
    ([46], "Jangan pernah / **NUNGGU**"),
    ([47], "sampai lu siap karena"),
    ([48], "lu enggak akan pernah"),
    ([49], "^SIAP.^"),
]
LEAK_CUTS = [(4.04, 1.05, 0.30, "flash"), (25.60, 2.1, 0.26, "oldFlash"), (39.62, 3.15, 0.28, "flash")]

# ---------------- bangun frasa otomatis dari words.json ----------------
words = [w for w in json.load(open("scripts/words.json")) if not w.get("x") and w["t1"] > START]
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
OFFSET = 2  # jumlah frasa otomatis sebelum START pada daftar lengkap tak berfilter

def seg_parse(line):
    segs = []
    for m in re.finditer(r"\^([^^]+)\^|\*\*([^*]+)\*\*|\*([^*]+)\*|([^*^]+)", line):
        if m.group(1):
            segs.append(("h", m.group(1)))
        elif m.group(2):
            segs.append(("l", m.group(2)))
        elif m.group(3):
            segs.append(("m", m.group(3)))
        elif m.group(4).strip():
            segs.append(("s", m.group(4).strip()))
    return segs

caps = []
for idxs, text in PHRASES:
    ph = [auto[i - OFFSET] for i in idxs]
    ws = [w for p in ph for w in p]
    at, t1 = ws[0]["t0"] - START, ws[-1]["t1"] - START
    # kata dalam teks harus sama dengan kata yang diucapkan
    said = re.sub(r"[^a-z0-9' ]", "", " ".join(w["w"] for w in ws).lower())
    shown = re.sub(r"[^a-z0-9' ]", "", re.sub(r"[*^/]", " ", text).lower())
    assert " ".join(said.split()) == " ".join(shown.split()), (idxs, said, shown)
    lines = [seg_parse(l.strip()) for l in text.split(" / ")]
    behind = any(k == "h" for l in lines for k, _ in l)
    caps.append({"at": round(max(at, 0.0), 2), "t1": round(t1, 2), "lines": lines, "behind": behind})

for i, c in enumerate(caps):
    nxt = caps[i + 1]["at"] if i + 1 < len(caps) else 40.58
    c["end"] = round(min(max(c["t1"] + 0.45, c["at"] + 0.55), nxt + 0.12, 40.58), 2)

for i, c in enumerate(caps[:-1]):
    if c["behind"] and caps[i + 1]["behind"]:
        c["end"] = round(min(c["end"], caps[i + 1]["at"]), 2)  # teks belakang berurutan tidak boleh bertumpuk

ANIMS = ["up", "side", "zoom", "down", "side", "up"]
HERO_ANIMS = ["track", "zoom", "wipe"]
FLICK = {"^DEPRESI,^", "^SEDIH,^", "^SIAP.^"}

def ts_seg(k, t):
    d = f'{{ k: "{k}", t: {json.dumps(t, ensure_ascii=False)}'
    if k == "h":
        d += f', w: {HV.getlength(t.upper()) / 1000:.3f}'
    return d + " }"

out = []
ai = hi = 0
for i, c in enumerate(caps):
    if c["behind"]:
        anim = HERO_ANIMS[hi % 3]; hi += 1
    else:
        anim = ANIMS[ai % len(ANIMS)]; ai += 1
    flick = any(("^" + t + "^") in FLICK for l in c["lines"] for k, t in l if k == "h")
    lines = ", ".join("[" + ", ".join(ts_seg(k, t) for k, t in l) + "]" for l in c["lines"])
    out.append(f'  {{ at: {c["at"]}, end: {c["end"]}, anim: "{anim}", behind: {str(c["behind"]).lower()}'
               f'{", flicker: true" if flick else ""}, lines: [{lines}] }},')

shots = "\n".join(f"  {{ from: {a}, to: {b}, s: [{s0}, {s1}], px: {px}, py: {py}, blur: {bl} }}," for a, b, s0, s1, px, py, bl in SHOTS)
leaks = "\n".join(f"  {{ at: {round(t - 0.27, 2)}, offset: {off}, dur: 0.65, opacity: {op} }}," for t, off, op, _ in LEAK_CUTS)

# ---------------- SFX otomatis: tick halus untuk caption, whoosh di potongan, flash hanya di transisi ----------------
ticks = ["tickA", "tickD", "tickB", "tickF", "tickC", "tickE"]
cues = []
n = 0
for c in caps:
    big = any(k in ("m", "l", "h") for l in c["lines"] for k, _ in l)
    if c["behind"]:
        cues.append((c["at"], "glitch" if n % 2 == 0 else "digital", 1.0 + 0.05 * (n % 3), 0.7, 0.3 if n % 2 == 0 else 0.4))
        n += 1
    elif big:
        k = ticks[n % len(ticks)]
        cues.append((c["at"], k, [1.0, 1.08, 0.95, 1.12][n % 4], 1.0, 0.2))
        n += 1
for j, (a, b, *_rest) in enumerate(SHOTS[1:], 1):
    if any(abs(a - t) < 0.01 for t, *_ in LEAK_CUTS):
        continue
    cues.append((round(a - 0.05, 2), "whoosh" if j % 2 else "focus", [1.0, 1.08, 0.92][j % 3], 0.8, 0.45))
for t, _, _, k in LEAK_CUTS:
    cues.append((round(t - 0.1, 2), k, 1.0, 1.0, 0.9 if k == "oldFlash" else 0.6))
cues.append((39.3, "riser", 1.0, 0.8, 0.9))
cues.sort()
sfx = "\n".join(f'  {{ at: {a}, k: "{k}", rate: {r}, gain: {g}, fade: {f} }},' for a, k, r, g, f in cues)

HEADER = '''// Edit script untuk klip p1t-074cn38 (dihasilkan oleh scripts/build-edit.py; edit di sana lalu jalankan ulang,
// atau edit langsung file ini untuk perubahan kecil). Waktu dalam detik dari awal klip. Tanpa import
// supaya bisa dibaca skrip lain.

export const FPS = 24;
/** klip final dimulai di detik ini pada video sumber ("Ini salah satu quotes...") */
export const START_SEC = 2.0;
export const START_FRAME = 48;
/** sampai 42.58 dtk video sumber (setelah "...enggak akan pernah siap."): 974 frame */
export const DURATION_FRAMES = 974;

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

/** s = kecil (regular), m = kata penting (condensed), l = besar, h = hero merah raksasa di belakang subjek (w = lebar em) */
export type Seg = { k: "s" | "m" | "l" | "h"; t: string; w?: number };
/** cara masuk: up/down = dari bawah/atas, side = dari tepi layar sisi luar, zoom = mengecil dari besar, track = huruf merapat, wipe = tersingkap */
export type Anim = "up" | "down" | "side" | "zoom" | "track" | "wipe";
export type Cap = { at: number; end: number; anim: Anim; behind: boolean; flicker?: boolean; lines: Seg[][] };
'''
sfx_lib = '''
// vol = volume dasar hasil normalisasi loudness tiap file (jangan dinaikkan sembarangan).
export const SFX_LIB = {
  whoosh: { file: "Sfx/Whoosh click.wav", dur: 0.88, vol: 0.2 },
  focus: { file: "Sfx/normalized/camera-focusing-boost.wav", dur: 1.2, vol: 1 },
  flash: { file: "Sfx/Camera flash sound effect.mp3", dur: 2.09, vol: 0.28 },
  oldFlash: { file: "Sfx/freesound_community-old-camera-flash-6800.mp3", dur: 3.82, vol: 0.2 },
  glitch: { file: "Sfx/Glitch click.wav", dur: 0.32, vol: 0.36 },
  digital: { file: "Sfx/Digital Text 03.mp3", dur: 1.28, vol: 1 },
  scan: { file: "Sfx/scan.mp3", dur: 1.28, vol: 1 },
  riser: { file: "Sfx/Click riser.wav", dur: 3.24, vol: 0.35 },
  tickA: { file: "Sfx/App Click 15.wav", dur: 0.7, vol: 0.45 },
  tickB: { file: "Sfx/Click.wav", dur: 0.44, vol: 0.55 },
  tickC: { file: "Sfx/Click-1.wav", dur: 1.04, vol: 0.45 },
  tickD: { file: "Sfx/ClicK fingerk.wav", dur: 0.44, vol: 0.55 },
  tickE: { file: "Sfx/Cut game click.wav", dur: 0.92, vol: 0.28 },
  tickF: { file: "Sfx/normalized/click-1-boost.wav", dur: 0.56, vol: 0.6 },
} as const;

export type SfxKey = keyof typeof SFX_LIB;
/** fade = lama suara terdengar (dtk) dengan fade-out: caption = tick pendek, transisi = lebih panjang */
export type SfxCue = { at: number; k: SfxKey; rate?: number; gain?: number; fade?: number };
'''
body = (HEADER + "\nexport const SHOTS: Shot[] = [\n" + shots + "\n];\n\nexport const CAPTIONS: Cap[] = [\n" + "\n".join(out)
        + "\n];\n\n/** kilatan light leak hanya di perpindahan shot; puncaknya (~0,27 dtk setelah mulai) tepat di potongan */\nexport const LEAKS = [\n" + leaks
        + "\n];\n" + sfx_lib + "\nexport const SFX_CUES: SfxCue[] = [\n" + sfx + "\n];\n")
open("src/script.ts", "w", encoding="utf-8").write(body)
print(len(caps), "caption,", len(cues), "cue sfx,", len(SHOTS), "shot")
for c in caps:
    print(f'{c["at"]:6.2f}-{c["end"]:6.2f} {"B" if c["behind"] else " "} ' + " / ".join(" ".join(t for _, t in l) for l in c["lines"]))
