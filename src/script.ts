// Edit script untuk klip MmU4rSTmI5I-4.07-4.26 (dihasilkan oleh scripts/build-edit.py; edit di sana lalu jalankan ulang,
// atau edit langsung file ini untuk perubahan kecil). Waktu dalam detik dari awal klip. Tanpa import
// supaya bisa dibaca skrip lain.

export const FPS = 24;
/** klip final dimulai di detik ini pada video sumber (seluruh video) */
export const START_SEC = 0;
export const START_FRAME = 0;
/** 19 dtk penuh: 456 frame */
export const DURATION_FRAMES = 456;

export type Shot = {
  from: number;
  to: number;
  /** zoom awal -> akhir (zoom-in pelan). 1 = frame penuh */
  s: [number, number];
  /** posisi wajah di layar 16:9 (0..1); di 9:16 wajah selalu di tengah-atas */
  px: number;
  py: number;
  /** blur sesaat saat shot masuk (px) */
  blur: number;
};

/** kata: s = label kecil, m = kata penting, l = kata kunci besar, h = hero merah di belakang subjek.
 *  at = detik kata diucapkan, w = lebar dalam em (Montserrat Black, termasuk letter-spacing) */
export type Word = { t: string; k: "s" | "m" | "l" | "h"; at: number; w: number };
export type Cap = { at: number; end: number; behind: boolean; flicker?: boolean; lines: Word[][] };

export const SHOTS: Shot[] = [
  { from: 0.0, to: 1.08, s: [1.4, 1.48], px: 0.62, py: 0.42, blur: 0 },
  { from: 1.08, to: 3.72, s: [1.0, 1.05], px: 0.5, py: 0.44, blur: 10 },
  { from: 3.72, to: 5.61, s: [1.6, 1.7], px: 0.38, py: 0.42, blur: 12 },
  { from: 5.61, to: 7.55, s: [1.35, 1.45], px: 0.64, py: 0.42, blur: 12 },
  { from: 7.55, to: 9.32, s: [1.75, 1.9], px: 0.62, py: 0.4, blur: 12 },
  { from: 9.32, to: 12.06, s: [1.0, 1.05], px: 0.5, py: 0.44, blur: 10 },
  { from: 12.06, to: 14.16, s: [1.75, 1.9], px: 0.38, py: 0.4, blur: 12 },
  { from: 14.16, to: 15.6, s: [1.0, 1.04], px: 0.5, py: 0.44, blur: 10 },
  { from: 15.6, to: 17.68, s: [1.7, 1.85], px: 0.62, py: 0.42, blur: 12 },
  { from: 17.68, to: 19.0, s: [2.0, 2.1], px: 0.38, py: 0.4, blur: 14 },
];

export const CAPTIONS: Cap[] = [
  { at: 0.12, end: 1.2, behind: true, flicker: true, lines: [[{ t: "Gua", k: "s", at: 0.12, w: 2.824 }, { t: "enggak", k: "s", at: 0.24, w: 5.546 }, { t: "pernah", k: "s", at: 0.49, w: 5.525 }], [{ t: "TAKUT", k: "h", at: 0.73, w: 3.553 }]] },
  { at: 1.08, end: 2.61, behind: false, lines: [[{ t: "ibaratnya", k: "s", at: 1.08, w: 7.799 }, { t: "sama", k: "s", at: 1.88, w: 3.863 }], [{ t: "ORANG", k: "m", at: 2.12, w: 3.972 }, { t: "yang", k: "s", at: 2.37, w: 3.674 }]] },
  { at: 2.49, end: 3.84, behind: false, lines: [[{ t: "seumur", k: "s", at: 2.49, w: 5.557 }, { t: "hidupnya", k: "s", at: 2.73, w: 7.037 }], [{ t: "HIDUPNYA", k: "m", at: 3.23, w: 5.757 }]] },
  { at: 3.72, end: 4.4, behind: false, lines: [[{ t: "selalu", k: "s", at: 3.72, w: 5.119 }], [{ t: "GAMPANG", k: "l", at: 4.05, w: 5.84 }]] },
  { at: 4.28, end: 5.73, behind: false, lines: [[{ t: "Ya,", k: "s", at: 4.28, w: 2.275 }, { t: "dari", k: "s", at: 4.38, w: 3.357 }, { t: "kecil", k: "s", at: 4.99, w: 3.942 }], [{ t: "dia", k: "s", at: 5.21, w: 2.462 }, { t: "GAMPANG", k: "m", at: 5.32, w: 5.92 }]] },
  { at: 5.61, end: 7.67, behind: false, lines: [[{ t: "dia", k: "s", at: 5.61, w: 2.462 }, { t: "besar", k: "s", at: 5.76, w: 4.454 }, { t: "hidupnya", k: "s", at: 6.05, w: 7.037 }, { t: "itu", k: "s", at: 6.64, w: 2.253 }], [{ t: "GAMPANG", k: "l", at: 6.94, w: 5.84 }]] },
  { at: 7.55, end: 9.44, behind: true, lines: [[{ t: "Orang", k: "s", at: 7.55, w: 4.772 }, { t: "seperti", k: "s", at: 7.72, w: 5.595 }, { t: "itu", k: "s", at: 7.97, w: 2.253 }, { t: "enggak", k: "s", at: 8.14, w: 5.546 }], [{ t: "NGERI", k: "h", at: 8.31, w: 3.585 }]] },
  { at: 9.32, end: 10.71, behind: false, lines: [[{ t: "Orang", k: "s", at: 9.32, w: 4.772 }, { t: "NGERI", k: "l", at: 9.6, w: 3.291 }], [{ t: "adalah", k: "s", at: 9.88, w: 5.625 }, { t: "orang", k: "s", at: 10.31, w: 4.772 }]] },
  { at: 10.59, end: 12.18, behind: false, lines: [[{ t: "yang", k: "s", at: 10.59, w: 3.674 }, { t: "HIDUPNYA", k: "m", at: 10.73, w: 5.757 }], [{ t: "ini", k: "s", at: 11.52, w: 1.984 }, { t: "sudah", k: "s", at: 11.79, w: 4.667 }]] },
  { at: 12.06, end: 13.12, behind: false, lines: [[{ t: "mau", k: "s", at: 12.06, w: 3.009 }], [{ t: "DIHANCURIN", k: "l", at: 12.19, w: 6.9 }], [{ t: "sama", k: "s", at: 12.73, w: 3.863 }]] },
  { at: 13.0, end: 14.28, behind: false, lines: [[{ t: "berbagai", k: "s", at: 13.0, w: 6.965 }, { t: "macam", k: "s", at: 13.4, w: 5.037 }], [{ t: "CARA", k: "l", at: 13.7, w: 3.044 }, { t: "di", k: "s", at: 14.01, w: 1.496 }]] },
  { at: 14.16, end: 15.72, behind: false, lines: [[{ t: "dunia", k: "s", at: 14.16, w: 4.37 }, { t: "lalu", k: "s", at: 14.46, w: 3.469 }], [{ t: "dia", k: "s", at: 15.14, w: 2.462 }, { t: "TETAP", k: "l", at: 15.3, w: 3.445 }]] },
  { at: 15.6, end: 16.14, behind: true, lines: [[{ t: "BERDIRI", k: "h", at: 15.6, w: 4.686 }]] },
  { at: 16.02, end: 16.85, behind: false, lines: [[{ t: "dia", k: "s", at: 16.02, w: 2.462 }, { t: "tetap", k: "s", at: 16.17, w: 4.295 }], [{ t: "JALAN", k: "l", at: 16.45, w: 3.846 }]] },
  { at: 16.73, end: 17.97, behind: false, lines: [[{ t: "Nah,", k: "s", at: 16.73, w: 3.358 }, { t: "itu", k: "s", at: 16.88, w: 2.253 }, { t: "orangnya", k: "s", at: 17.16, w: 7.512 }, { t: "yang", k: "s", at: 17.5, w: 3.674 }, { t: "gua", k: "s", at: 17.59, w: 2.824 }], [{ t: "TAKUT", k: "l", at: 17.68, w: 3.812 }]] },
  { at: 17.85, end: 19.0, behind: true, lines: [[{ t: "itu", k: "s", at: 17.85, w: 2.253 }, { t: "orang", k: "s", at: 18.02, w: 4.772 }, { t: "yang", k: "s", at: 18.19, w: 3.674 }], [{ t: "NGERI", k: "h", at: 18.28, w: 3.585 }]] },
];

