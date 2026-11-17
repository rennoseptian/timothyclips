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

VIDEO = sys.argv[1] if len(sys.argv) > 1 else "public/Video/77k-ugH5yF0-1.37.16-1.37.50.mp4"
SRT = sys.argv[2] if len(sys.argv) > 2 else "public/Caption/77k-ugH5yF0-1.37.16-1.37.50.srt"
OUT = sys.argv[3] if len(sys.argv) > 3 else "scripts/words.json"

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


words = []
for block in re.split(r"\n\n+", open(SRT, encoding="utf-8").read().replace("\r", "").strip()):
    lines = block.split("\n")
    a, b = (to_s(p) for p in lines[1].split("-->"))
    toks = " ".join(lines[2:]).split()
    if not toks:
        continue
    syl = np.array([syllables(t) for t in toks], dtype=float)
    cs = np.concatenate([[0], np.cumsum(syl)]) / syl.sum()
    v0, v1 = V(a), V(b)
    for i, t in enumerate(toks):
        t0 = Vinv(v0 + (v1 - v0) * cs[i]) if v1 - v0 > 0.05 else a + (b - a) * cs[i]
        t1 = Vinv(v0 + (v1 - v0) * cs[i + 1]) if v1 - v0 > 0.05 else a + (b - a) * cs[i + 1]
        words.append({"w": t, "t0": round(max(t0, a - 0.05), 3), "t1": round(min(max(t1, t0 + 0.04), b + 0.05), 3)})

with open(OUT, "w") as f:
    json.dump(words, f, ensure_ascii=False, indent=0)
print(f"{len(words)} kata -> {OUT}")
if "--print" in sys.argv:
    for w in words:
        print(f"{w['t0']:6.2f} {w['t1']:6.2f}  {w['w']}")
