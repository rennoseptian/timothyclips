// Edit script untuk klip: semua keputusan kamera, caption, dan SFX ada di sini.
// Waktu dalam detik (dihitung dari awal klip). File ini sengaja berdiri sendiri
// (tanpa import) supaya bisa dibaca juga oleh scripts/check-captions.mjs.

export const FPS = 24;
// Klip penuh 34 dtk (sampai akhir sumber). Ucapan terakhir "Dan itu" terpotong di sumbernya,
// jadi suara di-fade 6 frame di akhir.
export const DURATION_FRAMES = 816;

/* ------------------------------------------------------------------ */
/* KAMERA                                                             */
/* ------------------------------------------------------------------ */

export type Shot = {
  from: number;
  to: number;
  /** skala awal -> akhir. Hanya zoom-in pelan (maks ~3% per detik). 1 = frame penuh */
  s: [number, number];
  /** posisi wajah di layar output (0..1). px kecil = wajah di kiri, caption di kanan */
  px: number;
  py: number;
  /** blur sesaat saat shot masuk (px), seperti di referensi. 0 = tanpa blur */
  blur: number;
};

// Tangga ukuran (lebar wajah / lebar frame di sumber 1080p):
//   wide 1.0-1.1x (13-14%) | MCU 1.3-1.4x | close-up 1.45-1.6x | ECU ~1.9x (24%+)
// Tidak ada sway, rotasi, tilt, atau dorongan: referensi hampir diam, variasinya dari potongan.
export const SHOTS: Shot[] = [
  { from: 0.0, to: 2.36, s: [1.0, 1.06], px: 0.4, py: 0.44, blur: 0 },
  { from: 2.36, to: 5.08, s: [1.3, 1.4], px: 0.63, py: 0.4, blur: 12 },
  { from: 5.08, to: 7.6, s: [1.0, 1.07], px: 0.39, py: 0.43, blur: 10 },
  { from: 7.6, to: 10.28, s: [1.45, 1.57], px: 0.38, py: 0.4, blur: 12 },
  { from: 10.28, to: 12.25, s: [1.3, 1.4], px: 0.64, py: 0.42, blur: 10 },
  { from: 12.25, to: 14.67, s: [1.15, 1.22], px: 0.64, py: 0.42, blur: 12 },
  { from: 14.67, to: 15.95, s: [1.2, 1.27], px: 0.26, py: 0.44, blur: 10 },
  { from: 15.95, to: 17.2, s: [1.85, 1.93], px: 0.38, py: 0.4, blur: 14 },
  { from: 17.2, to: 19.9, s: [1.0, 1.07], px: 0.62, py: 0.44, blur: 10 },
  { from: 19.9, to: 22.0, s: [1.3, 1.38], px: 0.4, py: 0.42, blur: 10 },
  { from: 22.0, to: 25.5, s: [1.45, 1.6], px: 0.64, py: 0.4, blur: 12 },
  { from: 25.5, to: 27.3, s: [1.85, 1.95], px: 0.36, py: 0.38, blur: 14 },
  { from: 27.3, to: 30.0, s: [1.0, 1.06], px: 0.4, py: 0.44, blur: 12 },
  { from: 30.0, to: 34.0, s: [1.35, 1.52], px: 0.62, py: 0.42, blur: 12 },
];

/* ------------------------------------------------------------------ */
/* CAPTION (hanya kata penting, bukan semua ucapan)                   */
/* ------------------------------------------------------------------ */

export type CapLine = {
  /** detik saat kata ini diucapkan */
  at: number;
  text: string;
  /** soft = kecil (pengantar), key = kata penting (besar), huge = puncak */
  kind: "soft" | "key" | "huge";
  /** efek kedip saat muncul */
  flicker?: boolean;
  /** warna khusus (default putih). red = merah dengan glow tipis, untuk satu momen perhatian */
  color?: "red";
};
export type CapEvent = { side: "R" | "L" | "B" | "C"; end: number; lines: CapLine[] };

