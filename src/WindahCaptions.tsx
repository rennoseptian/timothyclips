import { loadFont } from "@remotion/fonts";
import { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Sequence, staticFile, useCurrentFrame, useDelayRender, useVideoConfig } from "remotion";
import { W_CAPTIONS, W_FPS, WCap, WWord, WZone } from "./windah";

// Klip Windah: kamera diam. Caption kata-per-kata (arah masuk bervariasi, 1-2 kata sebelumnya mengabur lalu
// menyatu) dengan DUA font: Montserrat Black untuk label kecil, Coolvetica Hv Comp untuk kata besar dan hero merah.
// Ukuran besar mengisi area kosong (halaman web putih). Teks gelap di adegan terang, putih di adegan gelap.

const RED = "#e5160f";
const INK = "#0f0f10";
// harus sama dengan LS di scripts/build-windah.py
const LS: Record<WWord["k"], number> = { s: 0.14, m: 0.02, l: 0, h: 0 };
const DIRS: ("up" | "left" | "down" | "right" | "zoom")[] = ["up", "left", "down", "right", "zoom"];
const FAM: Record<WWord["k"], string> = {
  s: "MontserratBlack, sans-serif",
  m: "MontserratBlack, sans-serif",
  l: "CoolveticaHv, sans-serif",
  h: "CoolveticaHv, sans-serif",
};
const WANT: Record<WWord["k"], number> = { s: 46, m: 74, l: 210, h: 400 };
// kotak zona (pecahan lebar/tinggi layar) dan perataan
const ZONES: Record<WZone, { x: number; y: number; w: number; h: number; align: "flex-start" | "center" }> = {
  R: { x: 0.54, y: 0.31, w: 0.43, h: 0.38, align: "flex-start" },
  TR: { x: 0.52, y: 0.04, w: 0.45, h: 0.3, align: "flex-start" },
  T: { x: 0.06, y: 0.03, w: 0.88, h: 0.26, align: "center" },
  TT: { x: 0.04, y: 0.02, w: 0.92, h: 0.14, align: "center" },
  L: { x: 0.03, y: 0.24, w: 0.32, h: 0.52, align: "flex-start" },
  R2: { x: 0.52, y: 0.08, w: 0.45, h: 0.46, align: "flex-start" },
};

const useCaptionFonts = () => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Memuat font caption"));
  useEffect(() => {
    Promise.all([
      loadFont({ family: "MontserratBlack", url: staticFile("Fonts/Montserrat-Black.ttf") }),
      loadFont({ family: "CoolveticaHv", url: staticFile("Fonts/Coolvetica Hv Comp.otf") }),
    ])
      .then(() => continueRender(handle))
      .catch((e) => cancelRender(e));
  }, [handle, continueRender, cancelRender]);
};

const ramp = (v: number, dur: number) => Math.min(1, Math.max(0, v / dur));
const ease = (v: number, dur: number) => Easing.out(Easing.cubic)(ramp(v, dur));

const CapView: React.FC<{ cap: WCap; index: number }> = ({ cap, index }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, durationInFrames } = useVideoConfig();
  const z = ZONES[cap.zone];
  const box = { left: z.x * W, top: z.y * H, width: z.w * W, height: z.h * H };
  const GAP = 0.28;
  const LH = 0.98;

  const flat: WWord[] = cap.lines.flat();
  const startFrame = Math.round(cap.at * W_FPS);
  const fws = flat.map((w) => Math.round(w.at * W_FPS) - startFrame);
  const lastFw = Math.max(...fws);
  const q = ramp(frame - (durationInFrames - 6), 6);
  const settle = ease(frame - (lastFw + 8), 8);

  // tiap baris diskalakan agar muat lebar zona, lalu semua baris diskalakan agar muat tinggi zona
  const fits = cap.lines.map((line) => {
    const natural = line.reduce((acc, w, i) => acc + WANT[w.k] * (w.w + (i > 0 ? GAP : 0)), 0);
    return Math.min(1, box.width / natural);
  });
  const heights = cap.lines.map((line, li) => Math.max(...line.map((w) => WANT[w.k])) * fits[li] * LH);
  const rowGap = 6;
  const total = heights.reduce((a, b) => a + b, 0) + rowGap * (cap.lines.length - 1);
  const hs = Math.min(1, box.height / total);

  const ink = cap.light ? INK : "#fff";
  let flatIdx = 0;
  const rows = cap.lines.map((line, li) => (
    <div key={li} style={{ display: "flex", alignItems: "baseline", justifyContent: z.align, whiteSpace: "nowrap", lineHeight: LH }}>
      {line.map((w, wi) => {
        const i = flatIdx++;
        const fs = WANT[w.k] * fits[li] * hs;
        const common = { fontFamily: FAM[w.k], fontSize: fs, letterSpacing: `${LS[w.k]}em`, marginLeft: wi > 0 ? fs * GAP : 0, textTransform: "uppercase" as const };
        const age = frame - fws[i];
        if (age < 0) return <span key={wi} style={{ ...common, visibility: "hidden" }}>{w.t}</span>;
        const p = ease(age, 9);
        const dir = DIRS[(index * 2 + i) % DIRS.length];
        const off = 80;
        const dx = dir === "left" ? -off : dir === "right" ? off : 0;
        const dy = dir === "up" ? off : dir === "down" ? -off : 0;
        const sc = dir === "zoom" ? 1 + (1 - p) * 0.35 : 1;
        const a1 = i + 1 < flat.length ? ramp(frame - fws[i + 1], 5) : 0;
        const a2 = i + 2 < flat.length ? ramp(frame - fws[i + 2], 5) * 0.55 : 0;
        const defocus = Math.max(a1, a2) * (1 - settle) * (w.k === "s" ? 1 : 0.5);
        return (
          <span
            key={wi}
            style={{
              ...common,
              display: "inline-block",
              color: w.k === "h" ? RED : ink,
              opacity: Math.min(1, age / 3) * (1 - 0.45 * defocus) * (1 - q),
              filter: `blur(${(1 - p) * 12 + defocus * 7 + q * 10}px)`,
              translate: `${dx * (1 - p)}px ${dy * (1 - p) - q * 10}px`,
              scale: String(sc),
              textShadow: cap.light ? undefined : "0 3px 22px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.55)",
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  ));

  const topZone = cap.zone === "T" || cap.zone === "TR" || cap.zone === "TT";
  return (
    <AbsoluteFill name={`Caption ${index + 1}`}>
      {!cap.light && topZone ? (
        // gradasi gelap tipis di tepi atas supaya teks putih tetap terbaca di dinding/langit terang
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "34%",
            opacity: Math.min(1, frame / 6) * (1 - q),
            background: "linear-gradient(to bottom, rgba(0,0,0,0.42), rgba(0,0,0,0))",
          }}
        />
      ) : null}
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: z.align, justifyContent: "center", gap: rowGap, ...box }}>
        {rows}
      </div>
    </AbsoluteFill>
  );
};

export const WindahCaptions: React.FC = () => {
  useCaptionFonts();
  return (
    <AbsoluteFill name="Caption Windah">
      {W_CAPTIONS.map((cap, i) => {
        const from = Math.round(cap.at * W_FPS);
        const to = Math.round(cap.end * W_FPS);
        return (
          <Sequence key={i} name={`Caption ${i + 1}: ${cap.lines.map((l) => l.map((w) => w.t).join(" ")).join(" ")}`} from={from} durationInFrames={Math.max(8, to - from)}>
            <CapView cap={cap} index={i} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
