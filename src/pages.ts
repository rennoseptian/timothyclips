// Susunan halaman caption. Kata diambil berurutan dari src/captions.ts,
// jadi isi ucapan tidak bisa berubah: di sini hanya diatur pembagian baris dan gayanya.
//
//   soft  = kata biasa (Coolvetica Italic, putih)
//   bold  = penekanan (Montserrat Black, putih, huruf kapital)
//   key   = kata kunci (Montserrat Black, amber, huruf kapital)
//   script = aksen tulisan tangan (Aston Script, amber)
//
// count = jumlah kata di baris itu. Total semua count harus sama dengan jumlah kata di captions.ts.
export type LineStyle = "soft" | "bold" | "key" | "script";
export type LineSpec = { style: LineStyle; count: number };

export const pageSpec: LineSpec[][] = [
  // 0-4   Dan itu kenyataan hidup ya.
  [
    { style: "soft", count: 2 },
    { style: "script", count: 1 },
    { style: "soft", count: 2 },
  ],
  // 5-8   Kenyataan hidup yang pahit
  [
    { style: "soft", count: 2 },
    { style: "key", count: 2 },
  ],
  // 9-12  adalah enggak semua orang
  [
    { style: "soft", count: 2 },
    { style: "bold", count: 2 },
  ],
  // 13-17 dikasih titik awal yang sama.
  [
    { style: "soft", count: 1 },
    { style: "key", count: 2 },
    { style: "soft", count: 2 },
  ],
  // 18-23 Ada orang yang ketika dia coba
  [
    { style: "soft", count: 3 },
    { style: "soft", count: 3 },
  ],
  // 24-26 dan dia gagal,
  [
    { style: "soft", count: 2 },
    { style: "key", count: 1 },
  ],
  // 27-31 itu ditalangin terus sama bapaknya.
  [
    { style: "soft", count: 2 },
    { style: "soft", count: 2 },
    { style: "bold", count: 1 },
  ],
  // 32-37 Kalau gua coba suatu dan gagal,
  [
    { style: "soft", count: 2 },
    { style: "soft", count: 3 },
    { style: "key", count: 1 },
  ],
  // 38-41 emak gua enggak makan,
  [
    { style: "soft", count: 2 },
    { style: "key", count: 2 },
  ],
  // 42-45 kakak gua enggak kuliah,
  [
    { style: "soft", count: 2 },
    { style: "key", count: 2 },
  ],
  // 46-49 adik gua enggak sekolah.
  [
    { style: "soft", count: 2 },
    { style: "key", count: 2 },
  ],
  // 50-55 Memang ada dari mereka yang tadi
  [
    { style: "soft", count: 3 },
    { style: "soft", count: 3 },
  ],
  // 56-59 gua bilang punya modal,
  [
    { style: "soft", count: 3 },
    { style: "key", count: 1 },
  ],
  // 60-63 dikasih segala macam ya.
  [
    { style: "soft", count: 2 },
    { style: "soft", count: 2 },
  ],
  // 64-70 Cuman bukan berarti kita harus berkecil hati
  [
    { style: "soft", count: 3 },
    { style: "soft", count: 2 },
    { style: "key", count: 2 },
  ],
  // 71-76 karena orang tua kita dari keluarga
  [
    { style: "soft", count: 3 },
    { style: "soft", count: 3 },
  ],
  // 77-78 yang sederhana.
  [
    { style: "soft", count: 1 },
    { style: "key", count: 1 },
  ],
  // 79-82 Lu enggak perlu merasa
  [
    { style: "soft", count: 2 },
    { style: "soft", count: 2 },
  ],
];
