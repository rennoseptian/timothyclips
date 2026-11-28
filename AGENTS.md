# Panduan agen: klip podcast Timothy Ronald (Remotion)

> Catatan untuk Antigravity: berkas ini salinan `CLAUDE.md` (sumber utama). Saat memperbarui, ubah KEDUANYA. Skill gaya ada di `.agents/skills/timothy-style-guide` dan `.agents/skills/timothy-new-clip`. Alat khusus Claude (task list, kirim file, Project "Editing") tidak ada di sini: baca hasil render langsung dari folder `out/`.

Dokumen hidup, bukan aturan mutlak. Isinya catatan preferensi user sejauh ini supaya hasil makin akurat. Keputusan akhir selalu di user: kalau user meminta sesuatu yang berbeda dari catatan ini, ikuti permintaan user lalu perbarui catatannya.

Baca file ini dulu. Jangan menjelajah ulang repo tanpa perlu. Semua keputusan edit dihasilkan oleh `scripts/build-edit.py` -> `src/script.ts` (shot kamera, caption, SFX).

## Alur kerja hemat token
1. Edit `scripts/build-edit.py` (SHOTS, PHRASES, LEAK_CUTS) lalu `python3 scripts/build-edit.py` (menulis ulang `src/script.ts`; skrip memastikan teks caption sama dengan kata yang diucapkan). Perubahan kecil boleh langsung di `src/script.ts`, tapi catat juga di builder agar tidak hilang.
2. `npx tsc --noEmit && node scripts/check-captions.mjs`.
3. Cek visual dengan `remotion still` pada beberapa frame, bukan render penuh:
   `npx remotion still TimothyClip out.png --frame=N --scale=0.5 --browser-executable=/usr/bin/google-chrome`
4. Preview penuh (+- 8-9 menit per versi, jalankan terlepas dari sesi dengan `nohup setsid bash skrip.sh &` lalu cek log): `npx remotion render TimothyClip out.mp4 --scale=0.5 --concurrency=2 --browser-executable=/usr/bin/google-chrome`
5. Render akhir dilakukan user lewat GitHub Actions "Render video" (memasukkan ID composition; user yang merge PR). Branch kerja: lihat branch terbaru di repo.
6. Hook "unpushed commits" sering salah (clone dangkal). Verifikasi dengan `git ls-remote --heads origin <branch>` vs `git rev-parse HEAD`. Push: `git -c push.negotiate=true push`.

