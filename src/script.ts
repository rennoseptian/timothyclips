// Edit script untuk klip: semua keputusan kamera, caption, dan SFX ada di sini.
// Waktu dalam detik (dihitung dari awal klip). File ini sengaja berdiri sendiri
// (tanpa import) supaya bisa dibaca juga oleh scripts/check-captions.mjs.

export const FPS = 24;
// Klip dipotong di 33,33 dtk: tepat di jeda setelah "apa sih gitu" (jeda 33,06-33,57),
// sebelum "Dan itu" yang terpotong di SRT.
export const DURATION_FRAMES = 800;

/* ------------------------------------------------------------------ */
/* KAMERA                                                             */
/* ------------------------------------------------------------------ */

export type Shot = {
  from: number;
  to: number;
  /** skala awal -> akhir (1 = frame penuh, 1.5 = close-up) */
  s: [number, number];
  /** posisi wajah di layar output (0..1). px kecil = wajah di kiri, caption di kanan */
  px: number;
  py: number;
  /** tilt naik-turun: geser jendela kamera, sebagai pecahan tinggi jendela. + = ke bawah */
  dy: [number, number];
  /** kemiringan (derajat) awal -> akhir */
  rot: [number, number];
  /** sisi caption: R/L/B (kanan, kiri, bawah) */
  side: "R" | "L" | "B";
  /** blur saat shot masuk (px), dorongan skala, dan tilt masuk (pecahan tinggi jendela) */
  blur: number;
  kick: number;
  tiltIn: number;
};

export const SHOTS: Shot[] = [
  { from: 0.0, to: 2.36, s: [1.0, 1.12], px: 0.4, py: 0.44, dy: [0, 0], rot: [0, 0], side: "R", blur: 0, kick: 0, tiltIn: 0 },
  { from: 2.36, to: 5.08, s: [1.24, 1.34], px: 0.63, py: 0.4, dy: [-0.05, 0.05], rot: [0, -0.8], side: "L", blur: 14, kick: 0.07, tiltIn: 0.05 },
  { from: 5.08, to: 7.6, s: [1.04, 1.2], px: 0.39, py: 0.42, dy: [0.04, -0.02], rot: [0.6, 0], side: "R", blur: 10, kick: 0.05, tiltIn: -0.04 },
  { from: 7.6, to: 10.28, s: [1.42, 1.58], px: 0.38, py: 0.4, dy: [-0.03, 0.09], rot: [0, 0], side: "R", blur: 14, kick: 0.08, tiltIn: 0.05 },
  { from: 10.28, to: 12.25, s: [1.22, 1.42], px: 0.64, py: 0.42, dy: [0, 0], rot: [0, -1.4], side: "L", blur: 12, kick: 0.06, tiltIn: -0.05 },
  { from: 12.25, to: 14.67, s: [1.16, 1.3], px: 0.64, py: 0.42, dy: [0.03, -0.03], rot: [0, 1.0], side: "L", blur: 14, kick: 0.05, tiltIn: 0.04 },
  { from: 14.67, to: 17.2, s: [1.08, 1.36], px: 0.38, py: 0.42, dy: [0.05, -0.04], rot: [0, 0], side: "R", blur: 14, kick: 0.07, tiltIn: -0.05 },
  { from: 17.2, to: 19.9, s: [1.4, 1.12], px: 0.62, py: 0.42, dy: [-0.07, 0], rot: [1.2, 0], side: "L", blur: 10, kick: 0.05, tiltIn: 0.05 },
  { from: 19.9, to: 22.0, s: [1.1, 1.24], px: 0.4, py: 0.42, dy: [0, 0.05], rot: [0, 0], side: "R", blur: 10, kick: 0.05, tiltIn: -0.04 },
  { from: 22.0, to: 25.5, s: [1.3, 1.52], px: 0.64, py: 0.4, dy: [-0.04, 0.08], rot: [-0.6, 0.6], side: "L", blur: 14, kick: 0.07, tiltIn: 0.05 },
  { from: 25.5, to: 27.3, s: [1.52, 1.62], px: 0.5, py: 0.36, dy: [0, 0.02], rot: [1.8, 1.0], side: "B", blur: 18, kick: 0.1, tiltIn: -0.06 },
  { from: 27.3, to: 30.0, s: [1.34, 1.06], px: 0.4, py: 0.42, dy: [0.06, 0], rot: [0.8, 0], side: "R", blur: 12, kick: 0.04, tiltIn: 0.04 },
  { from: 30.0, to: 33.4, s: [1.12, 1.34], px: 0.63, py: 0.42, dy: [0, 0.07], rot: [0, 0], side: "L", blur: 12, kick: 0.06, tiltIn: -0.05 },
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
};
export type CapEvent = { side: "R" | "L" | "B"; end: number; lines: CapLine[] };

