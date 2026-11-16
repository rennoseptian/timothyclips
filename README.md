# timothyclips

Klip pendek dengan caption animasi, dibuat dengan [Remotion](https://www.remotion.dev).

## Isi `public/`

| Folder | Isi |
| --- | --- |
| `Video/` | Klip utama |
| `Caption/` | File `.srt` untuk klip |
| `Fonts/` | Montserrat Black, Coolvetica Italic, Aston Script |
| `Sfx/` | Efek suara |
| `Overlays-for-transition-if-need-it/` | Light leak (opsional) |
| `Reference-video-for-styles-and-caption/` | Referensi gaya, tidak dipakai saat render |

## Perintah

```console
npm i
npm run dev        # preview di Remotion Studio
npm run lint
```

Render akhir dilakukan di GitHub: tab **Actions** > **Render video** > **Run workflow**
(ID composition: `TimothyClip`). Hasilnya diunduh dari bagian *Artifacts* (`video`).

## Mengubah caption

- Teks dan waktu: `src/captions.ts`, dibuat otomatis dari SRT:
  `node scripts/srt-to-captions.mjs "public/Caption/nama-file.srt"`
  (waktu per kata adalah perkiraan di dalam tiap baris SRT).
- Pembagian baris dan gaya (`soft`, `bold`, `key`, `script`): `src/pages.ts`.
  Jumlah kata di sana harus sama dengan `captions.ts`, kalau tidak preview akan menampilkan error.
- Tampilan dan animasi: `src/CaptionLayer.tsx`.
- Opsi di panel Props Studio: `sfx` (klik halus di kata kunci) dan `lightLeak` (overlay di awal).
