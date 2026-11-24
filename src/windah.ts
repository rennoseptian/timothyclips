// Dihasilkan oleh scripts/build-windah.py (edit di sana lalu jalankan ulang). Klip Windah Basudara, kamera diam.
export const W_FPS = 30;
export const W_DURATION_FRAMES = 1929;
export type WZone = "R" | "TR" | "T" | "TT" | "L" | "R2";
/** s = label kecil (Montserrat Black), m = sedang (Montserrat Black), l = besar (Coolvetica Hv Comp), h = hero merah (Coolvetica Hv Comp) */
export type WWord = { t: string; k: "s" | "m" | "l" | "h"; at: number; w: number };
export type WCap = { at: number; end: number; zone: WZone; light: boolean; lines: WWord[][] };
export const LIGHT_SCENES: [number, number][] = [[0.0, 2.35], [5.72, 11.55], [29.88, 39.62], [45.85, 51.68], [58.23, 64.3]];

export const W_SFX_LIB = {
  tickA: { file: "Sfx/App Click 15.wav", dur: 0.7, vol: 0.45 },
  tickB: { file: "Sfx/Click.wav", dur: 0.44, vol: 0.55 },
  tickD: { file: "Sfx/ClicK fingerk.wav", dur: 0.44, vol: 0.55 },
  tickF: { file: "Sfx/normalized/click-1-boost.wav", dur: 0.56, vol: 0.6 },
} as const;
export type WSfxKey = keyof typeof W_SFX_LIB;
export type WSfxCue = { at: number; k: WSfxKey; rate?: number; gain?: number; fade?: number };

