// Edit script untuk klip p1t-074cn38 (dihasilkan oleh scripts/build-edit.py; edit di sana lalu jalankan ulang,
// atau edit langsung file ini untuk perubahan kecil). Waktu dalam detik dari awal klip. Tanpa import
// supaya bisa dibaca skrip lain.

export const FPS = 24;
/** klip final dimulai di detik ini pada video sumber ("Ini salah satu quotes...") */
export const START_SEC = 2.0;
export const START_FRAME = 48;
/** sampai 42.58 dtk video sumber (setelah "...enggak akan pernah siap."): 974 frame */
export const DURATION_FRAMES = 974;

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
  { from: 0.0, to: 2.11, s: [1.0, 1.05], px: 0.5, py: 0.44, blur: 0 },
  { from: 2.11, to: 4.04, s: [1.35, 1.45], px: 0.36, py: 0.42, blur: 12 },
  { from: 4.04, to: 6.8, s: [1.7, 1.85], px: 0.38, py: 0.42, blur: 12 },
  { from: 6.8, to: 8.07, s: [1.0, 1.04], px: 0.5, py: 0.44, blur: 10 },
  { from: 8.07, to: 10.03, s: [1.4, 1.5], px: 0.64, py: 0.42, blur: 12 },
  { from: 10.03, to: 12.21, s: [1.55, 1.65], px: 0.36, py: 0.42, blur: 10 },
  { from: 12.21, to: 14.56, s: [1.8, 1.95], px: 0.62, py: 0.4, blur: 12 },
  { from: 14.56, to: 16.74, s: [1.0, 1.06], px: 0.5, py: 0.44, blur: 10 },
  { from: 16.74, to: 19.08, s: [1.75, 1.9], px: 0.38, py: 0.42, blur: 12 },
  { from: 19.08, to: 20.49, s: [1.0, 1.04], px: 0.5, py: 0.44, blur: 10 },
  { from: 20.49, to: 22.34, s: [1.6, 1.7], px: 0.62, py: 0.42, blur: 12 },
  { from: 22.34, to: 25.6, s: [1.35, 1.45], px: 0.64, py: 0.42, blur: 10 },
  { from: 25.6, to: 27.34, s: [1.7, 1.8], px: 0.38, py: 0.42, blur: 14 },
  { from: 27.34, to: 29.61, s: [2.0, 2.1], px: 0.62, py: 0.4, blur: 14 },
  { from: 29.61, to: 31.01, s: [1.0, 1.04], px: 0.5, py: 0.44, blur: 10 },
  { from: 31.01, to: 33.0, s: [1.4, 1.5], px: 0.62, py: 0.42, blur: 12 },
  { from: 33.0, to: 35.25, s: [1.55, 1.65], px: 0.38, py: 0.42, blur: 12 },
  { from: 35.25, to: 37.38, s: [1.0, 1.05], px: 0.5, py: 0.44, blur: 10 },
  { from: 37.38, to: 39.62, s: [1.4, 1.5], px: 0.62, py: 0.42, blur: 12 },
  { from: 39.62, to: 40.58, s: [2.0, 2.05], px: 0.4, py: 0.4, blur: 14 },
];

