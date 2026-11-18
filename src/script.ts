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

/** s = kecil (regular), m = kata penting (condensed), l = besar, h = hero merah raksasa di belakang subjek (w = lebar em) */
export type Seg = { k: "s" | "m" | "l" | "h"; t: string; w?: number };
/** cara masuk: up/down = dari bawah/atas, side = dari tepi layar sisi luar, zoom = mengecil dari besar, track = huruf merapat, wipe = tersingkap */
export type Anim = "up" | "down" | "side" | "zoom" | "track" | "wipe";
export type Cap = { at: number; end: number; anim: Anim; behind: boolean; flicker?: boolean; lines: Seg[][] };

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
  { at: 0.05, end: 1.03, anim: "up", behind: false, lines: [[{ k: "s", t: "Ini salah satu" }], [{ k: "m", t: "QUOTES" }]] },
  { at: 0.91, end: 1.59, anim: "side", behind: false, lines: [[{ k: "s", t: "yang gua" }, { k: "m", t: "LUPA" }, { k: "s", t: "ya" }]] },
  { at: 1.47, end: 2.23, anim: "zoom", behind: false, lines: [[{ k: "s", t: "siapa yang" }], [{ k: "l", t: "BIKIN" }]] },
  { at: 2.11, end: 4.16, anim: "down", behind: false, lines: [[{ k: "s", t: "Cuman ini" }], [{ k: "l", t: "MENGUBAH" }], [{ k: "l", t: "HIDUP GUA" }]] },
  { at: 4.04, end: 5.16, anim: "track", behind: true, lines: [[{ k: "s", t: "I'm the" }], [{ k: "h", t: "CAPTAIN OF", w: 2.320 }]] },
  { at: 5.16, end: 5.89, anim: "zoom", behind: true, lines: [[{ k: "s", t: "my" }], [{ k: "h", t: "SOUL", w: 1.051 }], [{ k: "s", t: "and the" }]] },
  { at: 5.89, end: 6.92, anim: "wipe", behind: true, lines: [[{ k: "h", t: "MASTER", w: 1.690 }], [{ k: "s", t: "of my faith" }]] },
  { at: 6.8, end: 8.19, anim: "side", behind: false, lines: [[{ k: "s", t: "Artinya" }], [{ k: "l", t: "APA?" }]] },
  { at: 8.07, end: 9.24, anim: "up", behind: false, lines: [[{ k: "s", t: "Gua adalah" }], [{ k: "m", t: "KAPTEN" }, { k: "s", t: "dari" }]] },
  { at: 9.12, end: 10.15, anim: "up", behind: false, lines: [[{ k: "m", t: "JIWA" }, { k: "s", t: "gua sendiri," }]] },
  { at: 10.03, end: 12.33, anim: "side", behind: false, lines: [[{ k: "s", t: "ya dan" }, { k: "m", t: "MASTER," }, { k: "s", t: "ya." }]] },
  { at: 12.21, end: 14.68, anim: "track", behind: true, lines: [[{ k: "s", t: "Master dari" }], [{ k: "h", t: "TAKDIR", w: 1.461 }], [{ k: "s", t: "gua sendiri." }]] },
  { at: 14.56, end: 15.38, anim: "zoom", behind: false, lines: [[{ k: "l", t: "HANYA GUA" }], [{ k: "s", t: "yang bisa" }]] },
  { at: 15.26, end: 16.11, anim: "down", behind: false, lines: [[{ k: "s", t: "tentuin" }], [{ k: "m", t: "TAKDIR" }, { k: "s", t: "gua sendiri." }]] },
  { at: 15.99, end: 16.86, anim: "side", behind: false, lines: [[{ k: "s", t: "Ini kayak kayak" }], [{ k: "m", t: "KITA" }]] },
  { at: 16.74, end: 18.43, anim: "zoom", behind: true, lines: [[{ k: "s", t: "hidup ini" }], [{ k: "h", t: "DI KAPAL", w: 1.793 }], [{ k: "s", t: "gitu loh." }]] },
  { at: 18.43, end: 19.2, anim: "wipe", behind: true, lines: [[{ k: "h", t: "KITA YANG SETIR,", w: 3.467 }]] },
  { at: 19.08, end: 20.61, anim: "up", behind: false, lines: [[{ k: "s", t: "kita" }, { k: "l", t: "NAHKODANYA" }]] },
  { at: 20.49, end: 21.45, anim: "up", behind: false, lines: [[{ k: "s", t: "Memang kadang" }], [{ k: "s", t: "bisa ada" }]] },
  { at: 21.33, end: 22.46, anim: "track", behind: true, lines: [[{ k: "h", t: "BADAI,", w: 1.357 }], [{ k: "s", t: "tapi ini kita yang" }]] },
  { at: 22.34, end: 23.73, anim: "side", behind: false, lines: [[{ k: "m", t: "DECIDE" }, { k: "s", t: "kita mau ke mana." }]] },
  { at: 23.61, end: 24.99, anim: "zoom", behind: false, lines: [[{ k: "s", t: "Lu bisa" }, { k: "m", t: "PILIH" }, { k: "s", t: "gitu," }]] },
  { at: 24.87, end: 25.72, anim: "down", behind: false, lines: [[{ k: "s", t: "besok lu mau" }], [{ k: "l", t: "BANGUN" }]] },
  { at: 25.6, end: 26.65, anim: "zoom", behind: true, flicker: true, lines: [[{ k: "s", t: "mau jadi orang" }], [{ k: "h", t: "SEDIH,", w: 1.318 }]] },
  { at: 26.53, end: 27.46, anim: "side", behind: false, lines: [[{ k: "s", t: "mau jadi" }], [{ k: "l", t: "BAHAGIA," }]] },
  { at: 27.34, end: 28.51, anim: "wipe", behind: true, flicker: true, lines: [[{ k: "s", t: "mau jadi orang" }], [{ k: "h", t: "DEPRESI,", w: 1.794 }]] },
  { at: 28.39, end: 29.73, anim: "up", behind: false, lines: [[{ k: "s", t: "mau jadi orang" }], [{ k: "l", t: "SUKSES," }]] },
  { at: 29.61, end: 30.58, anim: "up", behind: false, lines: [[{ k: "s", t: "itu semua" }, { k: "m", t: "CUMAN" }, { k: "s", t: "ada" }]] },
  { at: 30.46, end: 31.13, anim: "side", behind: false, lines: [[{ k: "s", t: "di" }, { k: "l", t: "PIKIRAN LU." }]] },
  { at: 31.01, end: 33.12, anim: "zoom", behind: false, lines: [[{ k: "s", t: "Lu sendiri yang bisa" }], [{ k: "l", t: "BIKIN ITU." }]] },
  { at: 33.0, end: 34.39, anim: "down", behind: false, lines: [[{ k: "s", t: "Saran gua" }], [{ k: "m", t: "JANGAN PERNAH" }]] },
  { at: 34.27, end: 35.5, anim: "side", behind: false, lines: [[{ k: "l", t: "NUNGGU" }, { k: "s", t: "untuk lu siap, ya," }]] },
  { at: 35.38, end: 36.96, anim: "up", behind: false, lines: [[{ k: "s", t: "untuk melakukan hal-hal" }]] },
  { at: 36.84, end: 37.5, anim: "up", behind: false, lines: [[{ k: "m", t: "APAPUN," }, { k: "s", t: "ya." }]] },
  { at: 37.38, end: 39.13, anim: "side", behind: false, lines: [[{ k: "s", t: "Jangan pernah" }], [{ k: "l", t: "NUNGGU" }]] },
  { at: 39.01, end: 39.74, anim: "zoom", behind: false, lines: [[{ k: "s", t: "sampai lu siap karena" }]] },
  { at: 39.62, end: 40.32, anim: "down", behind: false, lines: [[{ k: "s", t: "lu enggak akan pernah" }]] },
  { at: 40.2, end: 40.58, anim: "track", behind: true, flicker: true, lines: [[{ k: "h", t: "SIAP.", w: 1.017 }]] },
];