export const W_CAPTIONS: WCap[] = [
  { at: 0.0, end: 2.35, zone: "R", light: true, lines: [[{ t: "dan", k: "s", at: 0.0, w: 2.846 }, { t: "tahu", k: "s", at: 0.13, w: 3.573 }, { t: "nggak", k: "s", at: 0.38, w: 4.613 }], [{ t: "apa", k: "s", at: 0.51, w: 2.73 }, { t: "yang", k: "s", at: 0.76, w: 3.594 }, { t: "paling", k: "s", at: 0.88, w: 4.884 }], [{ t: "bikin", k: "s", at: 1.14, w: 3.742 }, { t: "gue", k: "s", at: 1.39, w: 2.646 }], [{ t: "TERHARU", k: "h", at: 1.52, w: 1.857 }], [{ t: "teman-teman", k: "s", at: 1.9, w: 9.672 }]] },
  { at: 2.4, end: 4.02, zone: "T", light: false, lines: [[{ t: "apa", k: "s", at: 2.4, w: 2.73 }, { t: "yang", k: "s", at: 2.61, w: 3.594 }, { t: "paling", k: "s", at: 2.71, w: 4.884 }], [{ t: "bikin", k: "s", at: 2.92, w: 3.742 }, { t: "gue", k: "s", at: 3.12, w: 2.646 }, { t: "TERHARU", k: "l", at: 3.22, w: 1.857 }]] },
  { at: 3.97, end: 5.68, zone: "T", light: false, lines: [[{ t: "selain", k: "s", at: 3.97, w: 4.757 }, { t: "dari", k: "s", at: 4.26, w: 3.277 }], [{ t: "KALIAN", k: "l", at: 4.55, w: 1.483 }, { t: "guys", k: "s", at: 4.84, w: 3.455 }]] },
  { at: 6.3, end: 8.07, zone: "R", light: true, lines: [[{ t: "kak", k: "s", at: 6.3, w: 2.721 }], [{ t: "AGNES", k: "h", at: 6.48, w: 1.335 }], [{ t: "guys", k: "s", at: 6.83, w: 3.455 }]] },
  { at: 11.87, end: 14.02, zone: "TR", light: false, lines: [[{ t: "dan", k: "s", at: 11.87, w: 2.846 }, { t: "yang", k: "s", at: 12.05, w: 3.594 }, { t: "paling", k: "s", at: 12.23, w: 4.884 }], [{ t: "bikin", k: "s", at: 12.59, w: 3.742 }, { t: "gue", k: "s", at: 12.95, w: 2.646 }], [{ t: "TERHARU", k: "h", at: 13.13, w: 1.857 }]] },
  { at: 13.97, end: 16.28, zone: "TR", light: false, lines: [[{ t: "akhirnya", k: "s", at: 13.97, w: 6.85 }, { t: "kan", k: "s", at: 14.47, w: 2.76 }, { t: "dia", k: "s", at: 14.6, w: 2.402 }], [{ t: "NUNGGU", k: "l", at: 14.72, w: 1.684 }], [{ t: "di", k: "s", at: 14.98, w: 1.456 }, { t: "bawah", k: "s", at: 15.1, w: 5.015 }, { t: "gue", k: "s", at: 15.36, w: 2.646 }, { t: "streaming", k: "s", at: 15.48, w: 7.662 }]] },
  { at: 16.3, end: 16.95, zone: "T", light: false, lines: [[{ t: "4", k: "h", at: 16.3, w: 0.273 }, { t: "JAM", k: "h", at: 16.6, w: 0.942 }]] },
  { at: 16.9, end: 19.35, zone: "T", light: false, lines: [[{ t: "gue", k: "s", at: 16.9, w: 2.646 }, { t: "streaming", k: "s", at: 17.08, w: 7.662 }, { t: "di", k: "s", at: 17.57, w: 1.456 }, { t: "bawah", k: "s", at: 17.9, w: 5.015 }], [{ t: "kita", k: "s", at: 18.6, w: 3.1 }, { t: "ada", k: "s", at: 18.95, w: 2.848 }]] },
  { at: 19.3, end: 20.85, zone: "TR", light: false, lines: [[{ t: "TV", k: "l", at: 19.3, w: 0.541 }, { t: "sama", k: "s", at: 19.5, w: 3.783 }, { t: "SOFA", k: "l", at: 19.9, w: 1.018 }]] },
  { at: 22.2, end: 24.82, zone: "TR", light: false, lines: [[{ t: "sebelum", k: "s", at: 22.2, w: 6.106 }], [{ t: "gue", k: "s", at: 22.89, w: 2.646 }, { t: "streaming", k: "s", at: 23.12, w: 7.662 }], [{ t: "gua", k: "s", at: 23.58, w: 2.764 }, { t: "bilang", k: "s", at: 23.81, w: 4.969 }]] },
  { at: 24.77, end: 27.15, zone: "L", light: false, lines: [[{ t: "AGNES", k: "l", at: 24.77, w: 1.335 }], [{ t: "aku", k: "s", at: 24.91, w: 2.765 }, { t: "kayaknya", k: "s", at: 25.04, w: 7.087 }], [{ t: "bakal", k: "s", at: 25.39, w: 4.432 }, { t: "LAMA", k: "l", at: 25.52, w: 1.177 }], [{ t: "di", k: "s", at: 25.66, w: 1.456 }, { t: "sini", k: "s", at: 25.73, w: 2.721 }]] },
  { at: 27.33, end: 29.48, zone: "R2", light: false, lines: [[{ t: "Agnes", k: "s", at: 27.33, w: 4.399 }], [{ t: "TURUN", k: "h", at: 27.55, w: 1.38 }, { t: "AJA", k: "h", at: 27.77, w: 0.816 }], [{ t: "nggak", k: "s", at: 28.37, w: 4.613 }, { t: "papa", k: "s", at: 28.56, w: 3.568 }]] },
  { at: 29.9, end: 31.13, zone: "R", light: true, lines: [[{ t: "Agnes", k: "s", at: 29.9, w: 4.399 }], [{ t: "TURUN", k: "l", at: 30.0, w: 1.38 }, { t: "AJA", k: "l", at: 30.22, w: 0.816 }]] },
  { at: 31.2, end: 33.92, zone: "R", light: true, lines: [[{ t: "takutnya", k: "s", at: 31.2, w: 6.983 }], [{ t: "BERISIK", k: "l", at: 31.63, w: 1.585 }], [{ t: "kan", k: "s", at: 31.95, w: 2.76 }, { t: "gua", k: "s", at: 32.06, w: 2.764 }], [{ t: "LIVE", k: "l", at: 32.17, w: 0.85 }], [{ t: "gua", k: "s", at: 32.99, w: 2.764 }, { t: "berisik", k: "s", at: 33.1, w: 5.293 }, { t: "ya", k: "s", at: 33.42, w: 1.741 }]] },
  { at: 33.87, end: 35.5, zone: "R", light: true, lines: [[{ t: "gua", k: "s", at: 33.87, w: 2.764 }, { t: "turun", k: "s", at: 33.93, w: 4.456 }], [{ t: "ke", k: "s", at: 34.04, w: 1.718 }, { t: "BAWAH", k: "l", at: 34.1, w: 1.467 }]] },
  { at: 36.73, end: 38.93, zone: "R", light: true, lines: [[{ t: "Agnes", k: "s", at: 36.73, w: 4.399 }, { t: "lagi", k: "s", at: 36.93, w: 3.102 }], [{ t: "nonton", k: "s", at: 37.12, w: 5.592 }, { t: "gue", k: "s", at: 37.31, w: 2.646 }], [{ t: "di", k: "s", at: 37.41, w: 1.456 }, { t: "TV", k: "h", at: 38.09, w: 0.541 }]] },
  { at: 40.77, end: 44.33, zone: "L", light: false, lines: [[{ t: "Agnes", k: "s", at: 40.77, w: 4.399 }, { t: "nonton", k: "s", at: 41.09, w: 5.592 }, { t: "gue", k: "s", at: 41.41, w: 2.646 }], [{ t: "di", k: "s", at: 41.56, w: 1.456 }, { t: "TV", k: "s", at: 41.85, w: 1.7 }, { t: "sampai", k: "s", at: 42.01, w: 5.111 }], [{ t: "KETIDURAN", k: "h", at: 42.33, w: 2.285 }]] },
  { at: 45.97, end: 49.15, zone: "R", light: true, lines: [[{ t: "terlepas", k: "s", at: 45.97, w: 6.643 }, { t: "dari", k: "s", at: 47.1, w: 3.277 }], [{ t: "SOLO", k: "l", at: 47.43, w: 1.038 }, { t: "STREAM", k: "l", at: 47.77, w: 1.699 }, { t: "ini", k: "s", at: 47.93, w: 1.924 }], [{ t: "teman-teman", k: "s", at: 48.27, w: 9.672 }, { t: "ya", k: "s", at: 48.93, w: 1.741 }]] },
  { at: 49.1, end: 50.42, zone: "R", light: true, lines: [[{ t: "terlepas", k: "m", at: 49.1, w: 5.683 }, { t: "dari", k: "m", at: 49.42, w: 2.797 }], [{ t: "solo", k: "m", at: 49.63, w: 3.04 }, { t: "stream", k: "m", at: 49.84, w: 4.599 }, { t: "ini", k: "m", at: 49.95, w: 1.564 }, { t: "guys", k: "m", at: 50.16, w: 2.975 }]] },
  { at: 50.37, end: 51.68, zone: "R", light: true, lines: [[{ t: "gua", k: "s", at: 50.37, w: 2.764 }, { t: "nggak", k: "s", at: 50.51, w: 4.613 }], [{ t: "SENDIRI", k: "h", at: 50.64, w: 1.607 }], [{ t: "guys", k: "s", at: 51.05, w: 3.455 }]] },
  { at: 52.8, end: 54.73, zone: "TT", light: false, lines: [[{ t: "ada", k: "s", at: 52.8, w: 2.848 }, { t: "emang", k: "s", at: 53.27, w: 4.706 }, { t: "SUPPORT", k: "l", at: 53.74, w: 1.893 }, { t: "SYSTEM", k: "l", at: 54.21, w: 1.658 }]] },
  { at: 54.68, end: 57.18, zone: "TT", light: false, lines: [[{ t: "SUPPORT", k: "l", at: 54.68, w: 1.893 }, { t: "SYSTEM", k: "l", at: 55.49, w: 1.658 }, { t: "yang", k: "s", at: 55.96, w: 3.594 }, { t: "MENEMANI", k: "l", at: 56.19, w: 2.226 }]] },
  { at: 57.13, end: 58.23, zone: "TT", light: false, lines: [[{ t: "GRINDING", k: "l", at: 57.13, w: 1.947 }, { t: "gua", k: "s", at: 57.77, w: 2.764 }]] },
  { at: 58.23, end: 61.58, zone: "R", light: true, lines: [[{ t: "BRANDING-AN", k: "l", at: 58.23, w: 2.773 }], [{ t: "gua", k: "s", at: 58.78, w: 2.764 }, { t: "MARKETING", k: "l", at: 59.03, w: 2.401 }, { t: "game", k: "s", at: 59.78, w: 3.762 }], [{ t: "ATTENTION", k: "l", at: 60.28, w: 2.235 }, { t: "game", k: "s", at: 61.03, w: 3.762 }]] },
  { at: 61.53, end: 63.99, zone: "R", light: true, lines: [[{ t: "gua", k: "s", at: 61.53, w: 2.764 }, { t: "KERJA", k: "l", at: 61.68, w: 1.309 }, { t: "KERAS", k: "l", at: 61.97, w: 1.316 }], [{ t: "KONSISTENSI", k: "l", at: 62.27, w: 2.706 }, { t: "gua", k: "s", at: 62.85, w: 2.764 }], [{ t: "8", k: "h", at: 63.0, w: 0.267 }, { t: "TAHUN", k: "h", at: 63.15, w: 1.353 }]] },
];

