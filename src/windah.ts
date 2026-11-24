// Dihasilkan oleh scripts/build-windah.py (edit di sana lalu jalankan ulang). Klip Windah Basudara v2 (kamera bergerak hanya di adegan halaman web).
export const W_FPS = 30;
export const W_DURATION_FRAMES = 1929;
export type WZone = "R" | "TR" | "T" | "TT" | "TL" | "L" | "R2" | "RU" | "RB" | "RBH";
/** s = label kecil (Montserrat Black), m = sedang (Montserrat Black), l = besar (Coolvetica Hv Comp), h = hero merah (Coolvetica Hv Comp) */
export type WWord = { t: string; k: "s" | "m" | "l" | "h"; at: number; w: number };
export type WCap = { at: number; end: number; zone: WZone; light: boolean; veil: boolean; behind: boolean; lines: WWord[][] };
export type WShot = { from: number; to: number; s0: number; s1: number; ox: number; oy: number; blur: number };
export const W_SHOTS: WShot[] = [{"from": 0.0, "to": 2.35, "s0": 1.0, "s1": 1.08, "ox": 1760, "oy": 900, "blur": 0}, {"from": 5.72, "to": 8.6, "s0": 1.12, "s1": 1.28, "ox": 1760, "oy": 900, "blur": 0}, {"from": 8.6, "to": 11.55, "s0": 1.4, "s1": 1.6, "ox": 1800, "oy": 940, "blur": 8}, {"from": 29.88, "to": 33.0, "s0": 1.1, "s1": 1.25, "ox": 1760, "oy": 900, "blur": 0}, {"from": 33.0, "to": 36.3, "s0": 1.4, "s1": 1.6, "ox": 1800, "oy": 940, "blur": 8}, {"from": 36.3, "to": 39.62, "s0": 1.75, "s1": 2.0, "ox": 1830, "oy": 980, "blur": 8}, {"from": 45.85, "to": 49.0, "s0": 1.12, "s1": 1.3, "ox": 1760, "oy": 900, "blur": 0}, {"from": 49.0, "to": 51.68, "s0": 1.5, "s1": 1.8, "ox": 1810, "oy": 950, "blur": 8}, {"from": 58.23, "to": 61.4, "s0": 1.15, "s1": 1.35, "ox": 1760, "oy": 900, "blur": 0}, {"from": 61.4, "to": 64.3, "s0": 1.6, "s1": 2.0, "ox": 1830, "oy": 980, "blur": 8}];
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
  { at: 0.0, end: 2.35, zone: "R", light: true, veil: true, behind: false, lines: [[{ t: "dan", k: "s", at: 0.0, w: 2.546 }, { t: "tahu", k: "s", at: 0.13, w: 3.173 }, { t: "nggak", k: "s", at: 0.38, w: 4.113 }], [{ t: "apa", k: "s", at: 0.51, w: 2.43 }, { t: "yang", k: "s", at: 0.76, w: 3.194 }, { t: "paling", k: "s", at: 0.88, w: 4.284 }], [{ t: "bikin", k: "s", at: 1.14, w: 3.242 }, { t: "gue", k: "s", at: 1.39, w: 2.346 }], [{ t: "TERHARU", k: "h", at: 1.52, w: 1.787 }], [{ t: "teman-teman", k: "s", at: 1.9, w: 8.572 }]] },
  { at: 2.4, end: 4.02, zone: "T", light: false, veil: false, behind: false, lines: [[{ t: "apa", k: "s", at: 2.4, w: 2.43 }, { t: "yang", k: "s", at: 2.61, w: 3.194 }, { t: "paling", k: "s", at: 2.71, w: 4.284 }], [{ t: "bikin", k: "s", at: 2.92, w: 3.242 }, { t: "gue", k: "s", at: 3.12, w: 2.346 }, { t: "TERHARU", k: "l", at: 3.22, w: 1.787 }]] },
  { at: 3.97, end: 5.68, zone: "T", light: false, veil: false, behind: false, lines: [[{ t: "selain", k: "s", at: 3.97, w: 4.157 }, { t: "dari", k: "s", at: 4.26, w: 2.877 }], [{ t: "KALIAN", k: "l", at: 4.55, w: 1.423 }, { t: "guys", k: "s", at: 4.84, w: 3.055 }]] },
  { at: 6.3, end: 8.07, zone: "RB", light: true, veil: true, behind: true, lines: [[{ t: "kak", k: "s", at: 6.3, w: 2.421 }], [{ t: "AGNES", k: "h", at: 6.48, w: 1.285 }], [{ t: "guys", k: "s", at: 6.83, w: 3.055 }]] },
  { at: 11.87, end: 14.02, zone: "TR", light: false, veil: false, behind: false, lines: [[{ t: "dan", k: "s", at: 11.87, w: 2.546 }, { t: "yang", k: "s", at: 12.05, w: 3.194 }, { t: "paling", k: "s", at: 12.23, w: 4.284 }], [{ t: "bikin", k: "s", at: 12.59, w: 3.242 }, { t: "gue", k: "s", at: 12.95, w: 2.346 }], [{ t: "TERHARU", k: "h", at: 13.13, w: 1.787 }]] },
  { at: 13.97, end: 16.28, zone: "TR", light: false, veil: false, behind: false, lines: [[{ t: "akhirnya", k: "s", at: 13.97, w: 6.05 }, { t: "kan", k: "s", at: 14.47, w: 2.46 }, { t: "dia", k: "s", at: 14.6, w: 2.102 }], [{ t: "NUNGGU", k: "l", at: 14.72, w: 1.624 }], [{ t: "di", k: "s", at: 14.98, w: 1.256 }, { t: "bawah", k: "s", at: 15.1, w: 4.515 }, { t: "gue", k: "s", at: 15.36, w: 2.346 }, { t: "streaming", k: "s", at: 15.48, w: 6.762 }]] },
  { at: 16.3, end: 16.95, zone: "T", light: false, veil: false, behind: false, lines: [[{ t: "4", k: "h", at: 16.3, w: 0.263 }, { t: "JAM", k: "h", at: 16.6, w: 0.912 }]] },
  { at: 16.9, end: 19.35, zone: "T", light: false, veil: false, behind: false, lines: [[{ t: "gue", k: "s", at: 16.9, w: 2.346 }, { t: "streaming", k: "s", at: 17.08, w: 6.762 }], [{ t: "di", k: "s", at: 17.57, w: 1.256 }, { t: "bawah", k: "s", at: 17.9, w: 4.515 }, { t: "KITA", k: "l", at: 18.6, w: 0.872 }, { t: "ADA", k: "l", at: 18.95, w: 0.797 }]] },
  { at: 19.3, end: 20.85, zone: "TR", light: false, veil: false, behind: false, lines: [[{ t: "TV", k: "l", at: 19.3, w: 0.521 }, { t: "sama", k: "s", at: 19.5, w: 3.383 }, { t: "sofa", k: "s", at: 19.9, w: 3.09 }]] },
  { at: 22.2, end: 24.82, zone: "TR", light: true, veil: false, behind: false, lines: [[{ t: "sebelum", k: "s", at: 22.2, w: 5.406 }], [{ t: "gue", k: "s", at: 22.89, w: 2.346 }, { t: "streaming", k: "s", at: 23.12, w: 6.762 }], [{ t: "GUA", k: "l", at: 23.58, w: 0.789 }, { t: "BILANG", k: "l", at: 23.81, w: 1.413 }]] },
  { at: 24.77, end: 27.15, zone: "L", light: false, veil: false, behind: false, lines: [[{ t: "Agnes", k: "s", at: 24.77, w: 3.899 }, { t: "aku", k: "s", at: 24.91, w: 2.465 }, { t: "kayaknya", k: "s", at: 25.04, w: 6.287 }], [{ t: "bakal", k: "s", at: 25.39, w: 3.932 }, { t: "LAMA", k: "l", at: 25.52, w: 1.137 }], [{ t: "di", k: "s", at: 25.66, w: 1.256 }, { t: "sini", k: "s", at: 25.73, w: 2.321 }]] },
  { at: 27.33, end: 29.48, zone: "R2", light: false, veil: false, behind: false, lines: [[{ t: "Agnes", k: "s", at: 27.33, w: 3.899 }], [{ t: "TURUN", k: "h", at: 27.55, w: 1.33 }, { t: "AJA", k: "h", at: 27.77, w: 0.786 }], [{ t: "nggak", k: "s", at: 28.37, w: 4.113 }, { t: "papa", k: "s", at: 28.56, w: 3.168 }]] },
  { at: 29.9, end: 31.13, zone: "R", light: true, veil: true, behind: false, lines: [[{ t: "Agnes", k: "s", at: 29.9, w: 3.899 }], [{ t: "TURUN", k: "l", at: 30.0, w: 1.33 }, { t: "AJA", k: "l", at: 30.22, w: 0.786 }]] },
  { at: 31.2, end: 33.92, zone: "R", light: true, veil: true, behind: false, lines: [[{ t: "takutnya", k: "s", at: 31.2, w: 6.183 }], [{ t: "BERISIK", k: "l", at: 31.63, w: 1.515 }], [{ t: "kan", k: "s", at: 31.95, w: 2.46 }, { t: "gua", k: "s", at: 32.06, w: 2.464 }, { t: "live", k: "s", at: 32.17, w: 2.556 }], [{ t: "gua", k: "s", at: 32.99, w: 2.464 }, { t: "berisik", k: "s", at: 33.1, w: 4.593 }, { t: "ya", k: "s", at: 33.42, w: 1.541 }]] },
  { at: 33.87, end: 35.5, zone: "RU", light: true, veil: true, behind: false, lines: [[{ t: "gua", k: "s", at: 33.87, w: 2.464 }, { t: "turun", k: "s", at: 33.93, w: 3.956 }], [{ t: "ke", k: "s", at: 34.04, w: 1.518 }, { t: "BAWAH", k: "l", at: 34.1, w: 1.417 }]] },
  { at: 36.73, end: 38.93, zone: "RU", light: true, veil: true, behind: false, lines: [[{ t: "Agnes", k: "s", at: 36.73, w: 3.899 }, { t: "lagi", k: "s", at: 36.93, w: 2.702 }], [{ t: "nonton", k: "s", at: 37.12, w: 4.992 }, { t: "gue", k: "s", at: 37.31, w: 2.346 }], [{ t: "di", k: "s", at: 37.41, w: 1.256 }, { t: "TV", k: "l", at: 38.09, w: 0.521 }]] },
  { at: 40.77, end: 44.33, zone: "L", light: false, veil: false, behind: false, lines: [[{ t: "Agnes", k: "s", at: 40.77, w: 3.899 }, { t: "nonton", k: "s", at: 41.09, w: 4.992 }, { t: "gue", k: "s", at: 41.41, w: 2.346 }], [{ t: "di", k: "s", at: 41.56, w: 1.256 }, { t: "TV", k: "s", at: 41.85, w: 1.5 }, { t: "sampai", k: "s", at: 42.01, w: 4.511 }], [{ t: "KETIDURAN", k: "h", at: 42.33, w: 2.195 }]] },
  { at: 45.97, end: 49.15, zone: "R", light: true, veil: true, behind: false, lines: [[{ t: "terlepas", k: "s", at: 45.97, w: 5.843 }, { t: "dari", k: "s", at: 47.1, w: 2.877 }], [{ t: "SOLO", k: "l", at: 47.43, w: 0.998 }, { t: "STREAM", k: "l", at: 47.77, w: 1.639 }], [{ t: "ini", k: "s", at: 47.93, w: 1.624 }, { t: "teman-teman", k: "s", at: 48.27, w: 8.572 }, { t: "ya", k: "s", at: 48.93, w: 1.541 }]] },
  { at: 49.1, end: 50.42, zone: "RU", light: true, veil: true, behind: false, lines: [[{ t: "terlepas", k: "s", at: 49.1, w: 5.843 }, { t: "dari", k: "s", at: 49.42, w: 2.877 }], [{ t: "SOLO", k: "l", at: 49.63, w: 0.998 }, { t: "STREAM", k: "l", at: 49.84, w: 1.639 }], [{ t: "ini", k: "s", at: 49.95, w: 1.624 }, { t: "guys", k: "s", at: 50.16, w: 3.055 }]] },
  { at: 50.37, end: 51.68, zone: "RB", light: true, veil: true, behind: true, lines: [[{ t: "gua", k: "s", at: 50.37, w: 2.464 }, { t: "nggak", k: "s", at: 50.51, w: 4.113 }], [{ t: "SENDIRI", k: "h", at: 50.64, w: 1.537 }], [{ t: "guys", k: "s", at: 51.05, w: 3.055 }]] },
  { at: 52.8, end: 54.73, zone: "TL", light: false, veil: false, behind: false, lines: [[{ t: "ada", k: "s", at: 52.8, w: 2.548 }, { t: "emang", k: "s", at: 53.27, w: 4.206 }], [{ t: "SUPPORT", k: "l", at: 53.74, w: 1.823 }, { t: "SYSTEM", k: "l", at: 54.21, w: 1.598 }]] },
  { at: 54.68, end: 57.18, zone: "TL", light: false, veil: false, behind: false, lines: [[{ t: "support", k: "s", at: 54.68, w: 5.434 }, { t: "system", k: "s", at: 55.49, w: 4.505 }], [{ t: "yang", k: "s", at: 55.96, w: 3.194 }, { t: "MENEMANI", k: "h", at: 56.19, w: 2.146 }]] },
  { at: 57.13, end: 58.23, zone: "TL", light: false, veil: false, behind: false, lines: [[{ t: "GRINDING", k: "l", at: 57.13, w: 1.867 }, { t: "gua", k: "s", at: 57.77, w: 2.464 }]] },
  { at: 58.23, end: 59.08, zone: "R", light: true, veil: true, behind: false, lines: [[{ t: "BRANDING-AN", k: "l", at: 58.23, w: 2.663 }, { t: "gua", k: "s", at: 58.78, w: 2.464 }]] },
  { at: 59.03, end: 60.33, zone: "R", light: true, veil: true, behind: false, lines: [[{ t: "MARKETING", k: "l", at: 59.03, w: 2.311 }, { t: "game", k: "s", at: 59.78, w: 3.362 }]] },
  { at: 60.28, end: 61.58, zone: "R", light: true, veil: true, behind: false, lines: [[{ t: "ATTENTION", k: "l", at: 60.28, w: 2.145 }, { t: "game", k: "s", at: 61.03, w: 3.362 }]] },
  { at: 61.53, end: 63.99, zone: "RBH", light: true, veil: true, behind: true, lines: [[{ t: "gua", k: "s", at: 61.53, w: 2.464 }, { t: "kerja", k: "s", at: 61.68, w: 3.738 }, { t: "keras", k: "s", at: 61.97, w: 3.846 }], [{ t: "konsistensi", k: "s", at: 62.27, w: 7.604 }, { t: "gua", k: "s", at: 62.85, w: 2.464 }], [{ t: "8", k: "h", at: 63.0, w: 0.257 }, { t: "TAHUN", k: "h", at: 63.15, w: 1.303 }]] },
];