export const CAPTIONS: CapEvent[] = [
  { side: "R", end: 2.2, lines: [{ at: 0.12, text: "lu mau misalnya", kind: "soft" }, { at: 0.77, text: "NARSIS", kind: "key" }] },
  { side: "L", end: 4.7, lines: [{ at: 3.16, text: "mau bikin", kind: "soft" }, { at: 3.52, text: "KONTEN", kind: "key" }] },
  { side: "R", end: 7.45, lines: [{ at: 5.99, text: "itu kan", kind: "soft" }, { at: 6.29, text: "DI KEPALA", kind: "key" }] },
  { side: "R", end: 10.2, lines: [{ at: 9.58, text: "ENGGAK BERANI", kind: "key" }] },
  { side: "L", end: 12.2, lines: [{ at: 11.24, text: "gimana ya gua", kind: "soft" }, { at: 11.8, text: "MALU", kind: "huge", flicker: true }] },
  { side: "L", end: 14.6, lines: [{ at: 13.52, text: "orang tuh", kind: "soft" }, { at: 13.95, text: "ENGGAK", kind: "key" }, { at: 14.27, text: "PEDULI", kind: "key" }] },
  { side: "R", end: 17.1, lines: [{ at: 15.47, text: "SPOTLIGHT", kind: "huge", flicker: true }, { at: 16.07, text: "EFFECT", kind: "huge", flicker: true }] },
  { side: "L", end: 23.45, lines: [{ at: 22.29, text: "kalau lu bukan", kind: "soft" }, { at: 22.86, text: "DONALD TRUMP", kind: "key" }] },
  { side: "L", end: 25.4, lines: [{ at: 23.48, text: "belum jadi", kind: "soft" }, { at: 24.28, text: "PRESIDEN", kind: "key" }] },
  { side: "B", end: 27.2, lines: [{ at: 25.52, text: "YOU'RE", kind: "huge" }, { at: 26.01, text: "NOBODY", kind: "huge", flicker: true }] },
  { side: "R", end: 29.6, lines: [{ at: 28.25, text: "ada", kind: "soft" }, { at: 28.44, text: "DUA ORANG", kind: "key" }] },
  { side: "L", end: 31.4, lines: [{ at: 30.04, text: "di", kind: "soft" }, { at: 30.22, text: "KOLOM KOMEN", kind: "key" }] },
  { side: "L", end: 33.3, lines: [{ at: 32.08, text: "SAKIT", kind: "huge", flicker: true }, { at: 32.36, text: "HATI", kind: "huge", flicker: true }] },
];

/* ------------------------------------------------------------------ */
/* LIGHT LEAK (overlay dari public/Overlays-...)                      */
/* ------------------------------------------------------------------ */

/** at = detik di klip, offset = detik di file leak, dur = lama, opacity = kekuatan */
export const LEAKS = [
  { at: 15.42, offset: 7.0, dur: 0.75, opacity: 0.38 },
  { at: 25.48, offset: 0.0, dur: 0.7, opacity: 0.3 },
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
export const SFX_CUES: SfxCue[] = [
  { at: 0.77, k: "tickA" },
  { at: 2.3, k: "whoosh" },
  { at: 3.52, k: "tickB", rate: 1.05 },
  { at: 5.05, k: "tickE" },
  { at: 6.29, k: "tickC", rate: 0.95 },
  { at: 7.55, k: "whoosh", rate: 1.12, gain: 0.8 },
  { at: 9.58, k: "tickE", rate: 1.1 },
  { at: 10.22, k: "tickD" },
  { at: 11.8, k: "glitch" },
  { at: 12.15, k: "focus" },
  { at: 13.95, k: "tickD", rate: 1.08 },
  { at: 14.6, k: "whoosh", rate: 0.92 },
  { at: 15.47, k: "flash" },
  { at: 16.07, k: "digital", rate: 1.12 },
  { at: 19.85, k: "tickF" },
  { at: 21.95, k: "whoosh", rate: 1.05 },
  { at: 22.4, k: "riser" },
  { at: 22.86, k: "scan" },
  { at: 24.28, k: "tickF", rate: 1.1 },
  { at: 25.52, k: "oldFlash", fade: 1.2 },
  { at: 26.01, k: "glitch", rate: 0.9 },
  { at: 27.28, k: "whoosh", rate: 0.85, gain: 0.8 },
  { at: 28.44, k: "tickA", rate: 1.1 },
  { at: 29.98, k: "tickC" },
  { at: 30.22, k: "tickB", rate: 0.9 },
  { at: 32.08, k: "glitch", rate: 0.9 },
  { at: 32.36, k: "tickE", rate: 0.9 },
];