// vol = volume dasar hasil normalisasi loudness tiap file (jangan dinaikkan sembarangan).
export const SFX_LIB = {
  whoosh: { file: "Sfx/Whoosh click.wav", dur: 0.88, vol: 0.2 },
  focus: { file: "Sfx/normalized/camera-focusing-boost.wav", dur: 1.2, vol: 1 },
  glitch: { file: "Sfx/Glitch click.wav", dur: 0.32, vol: 0.36 },
  digital: { file: "Sfx/Digital Text 03.mp3", dur: 1.28, vol: 1 },
  riser: { file: "Sfx/Click riser.wav", dur: 3.24, vol: 0.35 },
  tickA: { file: "Sfx/App Click 15.wav", dur: 0.7, vol: 0.45 },
  tickB: { file: "Sfx/Click.wav", dur: 0.44, vol: 0.55 },
  tickC: { file: "Sfx/Click-1.wav", dur: 1.04, vol: 0.45 },
  tickD: { file: "Sfx/ClicK fingerk.wav", dur: 0.44, vol: 0.55 },
  tickE: { file: "Sfx/Cut game click.wav", dur: 0.92, vol: 0.28 },
  tickF: { file: "Sfx/normalized/click-1-boost.wav", dur: 0.56, vol: 0.6 },
} as const;

export type SfxKey = keyof typeof SFX_LIB;
/** fade = lama suara terdengar (dtk) dengan fade-out: kata = tick pendek, potongan shot = lebih panjang */
export type SfxCue = { at: number; k: SfxKey; rate?: number; gain?: number; fade?: number };

export const SFX_CUES: SfxCue[] = [
  { at: 0.73, k: "glitch", rate: 1.0, gain: 0.7, fade: 0.3 },
  { at: 1.03, k: "whoosh", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 2.12, k: "tickD", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 3.23, k: "tickB", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 3.67, k: "focus", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 4.05, k: "tickF", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 5.32, k: "tickC", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 5.56, k: "whoosh", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 6.94, k: "tickE", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 7.5, k: "focus", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 8.31, k: "glitch", rate: 1.0, gain: 0.7, fade: 0.3 },
  { at: 9.27, k: "whoosh", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 9.6, k: "tickD", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 10.73, k: "tickB", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 12.01, k: "focus", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 12.19, k: "tickF", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 13.7, k: "tickC", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 14.11, k: "whoosh", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 15.3, k: "tickE", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 15.55, k: "focus", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 16.45, k: "tickA", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 17.5, k: "riser", rate: 1.0, gain: 0.8, fade: 0.9 },
  { at: 17.63, k: "whoosh", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 17.68, k: "tickD", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 18.28, k: "glitch", rate: 1.1, gain: 0.7, fade: 0.3 },
];
