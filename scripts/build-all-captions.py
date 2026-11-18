"""Buat src/captions-all.ts: transkrip lengkap (mode "semua caption tampil") dari scripts/words.json.

Kata yang sudah tampil besar sebagai caption penting (key/huge di src/script.ts) tidak diulang di teks kecil.
Teks dipecah per frasa: jeda > 0,28 dtk, tanda baca, maks 4 kata, atau kata penting di tengah.
Pakai: python3 scripts/build-all-captions.py  (jalankan setelah align-words.py atau setelah mengubah script.ts)
"""
import json
import re

words = json.load(open("scripts/words.json"))
src = open("src/script.ts", encoding="utf-8").read()
norm = lambda w: re.sub(r"[^a-z0-9']", "", w.lower())

keys = []  # (waktu, token)
for m in re.finditer(r'at: ([0-9.]+), text: "([^"]+)", kind: "(?:key|huge)"', src):
    for tok in m.group(2).split():
        keys.append((float(m.group(1)), norm(tok)))

def is_key(w):
    return any(abs(w["t0"] - t) < 0.7 and norm(w["w"]) == tok for t, tok in keys)

phr, cur, prev = [], [], None
def flush():
    global cur
    if cur:
        phr.append(cur)
    cur = []

for w in words:
    if is_key(w):
        flush()
        prev = None
        continue
    if cur and (w["t0"] - cur[-1]["t1"] > 0.28 or len(cur) >= 4 or re.search(r"[.,?!]$", cur[-1]["w"])):
        flush()
    cur.append(w)
flush()

out = []
for i, ph in enumerate(phr):
    at = ph[0]["t0"]
    end = ph[-1]["t1"] + 0.12
    if i + 1 < len(phr):
        end = min(end, phr[i + 1][0]["t0"] - 0.02)
    end = min(max(end, at + 0.35), 33.9)
    text = " ".join(re.sub(r"[.,?!]+$", "", w["w"]) for w in ph)
    out.append((round(at, 2), round(end, 2), text))

lines = ["// Dihasilkan oleh scripts/build-all-captions.py. Jangan edit manual.", "export const CAPTIONS_ALL: { at: number; end: number; text: string }[] = ["]
for at, end, text in out:
    lines.append(f"  {{ at: {at}, end: {end}, text: {json.dumps(text, ensure_ascii=False)} }},")
lines.append("];")
open("src/captions-all.ts", "w", encoding="utf-8").write("\n".join(lines) + "\n")
print(len(out), "frasa -> src/captions-all.ts")
for at, end, text in out:
    print(f"{at:6.2f} {end:6.2f}  {text}")