export const CAPTIONS: CapEvent[] = [
  { side: "R", end: 2.25, lines: [{ at: 0.62, text: "misalnya", kind: "soft" }, { at: 0.98, text: "NARSIS", kind: "key" }, { at: 1.42, text: "PEDULI SETAN", kind: "key" }] },
  { side: "L", end: 4.7, lines: [{ at: 3.29, text: "mau bikin", kind: "soft" }, { at: 3.69, text: "KONTEN", kind: "key" }] },
  { side: "R", end: 7.45, lines: [{ at: 5.84, text: "itu kan", kind: "soft" }, { at: 6.35, text: "DI KEPALA", kind: "key" }] },
  { side: "R", end: 10.2, lines: [{ at: 9.58, text: "ENGGAK BERANI", kind: "key" }] },
  { side: "L", end: 12.2, lines: [{ at: 11.31, text: "gimana ya gua", kind: "soft" }, { at: 11.8, text: "MALU", kind: "huge", flicker: true }] },
  { side: "L", end: 14.6, lines: [{ at: 13.52, text: "orang tuh", kind: "soft" }, { at: 13.87, text: "ENGGAK", kind: "key" }, { at: 14.1, text: "PEDULI", kind: "key" }] },
  // "Betul": satu-satunya kata berwarna, merah dengan glow tipis, di tengah layar
  { side: "C", end: 15.85, lines: [{ at: 14.76, text: "BETUL", kind: "huge", color: "red" }] },
  { side: "R", end: 17.1, lines: [{ at: 15.99, text: "SPOTLIGHT", kind: "huge", flicker: true }, { at: 16.38, text: "EFFECT", kind: "huge", flicker: true }] },
  { side: "L", end: 23.45, lines: [{ at: 22.34, text: "kalau lu bukan", kind: "soft" }, { at: 22.97, text: "DONALD TRUMP", kind: "key", flicker: true }] },
  { side: "L", end: 25.4, lines: [{ at: 23.48, text: "belum jadi", kind: "soft" }, { at: 24.15, text: "PRESIDEN", kind: "key" }] },
  { side: "R", end: 27.2, lines: [{ at: 25.6, text: "YOU'RE", kind: "huge" }, { at: 26.02, text: "NOBODY", kind: "huge", flicker: true }] },
  { side: "R", end: 29.6, lines: [{ at: 28.48, text: "ada", kind: "soft" }, { at: 28.72, text: "DUA ORANG", kind: "key" }] },
  { side: "L", end: 30.9, lines: [{ at: 29.76, text: "di", kind: "soft" }, { at: 29.95, text: "KOLOM KOMEN", kind: "key" }] },
  { side: "L", end: 31.92, lines: [{ at: 30.97, text: "ALAY LU", kind: "key" }] },
  // "sakit hati" dan "apa sih" dipisah: APA SIH muncul sendiri saat diucapkan, bertahan sampai jeda
  { side: "L", end: 32.65, lines: [{ at: 32.1, text: "SAKIT", kind: "huge", flicker: true }, { at: 32.3, text: "HATI", kind: "huge", flicker: true }] },
  { side: "L", end: 33.6, lines: [{ at: 33.0, text: "APA SIH", kind: "key", flicker: true }] },
];

/* ------------------------------------------------------------------ */
/* LIGHT LEAK (overlay dari public/Overlays-...)                      */
/* ------------------------------------------------------------------ */

/** at = detik di klip, offset = detik di file leak, dur = lama, opacity = kekuatan */
export const LEAKS = [
  // puncak kilatan (~0.27 dtk setelah mulai) jatuh tepat di potongan shot 15.95 dan 25.5
  { at: 15.68, offset: 1.05, dur: 0.65, opacity: 0.32 },
  { at: 25.2, offset: 2.1, dur: 0.65, opacity: 0.26 },
];

/* ------------------------------------------------------------------ */
/* SFX                                                                */
/* ------------------------------------------------------------------ */