## Klip Windah Basudara (selesai, v2; sudah di-merge ke main)
Sumber `public/Video/windah.mp4` (64.3 dtk, 1080p, 60 fps; video baru dari user via Git LFS, glitch detik 22 sudah hilang) + `public/Caption/transkrip (1).srt` (user: final). Semua `*.mp4` memakai Git LFS (`.gitattributes`): setelah merge/pull jalankan `git lfs fetch origin origin/main --include=...` lalu salin objek dari `.git/lfs/objects` bila `git lfs pull` diam. Composition `WindahClip` (1920x1080, 30 fps, 1929 frame). Cerita emosional: Windah terharu karena Agnes menunggu/ketiduran menonton live-nya, "support system".
- Keputusan ada di `scripts/build-windah.py` -> `src/windah.ts` (PHRASES by indeks kata di `scripts/words-windah.json`, zona, snap, behind; SHOTS kamera; BRIGHT/LIGHT). Renderer: `src/WindahCaptions.tsx` (lockup), `src/WindahClip.tsx` (kamera + hero di belakang subjek), `src/WindahSfx.tsx`.
- KAMERA (user, v2): bergerak HANYA saat Windah bicara ke kamera (adegan halaman web Instagram dengan webcam kanan-bawah; daftar SHOTS). B-roll (live PS4, helm, tukang cukur, buket, pelukan, green screen) DIAM. Gaya Timothy: bingkai tetap per shot, zoom-in pelan di sekitar titik tetap (ox, oy), shot makin rapat (1.0 -> 2.0) agar tension naik, blur singkat hanya pada potongan antar-shot di dalam adegan yang sama.
- CAPTION v2 (jawaban atas "berantakan, tanpa fokus, tanpa depth"): satu lockup padat per caption, SATU baris fokus (Coolvetica Hv Comp besar; `^HERO^` merah atau `**BESAR**`), sisanya label kecil Montserrat Black rata kiri (rasio 0.22, tracking 0.04em; Coolvetica -0.01em). Builder meng-assert tepat satu baris fokus. Kata masuk satu per satu dari arah beda dengan jarak pendek (30 px), hero masuk dengan skala 1.14->1 + blur. Depth: hierarki ukuran, bayangan berlapis, hero membesar pelan 4% (paralaks terhadap kamera), veil putih lembut di halaman web (teks halaman memudar), scrim hitam lembut di footage gelap, dan hero ber-flag `behind=True` (AGNES, SENDIRI, 8 TAHUN) di belakang Windah memakai matte RVM (`public/Video/matte-windah.mp4`, hanya diproses 3 segmen, area dibatasi ke webcam kanan-bawah supaya foto/orang di halaman tidak ikut jadi subjek). Zona: R, RU, RB (belakang subjek, rata bawah), TR, T, TL (green screen: pojok kiri atas supaya tidak menutup wajah), L, R2.
- Teks gelap di halaman web (LIGHT, + veil) dan dinding putih tukang cukur (BRIGHT, tanpa veil); putih + bayangan di footage gelap. SFX hanya tick halus di kata besar/hero. Tanpa flash.
- Matte: `python3 scripts/tools/run_rvm.py SUMBER MODEL.onnx KELUARAN.mp4 "a-b,c-d"` (argumen ke-4 = segmen detik yang diproses, sisanya hitam; 30 fps). Lalu kotak hitamkan area di luar webcam dengan ffmpeg drawbox (x<1400 dan y<660).
- Render latar belakang mati bila sesi berhenti; jalankan ulang bila log berhenti.
- Kalau user minta versi lain (9:16/4:3): zona dan ukuran perlu dirancang ulang karena footage 16:9 berisi layar web.

## Klip Timothy aktif: kFhF0ArcMQs-2.24-2.55 (branch `clip-kfh`)
Sumber `public/Video/kFhF0ArcMQs-2.24-2.55.mp4` (31 dtk, 1080p, 29.97 fps, satu kamera statis; 0.6 dtk pertama putih/kilat) + `public/Caption/kFhF0ArcMQs-2.24-2.55.srt` (user: final; penanda `(mulai)` dan `(selesai)` = kata di luar penanda tidak terucap). Klip: START=0.6 dtk, ucapan sampai "ubah" di 30.4 dtk klip (video sumber habis di situ), lalu frame terakhir ditahan 0.7 dtk (`HOLD`, audio senyap, `Freeze` di Camera.tsx) supaya kata hero terakhir terbaca; total 933 frame, 30 fps. Tiga composition: `TimothyClip` (16:9), `TimothyClip43` (4:3), `TimothyClipVertical` (9:16), semuanya 30 fps (`FPS` dari script.ts).
- Matte `public/Video/matte-kFhF0ArcMQs-2.24-2.55.mp4` dibuat ulang (versi Gemini terpotong/rusak). Kata di `scripts/words.json` (align-words.py). `build-edit.py`: PHRASES kini boleh memakai rentang indeks kata `((dari, sampai), "teks")`; `python3 scripts/build-edit.py --print` mencetak kata beserta indeksnya.
- Hero merah di belakang subjek: SENDIRI, OTAK, UPGRADE, UBAH. Kata besar putih untuk kata kunci lain.
- Klip lama MmU4rSTmI5I (19 dtk) hanya ada di riwayat git.
B-roll anime di `public/BrollFootage/` BELUM dipakai (user masih mencari B-roll anime/film lain; jangan dipakai sebelum diminta).

