---
name: timothy-new-clip
description: Gunakan saat user ingin membuat klip baru bergaya Timothy dari video dan SRT (satu kamera podcast), misalnya "edit klip baru gaya Timothy", "pakai template Timothy", "buat caption dan kamera seperti klip Timothy", atau saat video/klip diganti dan pipeline harus dijalankan ulang.
---

# Membuat klip baru gaya Timothy

Baca skill `timothy-style-guide` lebih dulu. Kode template sudah ada di repo ini: `src/Camera.tsx`, `Captions.tsx`, `Sfx.tsx`, `Composition.tsx` dan `scripts/` (build-edit.py, align-words.py, track-face.py, check-captions.mjs, tools/run_rvm.py).

## Prasyarat
- Repo Remotion (4.x) dengan `@remotion/media`, `@remotion/fonts`; font `public/Fonts/Montserrat-Black.ttf`; SFX di `public/Sfx`.
- Video dan SRT di `public/Video` dan `public/Caption`. SRT dari user dianggap final.
- Python dengan Pillow, numpy, opencv, onnxruntime; ffmpeg; model RVM `rvm_mobilenetv3_fp32.onnx` (GitHub PeterL1n/RobustVideoMatting).

## Langkah
1. Pakai kode yang sudah ada di `src/` dan `scripts/`; jangan menimpa perubahan user.
2. Matte subjek: `python3 scripts/tools/run_rvm.py VIDEO MODEL.onnx public/Video/matte-NAMA.mp4` (argumen ke-4 opsional: segmen "a-b,c-d" saja yang diproses).
3. `python3 scripts/track-face.py` (hasil `src/facetrack.ts`; set HARD_CUTS bila sumber punya potongan).
4. `python3 scripts/align-words.py` (hasil `scripts/words.json`; menangani penanda start/selesai di SRT).
5. Edit `scripts/build-edit.py`: START/END/FPS, SHOTS (kamera) dan PHRASES (notasi `*penting*`, `**besar**`, `^hero di belakang subjek^`, baris dipisah ` / `), lalu `python3 scripts/build-edit.py`. Skrip memastikan teks caption sama dengan ucapan.
6. Sesuaikan `VIDEO`/`MATTE` di `Camera.tsx`; durasi memakai `DURATION_FRAMES` dari `script.ts`.
7. `npx tsc --noEmit && node scripts/check-captions.mjs`.
8. Cek visual: `npx remotion still ID out.png --frame=N --scale=0.5 --browser-executable=/usr/bin/google-chrome` pada kata hero dan potongan shot.
9. Preview penuh detached: `nohup setsid bash render.sh &` dengan `npx remotion render ID out.mp4 --scale=0.5 --concurrency=2 ...`, cek log. Lalu contact sheet rapat 16:9 (dan 9:16/4:3 bila ada) sebelum mengirim preview.
10. Render final dilakukan user lewat workflow "Render video" (memasukkan ID composition). Perbarui CLAUDE.md di commit yang sama.

## Catatan
- B-roll tidak dipakai sebelum user memintanya.
- Jangan membuat flash/light-leak.
- Bila user memberi referensi baru, ukur frame demi frame (potongan, blur, gerak) sebelum menulis ulang gaya.
