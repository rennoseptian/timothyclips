// Edit script untuk klip kFhF0ArcMQs-2.24-2.55 (dihasilkan oleh scripts/build-edit.py; edit di sana lalu jalankan ulang,
// atau edit langsung file ini untuk perubahan kecil). Waktu dalam detik dari awal klip. Tanpa import
// supaya bisa dibaca skrip lain.

export const FPS = 30;
/** klip final dimulai di detik ini pada video sumber */
export const START_SEC = 0.6;
export const START_FRAME = 18;
/** audio dimatikan di detik klip ini (sesudah kata terakhir) */
export const AUDIO_END_SEC = 30.4;
export const VIDEO_FRAMES = 912; // frame klip yang punya footage; sesudahnya frame terakhir ditahan
export const DURATION_FRAMES = 933;

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
  { from: 0.0, to: 2.2, s: [1.4, 1.48], px: 0.5, py: 0.42, blur: 0 },
  { from: 2.2, to: 4.5, s: [1.0, 1.05], px: 0.5, py: 0.44, blur: 10 },
  { from: 4.5, to: 6.7, s: [1.6, 1.7], px: 0.38, py: 0.42, blur: 12 },
  { from: 6.7, to: 8.8, s: [1.35, 1.45], px: 0.64, py: 0.42, blur: 12 },
  { from: 8.8, to: 11.0, s: [1.75, 1.9], px: 0.62, py: 0.4, blur: 12 },
  { from: 11.0, to: 13.2, s: [1.0, 1.05], px: 0.5, py: 0.44, blur: 10 },
  { from: 13.2, to: 15.0, s: [1.35, 1.45], px: 0.38, py: 0.42, blur: 12 },
  { from: 15.0, to: 17.2, s: [1.6, 1.7], px: 0.62, py: 0.42, blur: 12 },
  { from: 17.2, to: 19.3, s: [1.0, 1.05], px: 0.5, py: 0.44, blur: 10 },
  { from: 19.3, to: 20.7, s: [1.4, 1.5], px: 0.64, py: 0.42, blur: 12 },
  { from: 20.7, to: 23.0, s: [1.7, 1.85], px: 0.38, py: 0.4, blur: 12 },
  { from: 23.0, to: 25.0, s: [1.0, 1.05], px: 0.5, py: 0.44, blur: 10 },
  { from: 25.0, to: 27.1, s: [1.45, 1.55], px: 0.62, py: 0.42, blur: 12 },
  { from: 27.1, to: 28.95, s: [1.75, 1.85], px: 0.62, py: 0.4, blur: 14 },
  { from: 28.95, to: 31.099999999999998, s: [2.0, 2.15], px: 0.38, py: 0.4, blur: 14 },
];