## Matte subjek (untuk teks di belakang orang)
`public/Video/matte-p1t-074cn38-6.14-6.57.mp4` = matte grayscale (putih = subjek) dari Robust Video Matting (`rvm_mobilenetv3_fp32.onnx` dari GitHub PeterL1n/RobustVideoMatting, onnxruntime CPU, ~5 fps; reset state di potongan shot). Skrip: `scripts/tools/run_rvm.py SUMBER MODEL.onnx KELUARAN.mp4` (baca frame 960x540, downsample_ratio 0.5, tulis gray 1920x1080 crf 14). Di Remotion, subjek = video x matte (mix-blend-mode multiply) ditambahkan (plus-lighter) di atas latar yang sudah dikosongkan dengan matte terbalik; kamera digital memakai transformasi yang sama untuk video dan matte.

## Kalau klip/video diganti
Jalankan ulang: matte (RVM), `python3 scripts/track-face.py` (facetrack.ts; set HARD_CUTS bila sumber punya potongan), `python3 scripts/align-words.py` (words.json; menangani penanda start/selesai di SRT), lalu tulis SHOTS dan PHRASES baru di `build-edit.py` (START/END, indeks frasa otomatis, teks dengan notasi `*penting*`, `**besar**`, `^hero di belakang subjek^`). Sesuaikan `VIDEO`/`MATTE` di `Camera.tsx`; durasi memakai `DURATION_FRAMES` dari script.ts (isi di header builder: START_SEC, START_FRAME, DURATION_FRAMES).

## Preferensi gaya user (sejauh ini, bisa berubah)
- Gaya "anti-slop": emosional lewat potongan antar-ukuran bingkai, bukan efek berlebihan.
- FONT: hanya Montserrat Black (`public/Fonts`). Jangan miring. Coolvetica sudah ditinggalkan (v9: terlihat "slop").
- CAPTION (v9, final sementara): semua ucapan jadi caption, muncul KATA PER KATA dalam satu lockup. Tiap kata masuk dari arah berbeda (atas/kiri/bawah/kanan/zoom) lalu menyatu jadi satu susunan tipografi. 1-2 kata sebelumnya di-blur dan diredupkan saat kata baru muncul, lalu semua fokus lagi di akhir frasa. Kata kunci besar/tebal, kata biasa kecil. Hero merah hemat untuk kata kunci; sebagian hero ditaruh di belakang subjek (matte) tapi tetap terbaca (wajah digeser ke sisi lain).
- Quote pembuka: "I'm the captain of my soul and the master of my fate" dipecah dua lockup (CAPTAIN OF MY SOUL / MASTER OF MY FAITH sesuai ucapan).
- Jarak antarbaris rapat. Efek kedip pada kata penting tertentu disukai.
- Kamera (disetujui user): close-up, medium close-up, extreme close-up; hanya zoom-in pelan; posisi bingkai tetap per shot; blur masuk saat potongan. DILARANG zoom cepat/goyang/tilt.
- SFX: pendek, halus, cepat saat caption muncul (pakai `fade`); suara panjang hanya untuk transisi.
- TIDAK ADA flash/light leak overlay dan tidak ada suara flash (di 9:16 hanya muncul setengah).
- Caption harus sesuai ucapan persis.

## Pelajaran
- Verifikasi hasil patch skrip. Jangan klaim selesai sebelum melihat frame still hasil render.
- Teks di tengah layar harus diberi shot dengan wajah di sisi lain agar tidak menutupi wajah. Hero belakang: geser wajah ke samping (px 0.38/0.62) supaya huruf terbaca di sisi lain; tracking hero kecil (<= 0.12em).
- Di 9:16 zoom per shot dikecilkan (x0.45) karena jendela sudah sempit; hero di vertikal ditaruh di atas kepala.
- `align-words.py`: argumen posisi harus lewat `ARGS` (jangan pakai `sys.argv[1]` langsung, `--print` pernah dibaca sebagai nama video).
- Sub-agen analisis referensi bisa kena batas pemakaian; analisis cukup dengan contact sheet + burst frame sendiri.

