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
import { CAPTIONS, Cap, Seg } from "./script";

// Semua ucapan jadi caption bergerak. Tiap frasa masuk dengan cara berbeda (dari bawah, atas, samping,
// zoom, huruf merapat, tersingkap). Kata hero (merah, raksasa) ditaruh DI BELAKANG subjek dan tetap terbaca.
// Posisi caption otomatis menghindari wajah (di sisi berlawanan, atau di bawah saat wajah besar).

const RED = "#e5160f";
const FLICKER = [0, 1, 0.2, 1, 0.35, 1, 0.1, 1, 0.6, 0.25, 1, 0.5, 1, 1];

const useCaptionFonts = () => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Memuat font caption"));
  useEffect(() => {
    Promise.all([
      loadFont({ family: "CoolveticaRg", url: staticFile("Fonts/Coolvetica Rg.otf") }),
      loadFont({ family: "CoolveticaHv", url: staticFile("Fonts/Coolvetica Hv Comp.otf") }),
    ])
      .then(() => continueRender(handle))
      .catch((e) => cancelRender(e));
  }, [handle, continueRender, cancelRender]);
};

const ease = (age: number, dur: number) => Easing.out(Easing.cubic)(Math.min(1, Math.max(0, age / dur)));

const segStyle = (s: Seg, vertical: boolean): React.CSSProperties => {
  const k = vertical ? 0.82 : 1;
  if (s.k === "s") return { fontFamily: "CoolveticaRg, sans-serif", fontSize: 62 * k, lineHeight: 1.05, letterSpacing: 0.5 };
  return {
    fontFamily: "CoolveticaHv, sans-serif",
    fontSize: (s.k === "l" ? 200 : 122) * k,
    lineHeight: s.k === "l" ? 0.86 : 0.9,
    letterSpacing: 1,
    textTransform: "uppercase",
  };
};

