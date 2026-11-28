"""Perkirakan waktu tiap kata dengan memakai audio asli: kata hanya dibagi di bagian yang BERSUARA.

SRT hanya punya waktu per baris. Membagi waktu baris rata-rata per huruf membuat kata meleset sampai
~0,5 dtk kalau ada jeda di tengah baris. Di sini:
  1. peta suara/jeda diambil dari amplop volume audio (10 ms),
  2. waktu "suara" kumulatif V(t) dihitung,
  3. tiap baris SRT: kata dibagi menurut jumlah suku kata pada rentang V(mulai)..V(selesai),
     lalu dikembalikan ke waktu nyata. Jeda tidak ikut menelan jatah kata.

Pakai: python3 scripts/align-words.py [video.mp4] [file.srt] [keluaran.json]
Hasil: scripts/words.json  ->  dipakai scripts/check-captions.mjs
"""
import json
import re
import subprocess
import sys

import numpy as np

ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
VIDEO = ARGS[0] if len(ARGS) > 0 else "public/Video/p1t-074cn38-6.14-6.57.mp4"
SRT = ARGS[1] if len(ARGS) > 1 else "public/Caption/p1t-074cn38-6.14-6.57.srt"
OUT = ARGS[2] if len(ARGS) > 2 else "scripts/words.json"

SR = 22050
HOP = int(0.01 * SR)
VOICED_DB = -43.0  # di atas ini dianggap ada suara (jeda sekitar -57..-65 dB, suara > -30 dB)
BRIDGE = 0.10  # celah lebih pendek dari ini (penutupan huruf k/t/p) dianggap masih bersuara
MIN_VOICED = 0.04

raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", VIDEO, "-vn", "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
    capture_output=True,
).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
n = len(x) // HOP
env = np.array([np.sqrt((x[i * HOP:(i + 1) * HOP] ** 2).mean()) for i in range(n)])
db = 20 * np.log10(env + 1e-9)
voiced = db > VOICED_DB

# tutup celah pendek, buang kedipan suara yang sangat pendek
def runs(mask):
    out, start = [], None
    for i, v in enumerate(mask):
        if v and start is None:
            start = i
        if not v and start is not None:
            out.append((start, i))
            start = None
    if start is not None:
        out.append((start, len(mask)))
    return out

for a, b in runs(~voiced):
    if (b - a) * 0.01 < BRIDGE and a > 0 and b < n:
        voiced[a:b] = True
for a, b in runs(voiced):
    if (b - a) * 0.01 < MIN_VOICED:
        voiced[a:b] = False

cum = np.concatenate([[0.0], np.cumsum(voiced) * 0.01])  # cum[i] = detik suara sebelum frame i


def V(t):
    return float(np.interp(t * 100, np.arange(len(cum)), cum))


def Vinv(target):
    # waktu paling awal yang SETELAH itu suara kumulatif melebihi target (jatuh di awal suara, bukan di jeda)
    i = int(np.searchsorted(cum, target + 1e-4, side="left"))
    i = min(max(i, 1), len(cum) - 1)
    prev, nxt = cum[i - 1], cum[i]
    frac = 0.0 if nxt == prev else (target - prev) / (nxt - prev)
    return (i - 1 + min(max(frac, 0.0), 1.0)) * 0.01


def syllables(word):
    w = re.sub(r"[^a-z']", "", word.lower())
    if not w:
        return 1
    groups = re.findall(r"[aeiou]+|(?<!^)y", w)
    return max(1, len(groups))


def to_s(s):
    h, m, r = s.strip().split(":")
    sec, ms = r.split(",")
    return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000


def place(toks, a, b, out, skip=False):
    """Bagi kata di rentang [a, b] menurut suku kata pada bagian yang bersuara."""
    if not toks:
        return
    syl = np.array([syllables(t) for t in toks], dtype=float)
    cs = np.concatenate([[0], np.cumsum(syl)]) / syl.sum()
    v0, v1 = V(a), V(b)
    for i, t in enumerate(toks):
        t0 = Vinv(v0 + (v1 - v0) * cs[i]) if v1 - v0 > 0.05 else a + (b - a) * cs[i]
        t1 = Vinv(v0 + (v1 - v0) * cs[i + 1]) if v1 - v0 > 0.05 else a + (b - a) * cs[i + 1]
        w = {"w": t, "t0": round(max(t0, a - 0.05), 3), "t1": round(min(max(t1, t0 + 0.04), b + 0.05), 3)}
        if skip:
            w["x"] = 1  # di luar klip final (sebelum 'video start' atau sesudah 'selesai')
        out.append(w)


def longest_gap(a, b, min_len=0.15, thr=-50.0):
    """Jeda (diam) terpanjang di dalam [a, b], langsung dari amplop dB."""
    i0, i1 = int(a * 100), min(int(b * 100), len(db))
    best, start = None, None
    for i in range(i0, i1 + 1):
        quiet = i < i1 and db[i] < thr
        if quiet and start is None:
            start = i
        if not quiet and start is not None:
            g = (start * 0.01, i * 0.01)
            if g[1] - g[0] >= min_len and (best is None or g[1] - g[0] > best[1] - best[0]):
                best = g
            start = None
    return best


words = []
blocks = re.split(r"\n\n+", open(SRT, encoding="utf-8").read().replace("\r", "").strip())
for bi, block in enumerate(blocks):
    lines = block.split("\n")
    a, b = (to_s(p) for p in lines[1].split("-->"))
    text = " ".join(lines[2:])
    m = re.search(r"\((video start[^)]*|mulai[^)]*|selesai[^)]*)\)", text, re.I)
    if m:
        pre = re.sub(r"\([^)]*\)", " ", text[: m.start()]).split()
        post = re.sub(r"\([^)]*\)", " ", text[m.end():]).split()
        start_marker = m.group(1).lower().startswith(("video start", "mulai"))
        gap = longest_gap(a, b)
        # Jika penanda (selesai) ditulis di blok yang timestamp-nya bergeser sesudah jeda hening,
        # cari jeda terpanjang mundur ke blok sebelumnya agar kata sebelum (selesai) tidak telat.
        if not start_marker and gap is None and words:
            prev_a = to_s(blocks[bi - 1].split("\n")[1].split("-->")[0])
            back_gap = longest_gap(prev_a, b)
            if back_gap is not None and back_gap[0] < a:
                prev_toks = []
                while words and words[-1]["t0"] >= prev_a - 0.06:
                    prev_toks.insert(0, words.pop()["w"])
                place(prev_toks + pre, prev_a, back_gap[0], words, skip=False)
                place(post, back_gap[1], b, words, skip=True)
                continue
        if gap is None:
            gap = (a + (b - a) * len(pre) / max(1, len(pre) + len(post)),) * 2
        # kata sebelum penanda mengisi bagian sebelum jeda terpanjang, sesudahnya bagian sesudah jeda
        place(pre, a, gap[0], words, skip=start_marker)
        place(post, gap[1], b, words, skip=not start_marker)
        continue
    toks = re.sub(r"\([^)]*\)", " ", text).split()
    if toks:
        place(toks, a, b, words)

with open(OUT, "w") as f:
    json.dump(words, f, ensure_ascii=False, indent=0)
print(f"{len(words)} kata -> {OUT}")
if "--print" in sys.argv:
    for w in words:
        print(f"{w['t0']:6.2f} {w['t1']:6.2f}  {w['w']}{'  [di luar klip]' if w.get('x') else ''}")