- WAJIB: render penuh kedua composition lalu tinjau frame rapat (contact sheet tiap ~0.3 dtk, 16:9 dan 9:16) SEBELUM mengirim preview. Katakan jujur apa yang sudah dicek.
- Render latar belakang mati bila sesi berhenti: jalankan `nohup setsid bash x.sh &` dan cek log.

- Di 9:16 hero belakang-subjek tertutup kepala bila zoom shot besar: kamera vertikal membatasi zoom shot hero (<=1.12) dan hero ditaruh di antara tepi atas dan atas kepala (Captions.tsx). Cek kata hero di sheet 9:16.
- Kata hero yang panjang (mis. DIHANCURIN) meluber/tertutup di 16:9: pakai kata besar putih (`**KATA**`) saja.

## Cara memperbarui dokumen ini
- Setiap user memberi koreksi atau preferensi baru, ubah baris yang berubah (jangan menumpuk yang bertentangan) dan tambah satu baris di riwayat. Catat hanya hal yang memengaruhi klip berikutnya.
- Simpan di commit yang sama dengan perubahan videonya dan salin ke Project "Editing" (`claude/panduan-edit-timothy.md`).
- Preferensi yang hanya untuk satu klip ditulis begitu.

## Riwayat umpan balik
- v1-v7 (klip Timothy lama): gaya anti-slop, kamera tenang, kata penting, SFX pendek, kilatan hanya transisi, dst.
- v8 (klip baru p1t): strategi berubah: semua caption jadi motion seperti referensi, gerak masuk bervariasi (termasuk dari samping), sebagian caption di belakang subjek seperti screenshot referensi.
- v9: kamera disetujui; tipografi v8 ditolak ("slop"). Kembali ke Montserrat, kata-per-kata dengan blur 1-2 kata sebelumnya; tanpa flash overlay/SFX flash; cek full render sebelum kirim preview.
- v10: klip baru MmU4rSTmI5I (19 dtk), gaya v9 dipertahankan; B-roll ditunda.
- v11: klip baru Windah Basudara: gaya caption Timothy, kamera diam, font Coolvetica + Montserrat, caption besar di area kosong. Riwayat remote di-reset ("Initial commit"): branch clip2/clip3 lama tidak ada lagi di origin.
- v11b: Windah v1 ditolak ("berantakan, tidak ada fokus, tidak ada depth") dan video diganti (tanpa glitch).
- v12: Windah v2: kamera boleh bergerak gaya Timothy saat Windah bicara (adegan web), B-roll diam; lockup satu fokus + depth; hero di belakang subjek untuk 3 kata.
- v13: klip baru kFhF0ArcMQs (gaya Timothy), matte dan builder diperbarui; FPS ikut sumber (30).
- v13b: user: "video selesai tidak sesuai timing srt, bagian akhir terpotong". Penyebab: `align-words.py` memakai heuristik mundur-ke-jeda untuk penanda `(selesai)` sehingga 10 kata terakhir terjepit; heuristik dihapus (blok tanpa jeda: kata sebelum penanda mengisi seluruh blok). Pelajaran: cek kata terakhir di words.json terhadap SRT dan amplop audio (jangan asumsikan 'ada kalimat lain'); akhir klip jangan dipotong sebelum ucapan selesai; shot hero harus mulai sebelum/bertepatan dengan awal caption hero.
- v10b: user minta versi 4:3: composition `TimothyClip43` memakai kamera/caption 16:9 apa adanya (tanpa perubahan kode lain), sudah dicek penuh.
- Hero belakang-subjek (16:9 dan 4:3) tidak boleh terpotong tepi bingkai atau kepala: kotak hero dibatasi antara tepi layar dan sisi kepala (Captions.tsx, margin 0.8x lebar wajah). Teks hero jadi lebih kecil, tapi terbaca penuh. 9:16 tidak berubah.