// vol = volume dasar yang sudah dinormalisasi dari hasil pengukuran loudness tiap file,
// supaya puncaknya sekitar 12-17 dB di bawah puncak suara bicara (klik kecil paling pelan).
export const SFX_LIB = {
  whoosh: { file: "Sfx/Whoosh click.wav", dur: 0.88, vol: 0.2 },
  focus: { file: "Sfx/normalized/camera-focusing-boost.wav", dur: 1.2, vol: 1 },
  flash: { file: "Sfx/Camera flash sound effect.mp3", dur: 2.09, vol: 0.28 },
  oldFlash: { file: "Sfx/freesound_community-old-camera-flash-6800.mp3", dur: 3.82, vol: 0.2 },
  glitch: { file: "Sfx/Glitch click.wav", dur: 0.32, vol: 0.36 },
  digital: { file: "Sfx/Digital Text 03.mp3", dur: 1.28, vol: 1 },
  scan: { file: "Sfx/scan.mp3", dur: 1.28, vol: 1 },
  riser: { file: "Sfx/Click riser.wav", dur: 3.24, vol: 0.35 },
  tickA: { file: "Sfx/App Click 15.wav", dur: 0.7, vol: 0.45 },
  tickB: { file: "Sfx/Click.wav", dur: 0.44, vol: 0.55 },
  tickC: { file: "Sfx/Click-1.wav", dur: 1.04, vol: 0.45 },
  tickD: { file: "Sfx/ClicK fingerk.wav", dur: 0.44, vol: 0.55 },
  tickE: { file: "Sfx/Cut game click.wav", dur: 0.92, vol: 0.28 },
  tickF: { file: "Sfx/normalized/click-1-boost.wav", dur: 0.56, vol: 0.6 },
} as const;

export type SfxKey = keyof typeof SFX_LIB;
export type SfxCue = { at: number; k: SfxKey; rate?: number; gain?: number; fade?: number };

// Peran tiap suara: whoosh = gerak kamera, focus = blur ke fokus, flash = kilat,
// digital/scan = istilah kunci, glitch = kedip caption, riser = build-up, tick = kata penting.
// `fade` = lama suara terdengar (dtk) dengan fade-out, supaya semua cue pendek dan halus.
export const SFX_CUES: SfxCue[] = [
  { at: 0.98, k: "tickA", fade: 0.2 },
  { at: 1.42, k: "tickD", rate: 1.08, fade: 0.2 },
  { at: 2.3, k: "whoosh", fade: 0.5 },
  { at: 3.69, k: "tickB", rate: 1.05, fade: 0.2 },
  { at: 5.05, k: "tickE", fade: 0.25 },
  { at: 6.35, k: "tickC", rate: 0.95, fade: 0.25 },
  { at: 7.55, k: "whoosh", rate: 1.12, gain: 0.8, fade: 0.5 },
  { at: 9.58, k: "tickE", rate: 1.1, fade: 0.25 },
  { at: 10.22, k: "tickD", fade: 0.2 },
  { at: 11.8, k: "glitch", fade: 0.28 },
  { at: 12.15, k: "focus", fade: 0.5 },
  { at: 13.87, k: "tickD", rate: 1.08, fade: 0.2 },
  { at: 14.6, k: "whoosh", rate: 0.92, fade: 0.5 },
  { at: 14.76, k: "focus", rate: 1.1, gain: 0.8, fade: 0.45 },
  { at: 15.9, k: "flash", fade: 0.6 },
  { at: 15.99, k: "glitch", rate: 1.1, gain: 0.7, fade: 0.25 },
  { at: 16.4, k: "digital", rate: 1.12, fade: 0.4 },
  { at: 19.85, k: "tickF", fade: 0.25 },
  { at: 21.95, k: "whoosh", rate: 1.05, fade: 0.5 },
  { at: 22.1, k: "riser", gain: 0.8, fade: 0.9 },
  { at: 22.97, k: "scan", fade: 0.45 },
  { at: 24.15, k: "tickF", rate: 1.1, fade: 0.25 },
  { at: 25.45, k: "oldFlash", fade: 0.9 },
  { at: 26.02, k: "glitch", rate: 0.9, fade: 0.3 },
  { at: 27.28, k: "whoosh", rate: 0.85, gain: 0.8, fade: 0.5 },
  { at: 28.72, k: "tickA", rate: 1.1, fade: 0.2 },
  { at: 29.95, k: "tickC", fade: 0.25 },
  { at: 30.38, k: "tickB", rate: 0.9, fade: 0.2 },
  { at: 30.97, k: "tickF", rate: 1.05, fade: 0.25 },
  { at: 32.1, k: "glitch", rate: 0.9, fade: 0.28 },
  { at: 32.3, k: "tickE", rate: 0.9, fade: 0.25 },
  { at: 33.0, k: "glitch", rate: 1.1, gain: 0.8, fade: 0.25 },
];
