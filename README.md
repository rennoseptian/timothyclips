# timothyclips

Klip podcast pendek (16:9) dengan kamera digital, caption kata penting, dan SFX, dibuat dengan [Remotion](https://www.remotion.dev).

## Perintah

```console
npm i
npm run dev        # preview di Remotion Studio
npm run lint
node scripts/check-captions.mjs   # pastikan caption memang diucapkan di SRT
```

Render akhir di GitHub: tab **Actions** > **Render video** > **Run workflow** (ID composition: `TimothyClip`).
Hasilnya diunduh dari *Artifacts* (`video`).

## Semua keputusan edit ada di `src/script.ts`

| Bagian | Isi |
| --- | --- |
| `SHOTS` | Kamera digital: skala awal -> akhir (wide 1.0 / MCU 1.3 / close-up 1.45-1.6 / ECU ~1.9), posisi wajah di layar, blur saat shot masuk. Hanya zoom-in pelan, tanpa sway, rotasi, atau tilt |
| `CAPTIONS` | Hanya kata penting. `soft` = pengantar kecil, `key` = kata kunci besar, `huge` = puncak. `flicker` = kedip |
| `LEAKS` | Overlay light leak (opsional, bisa dimatikan lewat prop `leak`) |
| `SFX_LIB` / `SFX_CUES` | Daftar SFX dengan volume dasar, dan kapan masing-masing diputar |

Panel Props di Studio: `sfx` (nyala/mati), `sfxGain` (pengali volume semua SFX), `leak`.

## Berkas

- `src/Camera.tsx`: kamera digital. Tiap shot memakai posisi bingkai tetap (wajah median dari `src/facetrack.ts`) dan zoom-in linear pelan.
- `src/Captions.tsx`: tampilan caption (Coolvetica Rg untuk pengantar, Coolvetica Hv Comp untuk kata penting).
- `src/Sfx.tsx`: memutar `SFX_CUES`.
- `scripts/track-face.py`: membuat `src/facetrack.ts` dari klip (`pip install opencv-python-headless`).
- `scripts/check-captions.mjs`: mencocokkan setiap caption dengan ucapan di SRT (waktu per kata di SRT hanya perkiraan, toleransi 1 dtk).
- `public/Sfx/normalized/`: salinan dua SFX yang sangat pelan di sumbernya (`click-1.mp3`, `Camera Focusing`), dinaikkan volumenya dengan limiter.

## Mengganti klip

1. Taruh video dan `.srt` baru di `public/Video` dan `public/Caption`.
2. Jalankan `python3 scripts/track-face.py "public/Video/nama.mp4"` dan perbarui `HARD_CUTS` di skrip itu serta di `src/Camera.tsx` bila ada potongan kamera asli.
3. Susun ulang `SHOTS`, `CAPTIONS`, dan `SFX_CUES` di `src/script.ts`, lalu `node scripts/check-captions.mjs`.
