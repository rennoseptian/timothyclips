"""Lacak posisi wajah pada klip utama -> src/facetrack.ts

Pakai: python3 scripts/track-face.py "public/Video/nama.mp4" [src/facetrack.ts]

Kamera digital di src/Camera.tsx memakai data ini supaya zoom/close-up selalu
mengikuti wajah. Potongan kamera asli (mis. ke tamu) dihaluskan terpisah supaya
pergerakan tidak "meluncur" melewati potongan.
"""
import sys

import cv2
import numpy as np

SRC = sys.argv[1] if len(sys.argv) > 1 else "public/Video/77k-ugH5yF0-1.37.16-1.37.50.mp4"
OUT = sys.argv[2] if len(sys.argv) > 2 else "src/facetrack.ts"
STEP = 3  # ambil sampel tiap 3 frame
# detik potongan kamera asli pada klip (hasil deteksi adegan)
HARD_CUTS = [12.25, 14.667]

cap = cv2.VideoCapture(SRC)
fps = cap.get(cv2.CAP_PROP_FPS)
W = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
H = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

base = cv2.data.haarcascades
front = cv2.CascadeClassifier(base + "haarcascade_frontalface_default.xml")
profile = cv2.CascadeClassifier(base + "haarcascade_profileface.xml")

SCALE = 0.5
samples = []  # (t, x, y, size) ternormalisasi, None jika tidak terdeteksi


def best(boxes):
    if len(boxes) == 0:
        return None
    return max(boxes, key=lambda b: b[2] * b[3])


i = 0
while True:
    ok, frame = cap.read()
    if not ok:
        break
    if i % STEP == 0:
        small = cv2.resize(frame, None, fx=SCALE, fy=SCALE)
        gray = cv2.equalizeHist(cv2.cvtColor(small, cv2.COLOR_BGR2GRAY))
        found = best(front.detectMultiScale(gray, 1.1, 5, minSize=(40, 40)))
        if found is None:
            found = best(profile.detectMultiScale(gray, 1.1, 4, minSize=(40, 40)))
        if found is None:
            flipped = cv2.flip(gray, 1)
            f = best(profile.detectMultiScale(flipped, 1.1, 4, minSize=(40, 40)))
            if f is not None:
                found = (gray.shape[1] - f[0] - f[2], f[1], f[2], f[3])
        t = i / fps
        if found is None:
            samples.append((t, None, None, None))
        else:
            x, y, w, h = found
            samples.append(
                (t, (x + w / 2) / gray.shape[1], (y + h / 2) / gray.shape[0], w / gray.shape[1])
            )
    i += 1
cap.release()

hit = sum(1 for s in samples if s[1] is not None)
print(f"{len(samples)} sampel, wajah terdeteksi di {hit} ({hit / len(samples):.0%})")

ts = np.array([s[0] for s in samples])
xs = np.array([np.nan if s[1] is None else s[1] for s in samples])
ys = np.array([np.nan if s[2] is None else s[2] for s in samples])
ss = np.array([np.nan if s[3] is None else s[3] for s in samples])


def smooth_segment(idx):
    out = []
    for arr in (xs, ys, ss):
        a = arr[idx].copy()
        good = ~np.isnan(a)
        if good.sum() == 0:
            out.append(np.full(len(a), np.nan))
            continue
        a = np.interp(np.arange(len(a)), np.where(good)[0], a[good])
        # median filter (buang loncatan) lalu EMA dua arah (halus tanpa lag)
        pad = np.pad(a, 3, mode="edge")
        med = np.array([np.median(pad[k:k + 7]) for k in range(len(a))])
        ema_f = med.copy()
        for k in range(1, len(med)):
            ema_f[k] = ema_f[k - 1] * 0.7 + med[k] * 0.3
        ema_b = ema_f.copy()
        for k in range(len(med) - 2, -1, -1):
            ema_b[k] = ema_b[k + 1] * 0.7 + ema_f[k] * 0.3
        out.append((ema_f + ema_b) / 2)
    return out


bounds = [0.0] + HARD_CUTS + [1e9]
rows = []
for a, b in zip(bounds[:-1], bounds[1:]):
    idx = np.where((ts >= a) & (ts < b))[0]
    if len(idx) == 0:
        continue
    sx, sy, ss_ = smooth_segment(idx)
    for k, j in enumerate(idx):
        rows.append((ts[j], sx[k], sy[k], ss_[k]))

# jika satu segmen sama sekali tanpa deteksi, pakai rata-rata global sebagai cadangan
gx = np.nanmean(xs)
gy = np.nanmean(ys)
gs = np.nanmean(ss)
lines = []
for t, x, y, s in rows:
    x = gx if np.isnan(x) else x
    y = gy if np.isnan(y) else y
    s = gs if np.isnan(s) else s
    lines.append(f"  [{t:.3f}, {x:.4f}, {y:.4f}, {s:.4f}],")

with open(OUT, "w") as f:
    f.write(
        "// Dibuat otomatis oleh scripts/track-face.py\n"
        "// Format: [detik, x, y, lebar wajah], semuanya ternormalisasi 0..1 terhadap frame sumber.\n"
        "export const FACE_TRACK: [number, number, number, number][] = [\n"
        + "\n".join(lines)
        + "\n];\n"
    )

print(f"-> {OUT}")
for t0 in (0, 3, 6, 9, 11, 13, 16, 20, 25, 30):
    j = int(np.argmin(np.abs(ts - t0)))
    print(f"t={t0:>2}s  asli x={xs[j]:.2f} y={ys[j]:.2f} w={ss[j]:.2f}" if not np.isnan(xs[j]) else f"t={t0:>2}s  (tidak terdeteksi)")