/** kilatan light leak hanya di perpindahan shot; puncaknya (~0,27 dtk setelah mulai) tepat di potongan */
export const LEAKS = [
  { at: 3.77, offset: 1.05, dur: 0.65, opacity: 0.3 },
  { at: 25.33, offset: 2.1, dur: 0.65, opacity: 0.26 },
  { at: 39.35, offset: 3.15, dur: 0.65, opacity: 0.28 },
];

// vol = volume dasar hasil normalisasi loudness tiap file (jangan dinaikkan sembarangan).
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
/** fade = lama suara terdengar (dtk) dengan fade-out: caption = tick pendek, transisi = lebih panjang */
export type SfxCue = { at: number; k: SfxKey; rate?: number; gain?: number; fade?: number };

export const SFX_CUES: SfxCue[] = [
  { at: 0.05, k: "tickA", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 0.91, k: "tickD", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 1.47, k: "tickB", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 2.06, k: "whoosh", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 2.11, k: "tickF", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 3.94, k: "flash", rate: 1.0, gain: 1.0, fade: 0.6 },
  { at: 4.04, k: "glitch", rate: 1.05, gain: 0.7, fade: 0.3 },
  { at: 5.16, k: "digital", rate: 1.1, gain: 0.7, fade: 0.4 },
  { at: 5.89, k: "glitch", rate: 1.0, gain: 0.7, fade: 0.3 },
  { at: 6.75, k: "whoosh", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 6.8, k: "tickD", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 8.02, k: "focus", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 8.07, k: "tickB", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 9.12, k: "tickF", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 9.98, k: "whoosh", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 10.03, k: "tickC", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 12.16, k: "focus", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 12.21, k: "digital", rate: 1.1, gain: 0.7, fade: 0.4 },
  { at: 14.51, k: "whoosh", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 14.56, k: "tickA", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 15.26, k: "tickD", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 15.99, k: "tickB", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 16.69, k: "focus", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 16.74, k: "digital", rate: 1.0, gain: 0.7, fade: 0.4 },
  { at: 18.43, k: "glitch", rate: 1.05, gain: 0.7, fade: 0.3 },
  { at: 19.03, k: "whoosh", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 19.08, k: "tickE", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 20.44, k: "focus", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 21.33, k: "glitch", rate: 1.0, gain: 0.7, fade: 0.3 },
  { at: 22.29, k: "whoosh", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 22.34, k: "tickD", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 23.61, k: "tickB", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 24.87, k: "tickF", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 25.5, k: "oldFlash", rate: 1.0, gain: 1.0, fade: 0.9 },
  { at: 25.6, k: "glitch", rate: 1.05, gain: 0.7, fade: 0.3 },
  { at: 26.53, k: "tickE", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 27.29, k: "whoosh", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 27.34, k: "glitch", rate: 1.0, gain: 0.7, fade: 0.3 },
  { at: 28.39, k: "tickD", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 29.56, k: "focus", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 29.61, k: "tickB", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 30.46, k: "tickF", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 30.96, k: "whoosh", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 31.01, k: "tickC", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 32.95, k: "focus", rate: 1.08, gain: 0.8, fade: 0.45 },
  { at: 33.0, k: "tickE", rate: 1.08, gain: 1.0, fade: 0.2 },
  { at: 34.27, k: "tickA", rate: 0.95, gain: 1.0, fade: 0.2 },
  { at: 35.2, k: "whoosh", rate: 0.92, gain: 0.8, fade: 0.45 },
  { at: 36.84, k: "tickD", rate: 1.12, gain: 1.0, fade: 0.2 },
  { at: 37.33, k: "focus", rate: 1.0, gain: 0.8, fade: 0.45 },
  { at: 37.38, k: "tickB", rate: 1.0, gain: 1.0, fade: 0.2 },
  { at: 39.3, k: "riser", rate: 1.0, gain: 0.8, fade: 0.9 },
  { at: 39.52, k: "flash", rate: 1.0, gain: 1.0, fade: 0.6 },
  { at: 40.2, k: "digital", rate: 1.0, gain: 0.7, fade: 0.4 },
];
