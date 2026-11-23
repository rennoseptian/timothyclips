import { loadFont } from "@remotion/fonts";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { cameraAt } from "./Camera";
import { CAPTIONS, Cap, Word } from "./script";

// Typography Montserrat Black. Tiap frasa = satu "lockup": kata muncul SATU PER SATU saat diucapkan,
// masing-masing dari arah berbeda, 1-2 kata sebelumnya mengabur ketika kata baru masuk, lalu semuanya
// menjadi fokus lagi sebagai satu kesatuan. Hierarki: label kecil, kata penting, kata kunci besar,
// hero merah raksasa di BELAKANG subjek. Posisi otomatis menghindari wajah.

const RED = "#e5160f";
const FPS = 24;
const FLICKER = [0, 1, 0.2, 1, 0.35, 1, 0.1, 1, 0.6, 0.25, 1, 0.5, 1, 1];
// harus sama dengan LS di scripts/build-edit.py
const LS: Record<Word["k"], number> = { s: 0.16, m: 0, l: -0.01, h: -0.01 };
const DIRS: ("up" | "left" | "down" | "right" | "zoom")[] = ["up", "left", "down", "right", "zoom"];

const useCaptionFonts = () => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Memuat font caption"));
  useEffect(() => {
    loadFont({ family: "MontserratBlack", url: staticFile("Fonts/Montserrat-Black.ttf") })
      .then(() => continueRender(handle))
      .catch((e) => cancelRender(e));
  }, [handle, continueRender, cancelRender]);
};

const ramp = (v: number, dur: number) => Math.min(1, Math.max(0, v / dur));
const ease = (v: number, dur: number) => Easing.out(Easing.cubic)(ramp(v, dur));