const CapView: React.FC<{ cap: Cap; index: number }> = ({ cap, index }) => {
  const age = useCurrentFrame();
  const { width: W, height: H, durationInFrames } = useVideoConfig();
  const vertical = H > W;
  const cam = cameraAt(cap.at + 0.15, W, H);
  const p = ease(age, 10);
  const q = Math.min(1, Math.max(0, (age - (durationInFrames - 5)) / 5));
  const flick = cap.flicker && age < FLICKER.length ? FLICKER[age] : 1;

  /* ---------- posisi ---------- */
  const fx = cam.face.x / W;
  const fw = cam.face.w / W;
  const side: "L" | "R" | "B" = vertical
    ? "B"
    : fx < 0.43
      ? "R"
      : fx > 0.57
        ? "L"
        : fw > 0.3
          ? "B"
          : index % 2
            ? "L"
            : "R";
  const dyCycle = [-0.04, 0.08, -0.1, 0.02, 0.12][index % 5];
  const outer = side === "R" ? 1 : side === "L" ? -1 : index % 2 ? 1 : -1;

  let box: React.CSSProperties;
  if (cap.behind) {
    const cy = vertical ? H * 0.1 : Math.min(H * 0.5, Math.max(H * 0.16, cam.face.y - H * 0.17));
    box = { left: 0, width: W, top: cy - H * 0.3, height: H * 0.6, alignItems: "flex-start", justifyContent: "center", paddingLeft: W * 0.03 };
  } else if (side === "B") {
    const cy = vertical ? H * (0.76 + [0, 0.04, -0.03][index % 3]) : H * 0.82;
    box = { left: 0, width: W, top: cy - H * 0.18, height: H * 0.36, alignItems: "center", justifyContent: "center", textAlign: "center" };
  } else {
    const cy = Math.min(H * 0.8, Math.max(H * 0.22, cam.face.y + dyCycle * H));
    if (side === "R") {
      const left = Math.min(W - 300, Math.max(W * 0.52, cam.face.x + cam.face.w * 0.7 + 50));
      box = { left, width: W - 50 - left, top: cy - H * 0.3, height: H * 0.6, alignItems: "flex-start", justifyContent: "center" };
    } else {
      const right = Math.max(300, Math.min(W * 0.48, cam.face.x - cam.face.w * 0.7 - 50));
      box = { left: 50, width: right - 50, top: cy - H * 0.3, height: H * 0.6, alignItems: "flex-end", justifyContent: "center", textAlign: "right" };
    }
  }

  /* ---------- gerak masuk ---------- */
  let tx = 0;
  let ty = 0;
  let sc = 1;
  let blur = 0;
  let op = p;
  let clip: string | undefined;
  let track = 0;
  const a = cap.anim;
  if (a === "up") { ty = (1 - p) * 70; blur = (1 - p) * 14; }
  else if (a === "down") { ty = -(1 - p) * 60; blur = (1 - p) * 14; }
  else if (a === "side") { tx = outer * (1 - p) * 230; blur = (1 - p) * 10; }
  else if (a === "zoom") { sc = 1 + (1 - p) * 0.5; blur = (1 - p) * 16; }
  else if (a === "track") { track = (1 - ease(age, 14)) * 0.22; blur = (1 - p) * 12; op = ease(age, 6); }
  else if (a === "wipe") { clip = `inset(0 ${(1 - ease(age, 11)) * 100}% 0 0)`; tx = -(1 - p) * 90; op = 1; }
  const drift = cap.behind ? 1 + (age / Math.max(1, durationInFrames)) * 0.05 : 1; // hero bergerak sangat pelan

  const lines = cap.lines.map((segs, li) => {
    const hero = segs.find((s) => s.k === "h");
    if (hero) {
      const maxFs = vertical ? 380 : 560;
      const target = W * 0.94;
      const fs = Math.min(maxFs, target / (hero.w ?? 2));
      const n = hero.t.length;
      const natural = (hero.w ?? 2) * fs;
      const ls = n > 1 ? Math.min(0.12 * fs, Math.max(0, (target - natural) / (n - 1))) : 0;
      return (
        <div
          key={li}
          style={{
            fontFamily: "CoolveticaHv, sans-serif",
            fontSize: fs,
            lineHeight: 0.92,
            color: RED,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            letterSpacing: ls + track * fs,
            width: W * 0.94,
            textAlign: "center",
            transform: `scaleY(1.1) scale(${drift})`,
            margin: `${fs * 0.1}px 0`,
          }}
        >
          {hero.t}
        </div>
      );
    }
    return (
      <div key={li} style={{ display: "flex", alignItems: "baseline", gap: 14, whiteSpace: "nowrap", justifyContent: side === "B" ? "center" : "flex-start" }}>
        {segs.map((s, si) => (
          <span key={si} style={{ ...segStyle(s, vertical), color: "#fff" }}>
            {s.t}
          </span>
        ))}
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
          textShadow: cap.behind ? undefined : "0 4px 22px rgba(0,0,0,0.6)",
          ...box,
          opacity: op * flick * (1 - q),
          filter: `blur(${blur + q * 10}px)`,
          translate: `${tx}px ${ty - q * 10}px`,
          scale: String(sc),
          clipPath: clip,
        }}
      >
        {lines}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC<{ layer: "behind" | "front" }> = ({ layer }) => {
  useCaptionFonts();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill name={layer === "behind" ? "Caption di belakang subjek" : "Caption depan"}>
      {CAPTIONS.map((cap, i) => {
        if (cap.behind !== (layer === "behind")) return null;
        const from = Math.round(cap.at * fps);
        const to = Math.round(cap.end * fps);
        return (
          <Sequence key={i} name={`Caption ${i + 1}: ${cap.lines.map((l) => l.map((s) => s.t).join(" ")).join(" ")}`} from={from} durationInFrames={Math.max(6, to - from)}>
            <CapView cap={cap} index={i} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
