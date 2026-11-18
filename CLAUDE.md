# Panduan agen: klip podcast Timothy Ronald (Remotion)

Dokumen hidup, bukan aturan mutlak. Isinya catatan preferensi user sejauh ini supaya hasil makin akurat. Keputusan akhir selalu di user: kalau user meminta sesuatu yang berbeda dari catatan ini, ikuti permintaan user lalu perbarui catatannya.

Baca file ini dulu. Jangan menjelajah ulang repo tanpa perlu. Semua keputusan edit dihasilkan oleh `scripts/build-edit.py` -> `src/script.ts` (shot kamera, caption, SFX, light leak).

## Alur kerja hemat token
1. Edit `scripts/build-edit.py` (SHOTS, PHRASES, LEAK_CUTS) lalu `python3 scripts/build-edit.py` (menulis ulang `src/script.ts`; skrip memastikan teks caption sama dengan kata yang diucapkan). Perubahan kecil boleh langsung di `src/script.ts`, tapi catat juga di builder agar tidak hilang.
2. `npx tsc --noEmit && node scripts/check-captions.mjs`.
3. Cek visual dengan `remotion still` pada beberapa frame, bukan render penuh:
   `npx remotion still TimothyClip out.png --frame=N --scale=0.5 --browser-executable=/usr/bin/google-chrome`
4. Preview penuh (+- 8-9 menit per versi, jalankan terlepas dari sesi dengan `nohup setsid bash skrip.sh &` lalu cek log): `npx remotion render TimothyClip out.mp4 --scale=0.5 --concurrency=2 --browser-executable=/usr/bin/google-chrome`
5. Render akhir dilakukan user lewat GitHub Actions "Render video" (memasukkan ID composition; user yang merge PR). Branch kerja: lihat branch terbaru di repo.
6. Hook "unpushed commits" sering salah (clone dangkal). Verifikasi dengan `git ls-remote --heads origin <branch>` vs `git rev-parse HEAD`. Push: `git -c push.negotiate=true push`.

## Klip aktif
Sumber `public/Video/p1t-074cn38-6.14-6.57.mp4` (43 dtk, satu kamera statis, 24 fps) + SRT. Catatan editor di SRT: "(video start dari sini)" dan "(selesai disini)". Klip final = sumber 2.0 s sampai 42.58 s (974 frame, 40.6 dtk). Dua composition: `TimothyClip` (16:9) dan `TimothyClipVertical` (9:16).

## Matte subjek (untuk teks di belakang orang)
`public/Video/matte-p1t-074cn38-6.14-6.57.mp4` = matte grayscale (putih = subjek) dari Robust Video Matting (`rvm_mobilenetv3_fp32.onnx` dari GitHub PeterL1n/RobustVideoMatting, onnxruntime CPU, ~5 fps; reset state di potongan shot). Skrip: `scripts/tools/run_rvm.py SUMBER MODEL.onnx KELUARAN.mp4` (baca frame 960x540, downsample_ratio 0.5, tulis gray 1920x1080 crf 14). Di Remotion, subjek = video x matte (mix-blend-mode multiply) ditambahkan (plus-lighter) di atas latar yang sudah dikosongkan dengan matte terbalik; kamera digital memakai transformasi yang sama untuk video dan matte.

## Kalau klip/video diganti
Jalankan ulang: matte (RVM), `python3 scripts/track-face.py` (facetrack.ts; set HARD_CUTS bila sumber punya potongan), `python3 scripts/align-words.py` (words.json; menangani penanda start/selesai di SRT), lalu tulis SHOTS dan PHRASES baru di `build-edit.py` (START/END, indeks frasa otomatis, teks dengan notasi `*penting*`, `**besar**`, `^hero di belakang subjek^`). Sesuaikan `VIDEO`/`MATTE` di `Camera.tsx` dan `durationInFrames` di `Composition.tsx`.

## Preferensi gaya user (sejauh ini, bisa berubah)
- Gaya "anti-slop" seperti video referensi di `public/Reference-video-for-styles-and-caption`: emosional lewat potongan antar-ukuran bingkai, bukan efek berlebihan.
- STRATEGI CAPTION TERBARU: SEMUA ucapan jadi caption bergerak (bukan hanya kata penting), seperti referensi: frasa 1-5 kata, tumpukan 1-3 baris campuran ukuran (kecil + kata penting condensed besar). Gerak masuk harus bervariasi (dari bawah, atas, samping, zoom, huruf merapat, tersingkap), bukan hanya dari bawah. Sebagian caption ditaruh DI BELAKANG subjek tetapi tetap terbaca (contoh: `public/reference-screenshoot`: teks merah tinggi-sempit raksasa, tertutup kepala sebagian). Hero merah dipakai hemat untuk kata/frasa kunci.
- Referensi (video): caption masuk dengan blur ke fokus bersamaan dengan potongan shot, ditahan diam, ganti ke frasa berikutnya; posisi di samping subjek.
- Jangan pakai font miring. Font: Coolvetica Rg (kecil) dan Coolvetica Hv Comp (besar/hero), dari `public/Fonts`.
- Jarak antarbaris caption bertumpuk rapat.
- Kamera: close-up wajah, medium close-up, extreme close-up. DILARANG zoom cepat, goyang, sway, tilt. Hanya zoom-in pelan. Posisi bingkai tetap per shot.
- Efek kedip (flicker) pada caption penting disukai; kalau ada SFX kedip, teksnya harus benar-benar berkedip.
- SFX: bervariasi, dari `public/Sfx`; saat caption muncul harus pendek, halus, cepat (pakai `fade`); suara panjang/keras hanya untuk transisi. SFX flicker sesuai lama kedip teks.
- Light leak/kilatan HANYA di perpindahan shot, dengan puncak tepat di potongan; suara flash juga hanya di transisi.
- Caption harus sesuai ucapan persis.

## Pelajaran
- Verifikasi hasil patch skrip. Jangan klaim selesai sebelum melihat frame still hasil render.
- Teks di tengah layar harus diberi shot dengan wajah di sisi lain agar tidak menutupi wajah. Hero belakang: geser wajah ke samping (px 0.38/0.62) supaya huruf terbaca di sisi lain; tracking hero kecil (<= 0.12em).
- Di 9:16 zoom per shot dikecilkan (x0.45) karena jendela sudah sempit; hero di vertikal ditaruh di atas kepala.
- `align-words.py`: argumen posisi harus lewat `ARGS` (jangan pakai `sys.argv[1]` langsung, `--print` pernah dibaca sebagai nama video).
- Sub-agen analisis referensi bisa kena batas pemakaian; analisis cukup dengan contact sheet + burst frame sendiri.

## Cara memperbarui dokumen ini
- Setiap user memberi koreksi atau preferensi baru, ubah baris yang berubah (jangan menumpuk yang bertentangan) dan tambah satu baris di riwayat. Catat hanya hal yang memengaruhi klip berikutnya.
- Simpan di commit yang sama dengan perubahan videonya dan salin ke Project "Editing" (`claude/panduan-edit-timothy.md`).
- Preferensi yang hanya untuk satu klip ditulis begitu.

## Riwayat umpan balik
- v1-v7 (klip Timothy lama): gaya anti-slop, kamera tenang, kata penting, SFX pendek, kilatan hanya transisi, dst.
- v8 (klip baru p1t): strategi berubah: semua caption jadi motion seperti referensi, gerak masuk bervariasi (termasuk dari samping), sebagian caption di belakang subjek seperti screenshot referensi.