const CapView: React.FC<{ cap: Cap; index: number }> = ({ cap, index }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, durationInFrames } = useVideoConfig();
  const vertical = H > W;
  const k = vertical ? 0.8 : 1;
  const cam = cameraAt(cap.at + 0.15, W, H);
  const fx = cam.face.x / W;
  const fw = cam.face.w / W;

  /* ---------- area dan perataan lockup ---------- */
  const side: "L" | "R" | "B" = vertical ? "B" : fx < 0.43 ? "R" : fx > 0.57 ? "L" : fw > 0.3 ? "B" : index % 2 ? "L" : "R";
  let box: { left: number; width: number; top: number; height: number };
  let align: "start" | "end" | "center" = "center";
  if (cap.behind) {
    // hero: seluruh kata harus tetap di dalam bingkai dan hanya sedikit tersentuh kepala (tidak terpotong tepi/kepala)
    let left = W * 0.03;
    let right = W * 0.97;
    if (!vertical) {
      if (fx > 0.5) right = Math.min(right, cam.face.x - 0.8 * cam.face.w);
      else left = Math.max(left, cam.face.x + 0.8 * cam.face.w);
    } else {
      left = W * 0.03;
    }
    const width = right - left;
    const cy = vertical ? Math.max(H * 0.06, Math.min(H * 0.14, (cam.face.y - 0.8 * cam.face.w) * 0.5)) : Math.min(H * 0.45, Math.max(H * 0.2, cam.face.y - H * 0.06));
    box = { left, width, top: cy - H * 0.3, height: H * 0.6 };
  } else if (side === "B") {
    const cy = vertical ? H * (0.76 + [0, 0.04, -0.03][index % 3]) : H * 0.8;
    box = { left: W * 0.05, width: W * 0.9, top: cy - H * 0.18, height: H * 0.36 };
  } else {
    const cy = Math.min(H * 0.78, Math.max(H * 0.24, cam.face.y + [-0.04, 0.08, -0.1, 0.02, 0.12][index % 5] * H));
    if (side === "R") {
      const left = Math.min(W - 300, Math.max(W * 0.52, cam.face.x + cam.face.w * 0.7 + 50));
      box = { left, width: W - 50 - left, top: cy - H * 0.3, height: H * 0.6 };
      align = "start";
    } else {
      const right = Math.max(300, Math.min(W * 0.48, cam.face.x - cam.face.w * 0.7 - 50));
      box = { left: 50, width: right - 50, top: cy - H * 0.3, height: H * 0.6 };
      align = "end";
    }
  }

  /* ---------- ukuran kata (diskalakan agar tiap baris muat) ---------- */
  const want = (w: Word) => (w.k === "s" ? 46 : w.k === "m" ? 92 : w.k === "l" ? 132 : 250) * k;
  const flat: Word[] = cap.lines.flat();
  const startFrame = Math.round(cap.at * FPS);
  const fws = flat.map((w) => Math.round(w.at * FPS) - startFrame);
  const lastFw = Math.max(...fws);
  const q = ramp(frame - (durationInFrames - 5), 5); // keluar bersama
  const settle = ease(frame - (lastFw + 8), 8); // semua kata kembali fokus sebagai satu kesatuan

  let flatIdx = 0;
  const rows = cap.lines.map((line, li) => {
    const GAP = 0.3;
    const natural = line.reduce((acc, w, i) => acc + want(w) * (w.w + (i > 0 ? GAP : 0)), 0);
    const fit = Math.min(1, box.width / natural);
    return (
      <div key={li} style={{ display: "flex", alignItems: "baseline", justifyContent: align === "end" ? "flex-end" : align === "start" ? "flex-start" : "center", whiteSpace: "nowrap" }}>
        {line.map((w, wi) => {
          const i = flatIdx++;
          const age = frame - fws[i];
          if (age < 0) {
            return <span key={wi} style={{ visibility: "hidden", fontFamily: "MontserratBlack", fontSize: want(w) * fit, letterSpacing: `${LS[w.k]}em`, marginLeft: wi > 0 ? want(w) * fit * GAP : 0 }}>{w.t.toUpperCase()}</span>;
          }
          const p = ease(age, 9);
          const dir = DIRS[(index * 2 + i) % DIRS.length];
          const off = 90 * k;
          const dx = dir === "left" ? -off : dir === "right" ? off : 0;
          const dy = dir === "up" ? off : dir === "down" ? -off : 0;
          const sc = dir === "zoom" ? 1 + (1 - p) * 0.35 : 1;
          // 1-2 kata sebelumnya mengabur saat kata baru masuk
          const a1 = i + 1 < flat.length ? ramp(frame - fws[i + 1], 5) : 0;
          const a2 = i + 2 < flat.length ? ramp(frame - fws[i + 2], 5) * 0.55 : 0;
          const defocus = Math.max(a1, a2) * (1 - settle) * (w.k === "s" ? 1 : 0.5);
          const flick = cap.flicker && w.k === "h" && age < FLICKER.length ? FLICKER[age] : 1;
          const fs = want(w) * fit;
          return (
            <span
              key={wi}
              style={{
                display: "inline-block",
                fontFamily: "MontserratBlack, sans-serif",
                fontSize: fs,
                lineHeight: w.k === "h" ? 0.9 : 1,
                letterSpacing: `${LS[w.k]}em`,
                textTransform: "uppercase",
                color: w.k === "h" ? RED : "#fff",
                opacity: Math.min(1, age / 3) * flick * (1 - 0.45 * defocus) * (1 - q),
                filter: `blur(${(1 - p) * 12 + defocus * 7 + q * 10}px)`,
                translate: `${dx * (1 - p)}px ${dy * (1 - p) - q * 10}px`,
                scale: String(sc),
                marginLeft: wi > 0 ? fs * GAP : 0,
                textShadow: w.k === "h" ? undefined : "0 4px 24px rgba(0,0,0,0.55)",
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    );
  });

  return (
    <AbsoluteFill name={`Caption ${index + 1}`}>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: align === "end" ? "flex-end" : align === "start" ? "flex-start" : "center",
          justifyContent: "center",
          gap: cap.behind ? 6 * k : 2 * k,
          ...box,
        }}
      >
        {rows}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC<{ layer: "behind" | "front" }> = ({ layer }) => {
  useCaptionFonts();
  return (
    <AbsoluteFill name={layer === "behind" ? "Caption di belakang subjek" : "Caption depan"}>
      {CAPTIONS.map((cap, i) => {
        if (cap.behind !== (layer === "behind")) return null;
        const from = Math.round(cap.at * FPS);
        const to = Math.round(cap.end * FPS);
        return (
          <Sequence key={i} name={`Caption ${i + 1}: ${cap.lines.map((l) => l.map((w) => w.t).join(" ")).join(" ")}`} from={from} durationInFrames={Math.max(6, to - from)}>
            <CapView cap={cap} index={i} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