export const W_SFX_CUES: WSfxCue[] = [
  { at: 1.52, k: "tickB", rate: 1.0, gain: 0.65, fade: 0.22 },
  { at: 3.22, k: "tickF", rate: 1.06, gain: 0.5, fade: 0.22 },
  { at: 4.55, k: "tickD", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 6.48, k: "tickA", rate: 1.0, gain: 0.65, fade: 0.22 },
  { at: 13.13, k: "tickB", rate: 1.06, gain: 0.65, fade: 0.22 },
  { at: 14.72, k: "tickF", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 16.3, k: "tickD", rate: 1.0, gain: 0.65, fade: 0.22 },
  { at: 18.6, k: "tickA", rate: 1.06, gain: 0.5, fade: 0.22 },
  { at: 19.3, k: "tickB", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 23.58, k: "tickF", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 25.52, k: "tickD", rate: 1.06, gain: 0.5, fade: 0.22 },
  { at: 27.55, k: "tickA", rate: 0.94, gain: 0.65, fade: 0.22 },
  { at: 30.0, k: "tickB", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 31.63, k: "tickF", rate: 1.06, gain: 0.5, fade: 0.22 },
  { at: 34.1, k: "tickD", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 38.09, k: "tickA", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 42.33, k: "tickB", rate: 1.06, gain: 0.65, fade: 0.22 },
  { at: 47.43, k: "tickF", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 49.63, k: "tickD", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 50.64, k: "tickA", rate: 1.06, gain: 0.65, fade: 0.22 },
  { at: 53.74, k: "tickB", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 54.21, k: "tickF", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 56.19, k: "tickD", rate: 1.06, gain: 0.65, fade: 0.22 },
  { at: 57.13, k: "tickA", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 58.23, k: "tickB", rate: 1.0, gain: 0.5, fade: 0.22 },
  { at: 59.03, k: "tickF", rate: 1.06, gain: 0.5, fade: 0.22 },
  { at: 60.28, k: "tickD", rate: 0.94, gain: 0.5, fade: 0.22 },
  { at: 63.0, k: "tickA", rate: 1.0, gain: 0.65, fade: 0.22 },
];