export const CAPTIONS: Cap[] = [
  { at: 0.03, end: 2.13, behind: false, lines: [[{ t: "Jangan", k: "s", at: 0.03, w: 5.508 }, { t: "pernah", k: "s", at: 0.45, w: 5.525 }], [{ t: "BERGANTUNG", k: "l", at: 0.88, w: 7.466 }, { t: "sama", k: "s", at: 1.31, w: 3.863 }], [{ t: "ORANG", k: "m", at: 1.59, w: 3.972 }, { t: "LAIN", k: "m", at: 1.87, w: 2.587 }]] },
  { at: 2.01, end: 4.08, behind: false, lines: [[{ t: "Jangan", k: "s", at: 2.01, w: 5.508 }, { t: "pernah", k: "s", at: 2.64, w: 5.525 }], [{ t: "BERGANTUNG", k: "l", at: 2.92, w: 7.466 }, { t: "sama", k: "s", at: 3.31, w: 3.863 }], [{ t: "KELUARGA", k: "m", at: 3.57, w: 5.945 }]] },
  { at: 3.96, end: 5.29, behind: false, lines: [[{ t: "jangan", k: "s", at: 3.96, w: 5.508 }, { t: "pernah", k: "s", at: 4.22, w: 5.525 }], [{ t: "BERGANTUNG", k: "l", at: 4.48, w: 7.466 }, { t: "sama", k: "s", at: 4.89, w: 3.863 }]] },
  { at: 5.17, end: 6.29, behind: true, flicker: true, lines: [[{ t: "lu", k: "s", at: 5.17, w: 1.716 }, { t: "itu", k: "s", at: 5.31, w: 2.253 }], [{ t: "SENDIRI", k: "h", at: 5.75, w: 4.335 }]] },
  { at: 6.17, end: 7.67, behind: false, lines: [[{ t: "dan", k: "s", at: 6.17, w: 2.906 }, { t: "kalau", k: "s", at: 6.44, w: 4.538 }, { t: "tahu", k: "s", at: 6.72, w: 3.653 }], [{ t: "lu", k: "s", at: 7.0, w: 1.716 }, { t: "SENDIRI", k: "m", at: 7.14, w: 4.405 }]] },
  { at: 7.55, end: 9.13, behind: false, lines: [[{ t: "SATU-SATUNYA", k: "l", at: 7.55, w: 8.222 }], [{ t: "hal", k: "s", at: 8.38, w: 2.707 }, { t: "yang", k: "s", at: 8.52, w: 3.674 }, { t: "lu", k: "s", at: 8.66, w: 1.716 }, { t: "bisa", k: "s", at: 8.8, w: 3.226 }]] },
  { at: 9.01, end: 10.08, behind: true, lines: [[{ t: "KONTROL", k: "l", at: 9.01, w: 5.166 }, { t: "itu", k: "s", at: 9.22, w: 2.253 }, { t: "adalah", k: "s", at: 9.43, w: 5.625 }], [{ t: "OTAK", k: "h", at: 9.75, w: 2.988 }]] },
  { at: 9.96, end: 11.35, behind: false, lines: [[{ t: "lu", k: "s", at: 9.96, w: 1.716 }, { t: "KALIAN", k: "m", at: 10.06, w: 4.113 }], [{ t: "enggak", k: "s", at: 10.72, w: 5.546 }, { t: "bisa", k: "s", at: 10.98, w: 3.226 }]] },
  { at: 11.23, end: 12.74, behind: false, lines: [[{ t: "MILIH", k: "l", at: 11.23, w: 3.025 }, { t: "kok", k: "s", at: 11.49, w: 2.813 }, { t: "mau", k: "s", at: 11.62, w: 3.009 }], [{ t: "lahir", k: "s", at: 11.75, w: 4.132 }, { t: "di", k: "s", at: 12.19, w: 1.496 }, { t: "KELUARGA", k: "m", at: 12.32, w: 5.945 }]] },
  { at: 12.62, end: 13.45, behind: false, lines: [[{ t: "MISKIN", k: "l", at: 12.62, w: 3.82 }], [{ t: "atau", k: "s", at: 12.82, w: 3.605 }], [{ t: "KAYA", k: "l", at: 13.03, w: 2.902 }]] },
  { at: 13.33, end: 15.07, behind: false, lines: [[{ t: "KALIAN", k: "m", at: 13.33, w: 4.113 }, { t: "enggak", k: "s", at: 13.84, w: 5.546 }, { t: "bisa", k: "s", at: 14.04, w: 3.226 }], [{ t: "MILIH", k: "l", at: 14.3, w: 3.025 }, { t: "kok", k: "s", at: 14.56, w: 2.813 }, { t: "lahir", k: "s", at: 14.69, w: 4.132 }]] },
  { at: 14.95, end: 16.67, behind: false, lines: [[{ t: "di", k: "s", at: 14.95, w: 1.496 }, { t: "KEBETULAN", k: "m", at: 15.08, w: 6.544 }], [{ t: "keluarga", k: "s", at: 15.6, w: 7.225 }, { t: "yang", k: "s", at: 15.92, w: 3.674 }, { t: "banyak", k: "s", at: 16.02, w: 5.564 }], [{ t: "HUTANG", k: "l", at: 16.34, w: 4.511 }]] },
  { at: 16.55, end: 17.91, behind: false, lines: [[{ t: "KALIAN", k: "m", at: 16.55, w: 4.113 }, { t: "juga", k: "s", at: 16.76, w: 3.573 }], [{ t: "enggak", k: "s", at: 17.12, w: 5.546 }, { t: "bisa", k: "s", at: 17.34, w: 3.226 }, { t: "PILIH", k: "l", at: 17.57, w: 2.804 }]] },
  { at: 17.79, end: 19.62, behind: false, lines: [[{ t: "ibaratnya", k: "s", at: 17.79, w: 7.799 }], [{ t: "mau", k: "s", at: 18.35, w: 3.009 }, { t: "besok", k: "s", at: 18.46, w: 4.516 }, { t: "itu", k: "s", at: 18.68, w: 2.253 }], [{ t: "HUJAN", k: "l", at: 18.89, w: 3.707 }, { t: "atau", k: "s", at: 19.09, w: 3.605 }, { t: "enggak", k: "s", at: 19.3, w: 5.546 }]] },
  { at: 19.5, end: 20.93, behind: false, lines: [[{ t: "tapi", k: "s", at: 19.5, w: 3.148 }, { t: "yang", k: "s", at: 19.93, w: 3.674 }, { t: "bisa", k: "s", at: 20.03, w: 3.226 }], [{ t: "kita", k: "s", at: 20.24, w: 3.18 }, { t: "LAKUKAN", k: "l", at: 20.47, w: 5.242 }]] },
  { at: 20.81, end: 22.16, behind: true, lines: [[{ t: "adalah", k: "s", at: 20.81, w: 5.625 }, { t: "kita", k: "s", at: 21.15, w: 3.18 }], [{ t: "UPGRADE", k: "h", at: 21.47, w: 5.276 }], [{ t: "OTAK", k: "m", at: 21.81, w: 3.028 }]] },
  { at: 22.04, end: 23.22, behind: false, lines: [[{ t: "kita", k: "s", at: 22.04, w: 3.18 }, { t: "kita", k: "s", at: 22.34, w: 3.18 }, { t: "ASA", k: "m", at: 22.65, w: 2.269 }], [{ t: "SKILL", k: "l", at: 22.95, w: 2.956 }]] },
  { at: 23.1, end: 25.55, behind: false, lines: [[{ t: "kita", k: "s", at: 23.1, w: 3.18 }, { t: "kita", k: "s", at: 23.41, w: 3.18 }, { t: "upgrade", k: "s", at: 23.71, w: 6.466 }], [{ t: "KEMAMPUAN", k: "m", at: 24.44, w: 7.254 }], [{ t: "INTERNAL", k: "l", at: 24.94, w: 5.373 }]] },
  { at: 25.43, end: 27.48, behind: false, lines: [[{ t: "kita", k: "s", at: 25.43, w: 3.18 }, { t: "FOKUS", k: "m", at: 25.77, w: 3.683 }, { t: "di", k: "s", at: 26.55, w: 1.496 }], [{ t: "yang", k: "s", at: 26.71, w: 3.674 }, { t: "INTERNAL", k: "l", at: 26.88, w: 5.373 }]] },
  { at: 27.36, end: 29.11, behind: false, lines: [[{ t: "ya", k: "s", at: 27.36, w: 1.781 }, { t: "di", k: "s", at: 27.52, w: 1.496 }], [{ t: "MINDSET", k: "l", at: 27.85, w: 4.848 }], [{ t: "di", k: "s", at: 28.5, w: 1.496 }, { t: "OTAK", k: "m", at: 28.67, w: 3.028 }]] },
  { at: 28.99, end: 30.82, behind: true, lines: [[{ t: "yang", k: "s", at: 28.99, w: 3.674 }, { t: "kita", k: "s", at: 29.15, w: 3.18 }, { t: "bisa", k: "s", at: 29.96, w: 3.226 }], [{ t: "UBAH", k: "h", at: 30.16, w: 3.127 }]] },
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
  { at: 0.88, k: "tickA", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 1.59, k: "tickD", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 2.15, k: "whoosh", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 2.92, k: "tickB", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 3.57, k: "tickF", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 4.45, k: "focus", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 4.48, k: "tickC", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 5.75, k: "digital", rate: 1.1, gain: 0.7, fade: 0.4 },
  { at: 6.65, k: "whoosh", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 7.14, k: "tickA", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 7.55, k: "tickD", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 8.75, k: "focus", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 9.01, k: "tickB", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 9.75, k: "digital", rate: 1.0, gain: 0.7, fade: 0.4 },
  { at: 10.06, k: "tickC", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 10.95, k: "whoosh", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 11.23, k: "tickE", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 12.32, k: "tickA", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 13.03, k: "tickD", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 13.15, k: "focus", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 13.33, k: "tickB", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 14.3, k: "tickF", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 14.95, k: "whoosh", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 15.08, k: "tickC", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 16.34, k: "tickE", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 17.15, k: "focus", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 17.57, k: "tickA", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 18.89, k: "tickD", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 19.25, k: "whoosh", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 20.47, k: "tickB", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 20.65, k: "focus", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 21.47, k: "digital", rate: 1.0, gain: 0.7, fade: 0.4 },
  { at: 21.81, k: "tickC", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 22.65, k: "tickE", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 22.95, k: "tickA", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 22.95, k: "whoosh", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 24.44, k: "tickD", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 24.94, k: "tickB", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 24.95, k: "focus", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 25.77, k: "tickF", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 26.88, k: "tickC", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 27.05, k: "whoosh", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 27.85, k: "tickE", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 28.67, k: "tickA", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 28.9, k: "focus", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 28.9, k: "riser", rate: 1.0, gain: 0.8, fade: 0.9 },
  { at: 30.16, k: "digital", rate: 1.05, gain: 0.7, fade: 0.4 },
];
