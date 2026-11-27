# Riwayat umpan balik dan pelajaran (klip Timothy)

- v1-v7: gaya anti-slop, kamera tenang, kata penting, SFX pendek, kilatan hanya transisi.
- v8: semua caption jadi motion seperti referensi, gerak masuk bervariasi, sebagian di belakang subjek.
- v9: kamera disetujui; tipografi v8 ditolak ("slop"). Kembali ke Montserrat, kata-per-kata dengan blur 1-2 kata sebelumnya; tanpa flash overlay/SFX flash.
- v10: klip MmU4rSTmI5I (19 dtk), gaya v9 dipertahankan; B-roll ditunda (jangan dipakai sebelum diminta).
- v10b: versi 4:3 memakai kamera/caption 16:9.
- Hero belakang-subjek tidak boleh terpotong tepi/kepala.

## Pelajaran teknis
- Verifikasi hasil patch skrip; jangan klaim selesai sebelum melihat still hasil render.
- `align-words.py`: argumen posisi lewat `ARGS` (jangan `sys.argv[1]` langsung).
- Di 9:16 hero belakang-subjek tertutup kepala bila zoom besar: batasi zoom shot hero (<=1.12), hero di antara tepi atas dan atas kepala.
- Render latar belakang mati bila sesi berhenti: `nohup setsid bash x.sh &` lalu cek log.
- Hook "unpushed commits" sering salah (clone dangkal): bandingkan `git ls-remote --heads origin <branch>` dengan `git rev-parse HEAD`.
- Semua `.mp4` repo memakai Git LFS; upload LFS dari sandbox bisa diblokir proxy, minta user push videonya. Workflow render harus `actions/checkout` dengan `lfs: true`.
