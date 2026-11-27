---
name: timothy-style-guide
description: Gunakan saat mengedit, merevisi, atau mengaudit klip podcast bergaya Timothy Ronald di Remotion, atau saat user menyebut "gaya Timothy", "anti-slop", caption kata-per-kata Montserrat, hero di belakang subjek, kamera zoom pelan, atau SFX halus untuk caption.
---

# Gaya editing Timothy (anti-slop)

Terapkan aturan ini pada setiap keputusan edit. Keputusan akhir selalu di user: bila user meminta sesuatu yang berbeda, ikuti permintaan user lalu catat perubahannya di CLAUDE.md repo.

## Prinsip
- Emosi datang dari potongan antar-ukuran bingkai dan tipografi yang rapi, bukan dari efek berlebihan.
- Caption harus sama persis dengan ucapan. Jangan memakai kalimat SRT yang tidak terucap di audio.

## Kamera
- Boleh: wide, medium close-up (zoom 1.35-1.5), close-up (1.55-1.9), extreme close-up (~2.0).
- Hanya zoom-in pelan; posisi bingkai tetap per shot (berdasarkan posisi wajah median shot itu); blur masuk singkat saat potongan (10-14 px, pulih ~0.35 dtk).
- DILARANG: zoom cepat, goyang, tilt, rotasi.
- Teks di tengah layar butuh shot dengan wajah di sisi lain (px 0.38 atau 0.62).

## Caption
- Font HANYA Montserrat Black (`public/Fonts`). Tidak miring. Coolvetica ditinggalkan untuk gaya ini.
- Semua ucapan jadi caption, muncul KATA PER KATA dalam satu lockup. Tiap kata masuk dari arah berbeda (atas/kiri/bawah/kanan/zoom), lalu menyatu.
- 1-2 kata sebelumnya di-blur dan diredupkan saat kata baru masuk; semua fokus lagi di akhir frasa.
- Kata kunci besar/tebal, kata biasa kecil (label). Hero merah dipakai hemat untuk kata kunci; sebagian hero diletakkan di BELAKANG subjek (matte) tapi tetap terbaca.
- Jarak antarbaris rapat. Efek kedip pada kata penting tertentu disukai.
- Hero belakang-subjek: tidak boleh terpotong tepi bingkai atau kepala (kotak dibatasi antara tepi layar dan sisi kepala, margin 0.8x lebar wajah). Tracking hero kecil (<= 0.12em). Kata hero panjang (mis. DIHANCURIN) pakai kata besar putih saja.
- Quote pembuka dipecah dua lockup mengikuti ucapan persis.

## SFX
- Pendek, halus, cepat saat caption muncul (pakai `fade`). Suara panjang hanya untuk transisi.
- TIDAK ADA flash atau light-leak overlay, dan tidak ada suara flash.

## Format lain
- 9:16: zoom per shot dikecilkan (x0.45), hero ditaruh di atas kepala, zoom shot hero <= 1.12.
- 4:3 (1440x1080): memakai kamera/caption 16:9 apa adanya.

## Verifikasi (wajib)
- Jangan klaim selesai sebelum melihat frame still hasil render.
- Render penuh semua composition lalu tinjau contact sheet rapat (tiap ~0.3 dtk) SEBELUM mengirim preview. Katakan jujur apa yang sudah dicek; audio tidak bisa didengar agen.

Detail dan riwayat umpan balik: `references/style-rules.md`.