export const W_SFX_CUES: WSfxCue[] = [
  { at: 1.52, k: "tickB", rate: 1.0, gain: 0.65, fade: 0.22 },
  { at: 3.22, k: "tickF", rate: 1.06, gain: 0.5, fade: 0.22 },
  { at: 4.55, k: "tickD", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 6.48, k: "tickA", rate: 1.0, gain: 0.65, fade: 0.22 },
  { at: 13.13, k: "tickB", rate: 1.06, gain: 0.65, fade: 0.22 },
  { at: 14.72, k: "tickF", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 16.3, k: "tickD", rate: 1.0, gain: 0.65, fade: 0.22 },
  { at: 19.3, k: "tickA", rate: 1.06, gain: 0.5, fade: 0.22 },
  { at: 19.9, k: "tickB", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 24.77, k: "tickF", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 25.52, k: "tickD", rate: 1.06, gain: 0.5, fade: 0.22 },
  { at: 27.55, k: "tickA", rate: 0.94, gain: 0.65, fade: 0.22 },
  { at: 30.0, k: "tickB", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 31.63, k: "tickF", rate: 1.06, gain: 0.5, fade: 0.22 },
  { at: 32.17, k: "tickD", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 34.1, k: "tickA", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 38.09, k: "tickB", rate: 1.06, gain: 0.65, fade: 0.22 },
  { at: 42.33, k: "tickF", rate: 0.94, gain: 0.65, fade: 0.22 },
  { at: 47.43, k: "tickD", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 50.64, k: "tickA", rate: 1.06, gain: 0.65, fade: 0.22 },
  { at: 53.74, k: "tickB", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 54.21, k: "tickF", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 54.68, k: "tickD", rate: 1.06, gain: 0.5, fade: 0.22 },
  { at: 55.49, k: "tickA", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 56.19, k: "tickB", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 57.13, k: "tickF", rate: 1.06, gain: 0.5, fade: 0.22 },
  { at: 58.23, k: "tickD", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 59.03, k: "tickA", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 60.28, k: "tickB", rate: 1.06, gain: 0.5, fade: 0.22 },
  { at: 61.68, k: "tickF", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 62.27, k: "tickD", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 63.0, k: "tickA", rate: 1.06, gain: 0.65, fade: 0.22 },
];
