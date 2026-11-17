# Panduan agen: klip podcast Timothy Ronald (Remotion)

Baca file ini dulu. Jangan menjelajah ulang repo atau menonton ulang referensi tanpa perlu: semua keputusan edit ada di `src/script.ts`.

## Alur kerja hemat token
1. Ubah hanya `src/script.ts` (SHOTS, CAPTIONS, LEAKS, SFX_CUES). Komponen (`Camera/Captions/Sfx/Composition.tsx`) jarang perlu disentuh.
2. `npx tsc --noEmit && node scripts/check-captions.mjs` (validasi waktu kata vs ucapan).
3. Cek visual dengan `remotion still` pada beberapa frame saja, bukan render penuh:
   `npx remotion still TimothyClip out.png --frame=N --scale=0.5 --browser-executable=/usr/bin/google-chrome`
4. Preview penuh: `npx remotion render TimothyClip out.mp4 --scale=0.5 --concurrency=2 --browser-executable=/usr/bin/google-chrome`
5. Render akhir dilakukan user lewat GitHub Actions "Render video" (user yang merge PR). Branch kerja: `edit-kamera-sfx`.
6. Hook "unpushed commits" sering salah (shallow clone). Verifikasi dengan `git ls-remote --heads origin <branch>` vs `git rev-parse HEAD`. Push: `git -c push.negotiate=true push`.

## Spesifikasi
16:9, 1920x1080, 24 fps, 816 frame (34 dtk). Video sumber berakhir di tengah kata "Dan itu": suara fade 10 frame + turun ke hitam 10 frame.

## Aturan gaya dari user (wajib)
- Gaya "anti-slop" seperti video referensi di `public/Reference-video-for-styles-and-caption`: emosional lewat potongan antar-ukuran bingkai, bukan efek berlebihan.
- Caption HANYA kata penting, bukan semua ucapan. Kata penting putih dan dibesarkan. Satu-satunya kata berwarna: BETUL (merah, glow tipis, di tengah).
- Jangan pakai font miring. Font: Coolvetica Rg (kecil) dan Coolvetica Hv Comp (besar), semua dari `public/Fonts`.
- Jarak antarbaris caption bertumpuk harus rapat.
- Kamera: close-up wajah, medium close-up, extreme close-up. DILARANG zoom cepat, goyang, sway, tilt. Hanya zoom-in pelan untuk membangun tegangan. Posisi bingkai tetap per shot.
- Efek kedip (flicker) pada caption penting disukai. Caption yang punya SFX kedip harus benar-benar berkedip (`flicker: true`).
- SFX harus bervariasi, pakai file milik user di `public/Sfx` (volume sudah dinormalisasi di SFX_LIB; jangan naikkan sembarangan).
- Light leak tipis dan hangat, hanya di momen tertentu.

## Waktu caption
SRT hanya punya waktu per baris. Jalankan `python3 scripts/align-words.py` untuk waktu per kata dari audio (`scripts/words.json`). Waktu caption di script.ts sudah dikoreksi dengan ini; kalau ada kata terasa terlalu cepat/lambat, geser `at` kata itu dan cue SFX yang menempel padanya.

## Pelajaran
- Verifikasi hasil patch skrip (patch Python yang gagal diam-diam pernah meninggalkan data lama).
- Teks di tengah layar harus diberi shot dengan wajah di sisi lain agar tidak menutupi wajah.
- Jangan klaim "selesai" sebelum melihat frame still hasil render.