export const CAPTIONS: Cap[] = [
  { at: 0.05, end: 1.03, behind: false, lines: [[{ t: "Ini", k: "s", at: 0.05, w: 1.984 }, { t: "salah", k: "s", at: 0.22, w: 4.5 }, { t: "satu", k: "s", at: 0.39, w: 3.491 }], [{ t: "QUOTES", k: "m", at: 0.57, w: 4.454 }]] },
  { at: 0.91, end: 1.59, behind: false, lines: [[{ t: "yang", k: "s", at: 0.91, w: 3.674 }, { t: "gua", k: "s", at: 0.99, w: 2.824 }, { t: "LUPA", k: "m", at: 1.08, w: 2.9 }, { t: "ya", k: "s", at: 1.34, w: 1.781 }]] },
  { at: 1.47, end: 2.23, behind: false, lines: [[{ t: "siapa", k: "s", at: 1.47, w: 4.117 }, { t: "yang", k: "s", at: 1.73, w: 3.674 }], [{ t: "BIKIN", k: "l", at: 1.85, w: 2.992 }]] },
  { at: 2.11, end: 4.16, behind: false, lines: [[{ t: "Cuman", k: "s", at: 2.11, w: 4.875 }, { t: "ini", k: "s", at: 2.37, w: 1.984 }], [{ t: "MENGUBAH", k: "l", at: 3.16, w: 6.287 }], [{ t: "HIDUP", k: "l", at: 3.6, w: 3.457 }, { t: "GUA", k: "l", at: 3.89, w: 2.314 }]] },
  { at: 4.04, end: 5.52, behind: true, lines: [[{ t: "I'm", k: "s", at: 4.04, w: 2.038 }, { t: "the", k: "s", at: 4.46, w: 2.611 }], [{ t: "CAPTAIN", k: "h", at: 4.61, w: 4.75 }], [{ t: "OF", k: "l", at: 4.9, w: 1.472 }, { t: "MY", k: "l", at: 5.16, w: 1.639 }, { t: "SOUL", k: "l", at: 5.34, w: 2.866 }]] },
  { at: 5.52, end: 6.92, behind: true, lines: [[{ t: "and", k: "s", at: 5.52, w: 2.916 }, { t: "the", k: "s", at: 5.71, w: 2.611 }], [{ t: "MASTER", k: "h", at: 5.89, w: 4.419 }], [{ t: "OF", k: "l", at: 6.25, w: 1.472 }, { t: "MY", k: "l", at: 6.44, w: 1.639 }, { t: "FAITH", k: "l", at: 6.62, w: 3.183 }]] },
  { at: 6.8, end: 8.19, behind: false, lines: [[{ t: "Artinya", k: "s", at: 6.8, w: 5.925 }], [{ t: "APA", k: "l", at: 7.27, w: 2.806 }]] },
  { at: 8.07, end: 9.24, behind: false, lines: [[{ t: "Gua", k: "s", at: 8.07, w: 2.824 }, { t: "adalah", k: "s", at: 8.19, w: 5.625 }], [{ t: "KAPTEN", k: "m", at: 8.54, w: 4.375 }, { t: "dari", k: "s", at: 8.89, w: 3.357 }]] },
  { at: 9.12, end: 10.15, behind: false, lines: [[{ t: "JIWA", k: "m", at: 9.12, w: 2.881 }, { t: "gua", k: "s", at: 9.36, w: 2.824 }, { t: "sendiri,", k: "s", at: 9.53, w: 5.989 }]] },
  { at: 10.03, end: 12.33, behind: false, lines: [[{ t: "ya", k: "s", at: 10.03, w: 1.781 }, { t: "dan", k: "s", at: 10.32, w: 2.906 }, { t: "MASTER", k: "m", at: 10.49, w: 4.783 }, { t: "ya.", k: "s", at: 10.82, w: 2.275 }]] },
  { at: 12.21, end: 14.68, behind: true, lines: [[{ t: "Master", k: "s", at: 12.21, w: 5.439 }, { t: "dari", k: "s", at: 12.51, w: 3.357 }], [{ t: "TAKDIR", k: "h", at: 12.8, w: 4.051 }], [{ t: "gua", k: "s", at: 13.24, w: 2.824 }, { t: "sendiri.", k: "s", at: 13.39, w: 5.989 }]] },
  { at: 14.56, end: 15.38, behind: false, lines: [[{ t: "HANYA", k: "l", at: 14.56, w: 3.82 }, { t: "GUA", k: "l", at: 14.86, w: 2.314 }], [{ t: "yang", k: "s", at: 14.96, w: 3.674 }, { t: "bisa", k: "s", at: 15.06, w: 3.226 }]] },
  { at: 15.26, end: 16.11, behind: false, lines: [[{ t: "tentuin", k: "s", at: 15.26, w: 5.828 }], [{ t: "TAKDIR", k: "m", at: 15.46, w: 4.111 }, { t: "gua", k: "s", at: 15.66, w: 2.824 }, { t: "sendiri.", k: "s", at: 15.76, w: 5.989 }]] },
  { at: 15.99, end: 16.86, behind: false, lines: [[{ t: "Ini", k: "s", at: 15.99, w: 1.984 }, { t: "kayak", k: "s", at: 16.14, w: 4.507 }, { t: "kayak", k: "s", at: 16.36, w: 4.507 }], [{ t: "KITA", k: "m", at: 16.59, w: 2.54 }]] },
  { at: 16.74, end: 18.43, behind: true, lines: [[{ t: "hidup", k: "s", at: 16.74, w: 4.307 }, { t: "ini", k: "s", at: 16.89, w: 1.984 }], [{ t: "DI", k: "h", at: 17.04, w: 1.156 }, { t: "KAPAL", k: "h", at: 17.18, w: 3.607 }], [{ t: "gitu", k: "s", at: 17.46, w: 3.182 }, { t: "loh.", k: "s", at: 17.74, w: 3.203 }]] },
  { at: 18.43, end: 19.2, behind: true, lines: [[{ t: "KITA", k: "h", at: 18.43, w: 2.5 }, { t: "YANG", k: "h", at: 18.65, w: 2.994 }, { t: "SETIR", k: "h", at: 18.76, w: 3.323 }]] },
  { at: 19.08, end: 20.61, behind: false, lines: [[{ t: "kita", k: "s", at: 19.08, w: 3.18 }, { t: "NAHKODANYA", k: "l", at: 19.3, w: 7.764 }]] },
  { at: 20.49, end: 21.45, behind: false, lines: [[{ t: "Memang", k: "s", at: 20.49, w: 5.92 }, { t: "kadang", k: "s", at: 20.7, w: 5.691 }], [{ t: "bisa", k: "s", at: 20.91, w: 3.226 }, { t: "ada", k: "s", at: 21.12, w: 2.908 }]] },
  { at: 21.33, end: 22.46, behind: true, lines: [[{ t: "BADAI", k: "h", at: 21.33, w: 3.795 }], [{ t: "tapi", k: "s", at: 21.54, w: 3.148 }, { t: "ini", k: "s", at: 21.75, w: 1.984 }, { t: "kita", k: "s", at: 21.96, w: 3.18 }, { t: "yang", k: "s", at: 22.21, w: 3.674 }]] },
  { at: 22.34, end: 23.73, behind: false, lines: [[{ t: "DECIDE", k: "m", at: 22.34, w: 4.085 }, { t: "kita", k: "s", at: 22.71, w: 3.18 }, { t: "mau", k: "s", at: 23.11, w: 3.009 }, { t: "ke", k: "s", at: 23.24, w: 1.758 }, { t: "mana.", k: "s", at: 23.36, w: 4.504 }]] },
  { at: 23.61, end: 24.99, behind: false, lines: [[{ t: "Lu", k: "s", at: 23.61, w: 1.716 }, { t: "bisa", k: "s", at: 24.14, w: 3.226 }, { t: "PILIH", k: "m", at: 24.38, w: 2.854 }, { t: "gitu,", k: "s", at: 24.63, w: 3.641 }]] },
  { at: 24.87, end: 25.72, behind: false, lines: [[{ t: "besok", k: "s", at: 24.87, w: 4.516 }, { t: "lu", k: "s", at: 25.11, w: 1.716 }, { t: "mau", k: "s", at: 25.23, w: 3.009 }], [{ t: "BANGUN", k: "l", at: 25.36, w: 4.68 }]] },
  { at: 25.6, end: 26.65, behind: true, flicker: true, lines: [[{ t: "mau", k: "s", at: 25.6, w: 3.009 }, { t: "jadi", k: "s", at: 25.72, w: 3.181 }, { t: "orang", k: "s", at: 25.99, w: 4.772 }], [{ t: "SEDIH", k: "h", at: 26.26, w: 3.554 }]] },
  { at: 26.53, end: 27.46, behind: false, lines: [[{ t: "mau", k: "s", at: 26.53, w: 3.009 }, { t: "jadi", k: "s", at: 26.67, w: 3.181 }], [{ t: "BAHAGIA", k: "l", at: 26.94, w: 5.358 }]] },
  { at: 27.34, end: 28.51, behind: true, flicker: true, lines: [[{ t: "mau", k: "s", at: 27.34, w: 3.009 }, { t: "jadi", k: "s", at: 27.65, w: 3.181 }, { t: "orang", k: "s", at: 27.86, w: 4.772 }], [{ t: "DEPRESI", k: "h", at: 28.07, w: 4.881 }]] },
  { at: 28.39, end: 29.73, behind: false, lines: [[{ t: "mau", k: "s", at: 28.39, w: 3.009 }, { t: "jadi", k: "s", at: 28.49, w: 3.181 }, { t: "orang", k: "s", at: 29.19, w: 4.772 }], [{ t: "SUKSES", k: "l", at: 29.4, w: 4.432 }]] },
  { at: 29.61, end: 30.58, behind: false, lines: [[{ t: "itu", k: "s", at: 29.61, w: 2.253 }, { t: "semua", k: "s", at: 29.82, w: 4.659 }, { t: "CUMAN", k: "m", at: 30.03, w: 4.075 }, { t: "ada", k: "s", at: 30.25, w: 2.908 }]] },
  { at: 30.46, end: 31.13, behind: false, lines: [[{ t: "di", k: "s", at: 30.46, w: 1.496 }, { t: "PIKIRAN", k: "l", at: 30.56, w: 4.483 }, { t: "LU", k: "l", at: 30.88, w: 1.665 }]] },
  { at: 31.01, end: 33.12, behind: false, lines: [[{ t: "Lu", k: "s", at: 31.01, w: 1.716 }, { t: "sendiri", k: "s", at: 31.13, w: 5.525 }, { t: "yang", k: "s", at: 31.65, w: 3.674 }, { t: "bisa", k: "s", at: 31.78, w: 3.226 }], [{ t: "BIKIN", k: "l", at: 32.03, w: 2.992 }, { t: "ITU", k: "l", at: 32.29, w: 2.032 }]] },
  { at: 33.0, end: 34.39, behind: false, lines: [[{ t: "Saran", k: "s", at: 33.0, w: 4.618 }, { t: "gua", k: "s", at: 33.3, w: 2.824 }], [{ t: "JANGAN", k: "m", at: 33.45, w: 4.548 }, { t: "PERNAH", k: "m", at: 33.75, w: 4.565 }]] },
  { at: 34.27, end: 35.5, behind: false, lines: [[{ t: "NUNGGU", k: "l", at: 34.27, w: 4.654 }, { t: "untuk", k: "s", at: 34.57, w: 4.576 }, { t: "lu", k: "s", at: 34.87, w: 1.716 }, { t: "siap,", k: "s", at: 35.12, w: 3.635 }, { t: "ya,", k: "s", at: 35.25, w: 2.275 }]] },
  { at: 35.38, end: 36.96, behind: false, lines: [[{ t: "untuk", k: "s", at: 35.38, w: 4.576 }, { t: "melakukan", k: "s", at: 36.07, w: 8.379 }, { t: "hal-hal", k: "s", at: 36.58, w: 5.974 }]] },
  { at: 36.84, end: 37.5, behind: false, lines: [[{ t: "APAPUN", k: "m", at: 36.84, w: 4.925 }, { t: "ya.", k: "s", at: 37.25, w: 2.275 }]] },
  { at: 37.38, end: 39.13, behind: false, lines: [[{ t: "Jangan", k: "s", at: 37.38, w: 5.508 }, { t: "pernah", k: "s", at: 38.47, w: 5.525 }], [{ t: "NUNGGU", k: "l", at: 38.74, w: 4.654 }]] },
  { at: 39.01, end: 39.74, behind: false, lines: [[{ t: "sampai", k: "s", at: 39.01, w: 5.231 }, { t: "lu", k: "s", at: 39.28, w: 1.716 }, { t: "siap", k: "s", at: 39.35, w: 3.196 }, { t: "karena", k: "s", at: 39.42, w: 5.524 }]] },
  { at: 39.62, end: 40.32, behind: false, lines: [[{ t: "lu", k: "s", at: 39.62, w: 1.716 }, { t: "enggak", k: "s", at: 39.69, w: 5.546 }, { t: "akan", k: "s", at: 39.93, w: 3.786 }, { t: "pernah", k: "s", at: 40.06, w: 5.525 }]] },
  { at: 40.2, end: 40.58, behind: true, flicker: true, lines: [[{ t: "SIAP", k: "h", at: 40.2, w: 2.785 }]] },
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
  { at: 0.57, k: "tickA", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 1.08, k: "tickD", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 1.85, k: "tickB", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 2.06, k: "whoosh", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 3.16, k: "tickF", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 3.6, k: "tickC", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 3.99, k: "focus", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 4.61, k: "digital", rate: 1.1, gain: 0.7, fade: 0.4 },
  { at: 5.16, k: "tickA", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 5.89, k: "digital", rate: 1.05, gain: 0.7, fade: 0.4 },
  { at: 6.25, k: "tickB", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 6.62, k: "tickF", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 6.75, k: "whoosh", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 7.27, k: "tickC", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 8.02, k: "focus", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 8.54, k: "tickE", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 9.12, k: "tickA", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 9.98, k: "whoosh", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 10.49, k: "tickD", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 12.16, k: "focus", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 12.8, k: "glitch", rate: 1.1, gain: 0.7, fade: 0.3 },
  { at: 14.51, k: "whoosh", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 14.56, k: "tickF", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 15.46, k: "tickC", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 16.59, k: "tickE", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 16.69, k: "focus", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 17.04, k: "glitch", rate: 1.0, gain: 0.7, fade: 0.3 },
  { at: 18.43, k: "digital", rate: 1.05, gain: 0.7, fade: 0.4 },
  { at: 18.76, k: "glitch", rate: 1.1, gain: 0.7, fade: 0.3 },
  { at: 19.03, k: "whoosh", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 19.3, k: "tickF", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 20.44, k: "focus", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 21.33, k: "glitch", rate: 1.05, gain: 0.7, fade: 0.3 },
  { at: 22.29, k: "whoosh", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 22.34, k: "tickE", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 24.38, k: "tickA", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 25.36, k: "tickD", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 25.55, k: "focus", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 26.26, k: "glitch", rate: 1.1, gain: 0.7, fade: 0.3 },
  { at: 26.94, k: "tickF", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 27.29, k: "whoosh", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 28.07, k: "glitch", rate: 1.05, gain: 0.7, fade: 0.3 },
  { at: 29.4, k: "tickE", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 29.56, k: "focus", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 30.03, k: "tickA", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 30.56, k: "tickD", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 30.88, k: "tickB", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 30.96, k: "whoosh", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 32.03, k: "tickF", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 32.95, k: "focus", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 33.45, k: "tickC", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 34.27, k: "tickE", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 35.2, k: "whoosh", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 36.84, k: "tickA", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 37.33, k: "focus", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 38.74, k: "tickD", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 39.3, k: "riser", rate: 1.0, gain: 0.8, fade: 0.9 },
  { at: 39.57, k: "whoosh", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 40.2, k: "glitch", rate: 1.1, gain: 0.7, fade: 0.3 },
];
