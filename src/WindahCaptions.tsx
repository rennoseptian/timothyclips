import { loadFont } from "@remotion/fonts";
import { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Sequence, staticFile, useCurrentFrame, useDelayRender, useVideoConfig } from "remotion";
import { W_CAPTIONS, W_FPS, WCap, WWord, WZone } from "./windah";

// Klip Windah v2. Tiap caption = SATU lockup padat dengan SATU kata fokus (Coolvetica Hv Comp, besar; merah bila
// hero) dan label kecil Montserrat Black yang rata kiri di sekelilingnya. Kata masuk satu per satu (arah beda,
// jarak pendek), 1-2 kata sebelumnya mengabur lalu menyatu. Depth: hierarki ukuran 1 : 0.22, bayangan berlapis,
// hero perlahan membesar (paralaks terhadap kamera), scrim lembut di footage gelap, dan beberapa hero di BELAKANG
// subjek (lapisan matte di WindahClip.tsx).

const RED = "#e5160f";
const INK = "#0f0f10";
// harus sama dengan LS di scripts/build-windah.py
const LS: Record<WWord["k"], number> = { s: 0.04, m: 0.02, l: -0.01, h: -0.01 };
const DIRS: ("up" | "left" | "down" | "right")[] = ["up", "left", "right", "down"];
const FAM: Record<WWord["k"], string> = {
  s: "MontserratBlack, sans-serif",
  m: "MontserratBlack, sans-serif",
  l: "CoolveticaHv, sans-serif",
  h: "CoolveticaHv, sans-serif",
};
// kotak zona (pecahan lebar/tinggi layar) dan perataan blok
const ZONES: Record<WZone, { x: number; y: number; w: number; h: number; center?: boolean; end?: boolean; max?: number }> = {
  R: { x: 0.54, y: 0.3, w: 0.43, h: 0.34 },
  RU: { x: 0.5, y: 0.08, w: 0.47, h: 0.4 },
  RB: { x: 0.5, y: 0.3, w: 0.48, h: 0.52, end: true, max: 480 },
  RBH: { x: 0.44, y: 0.03, w: 0.54, h: 0.62, end: true, max: 480 },
  TL: { x: 0.03, y: 0.03, w: 0.46, h: 0.2 },
  TR: { x: 0.52, y: 0.04, w: 0.45, h: 0.3 },
  T: { x: 0.06, y: 0.03, w: 0.88, h: 0.28, center: true },
  TT: { x: 0.04, y: 0.02, w: 0.92, h: 0.16, center: true },
  L: { x: 0.03, y: 0.24, w: 0.32, h: 0.5 },
  R2: { x: 0.52, y: 0.08, w: 0.45, h: 0.46 },
};
const HERO_MAX = 340;
const isBig = (w: WWord) => w.k === "l" || w.k === "h";

export const useCaptionFonts = () => {
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

/** ukuran hero (hs) dan label (ss) agar seluruh lockup muat di kotak zona */
const fitLockup = (lines: WWord[][], boxW: number, boxH: number, maxHs = HERO_MAX) => {
  for (let hs = maxHs; hs >= 50; hs -= 4) {
    const ss = Math.max(30, Math.min(62, hs * 0.22));
    let maxW = 0;
    let totalH = 0;
    lines.forEach((line, li) => {
      const big = line.some(isBig);
      let wsum = 0;
      line.forEach((w, i) => {
        const fs = isBig(w) ? hs : ss;
        const gap = i === 0 ? 0 : isBig(w) && isBig(line[i - 1]) ? 0.14 * hs : 0.22 * fs;
        wsum += w.w * fs + gap;
      });
      maxW = Math.max(maxW, wsum);
      totalH += big ? hs * 0.82 : ss * 1.05;
      if (li > 0) totalH += big || isBig(lines[li - 1].find(isBig) ?? line[0]) ? hs * 0.04 : ss * 0.2;
    });
    if (maxW * 1.04 <= boxW && totalH * 1.04 <= boxH) return { hs, ss, bw: maxW, bh: totalH };
  }
  return { hs: 50, ss: 30, bw: boxW, bh: boxH };
};

export const CapView: React.FC<{ cap: WCap; index: number; layered?: boolean }> = ({ cap, index, layered }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, durationInFrames } = useVideoConfig();
  const z = ZONES[cap.zone];
  const box = { left: z.x * W, top: z.y * H, width: z.w * W, height: z.h * H };

  const flat: WWord[] = cap.lines.flat();
  const startFrame = Math.round(cap.at * W_FPS);
  const fws = flat.map((w) => Math.round(w.at * W_FPS) - startFrame);
  const lastFw = Math.max(...fws);
  const q = ramp(frame - (durationInFrames - 6), 6);
  const settle = ease(frame - (lastFw + 8), 8);
  const life = ramp(frame, durationInFrames);

  const { hs, ss, bw, bh } = fitLockup(cap.lines, box.width, box.height, z.max);
  const ink = cap.light ? INK : "#fff";

  let flatIdx = 0;
  const rows = cap.lines.map((line, li) => {
    const big = line.some(isBig);
    const prevBig = li > 0 && cap.lines[li - 1].some(isBig);
    const mt = li === 0 ? 0 : big || prevBig ? hs * 0.04 : ss * 0.2;
    return (
      <div key={li} style={{ display: "flex", alignItems: "baseline", whiteSpace: "nowrap", lineHeight: big ? 0.82 : 1.05, marginTop: mt }}>
        {line.map((w, wi) => {
          const i = flatIdx++;
          const bigW = isBig(w);
          const fs = bigW ? hs : ss;
          const gap = wi === 0 ? 0 : bigW && isBig(line[wi - 1]) ? 0.14 * hs : 0.22 * fs;
          const common = { fontFamily: FAM[w.k], fontSize: fs, letterSpacing: `${LS[w.k]}em`, marginLeft: gap, textTransform: "uppercase" as const };
          const age = frame - fws[i];
          if (age < 0) return <span key={wi} style={{ ...common, visibility: "hidden" }}>{w.t}</span>;

          let opacity: number;
          let blur: number;
          let tr: string;
          let sc = 1;
          if (bigW) {
            const p = ease(age, 12);
            sc = (1.14 - 0.14 * p) * (1 + 0.04 * life);
            blur = (1 - p) * 16 + q * 10;
            opacity = Math.min(1, age / 3) * (1 - q);
            tr = `0px ${-q * 10}px`;
          } else {
            const p = ease(age, 9);
            const dir = DIRS[(index + i) % DIRS.length];
            const off = 30;
            const dx = dir === "left" ? -off : dir === "right" ? off : 0;
            const dy = dir === "up" ? off * 0.8 : dir === "down" ? -off * 0.8 : 0;
            const a1 = i + 1 < flat.length ? ramp(frame - fws[i + 1], 5) : 0;
            const a2 = i + 2 < flat.length ? ramp(frame - fws[i + 2], 5) * 0.55 : 0;
            const defocus = Math.max(a1, a2) * (1 - settle);
            opacity = Math.min(1, age / 3) * (1 - 0.4 * defocus) * (1 - q) * 0.94;
            blur = (1 - p) * 8 + defocus * 6 + q * 10;
            tr = `${dx * (1 - p)}px ${dy * (1 - p) - q * 10}px`;
          }
          const shadow = bigW
            ? cap.light
              ? `0 ${hs * 0.035}px ${hs * 0.07}px rgba(0,0,0,0.24), 0 2px 1px rgba(0,0,0,0.08)${w.k === "h" ? `, 0 ${hs * 0.06}px ${hs * 0.16}px rgba(229,22,15,0.28)` : ""}`
              : `0 ${hs * 0.04}px ${hs * 0.11}px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)`
            : cap.light
              ? "0 2px 6px rgba(0,0,0,0.12)"
              : "0 2px 14px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.5)";
          return (
            <span
              key={wi}
              style={{
                ...common,
                display: "inline-block",
                transformOrigin: "0% 60%",
                color: w.k === "h" ? RED : ink,
                opacity,
                filter: `blur(${blur}px)`,
                translate: tr,
                scale: String(sc),
                textShadow: shadow,
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    );
  });

  const topZone = cap.zone === "T" || cap.zone === "TR" || cap.zone === "TT" || cap.zone === "TL";
  const scrimOn = !cap.light && !layered;
  return (
    <AbsoluteFill name={`Caption ${index + 1}`}>
      {scrimOn && topZone ? (
        // gradasi gelap tipis di tepi atas supaya teks putih terbaca di dinding/langit terang
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "34%",
            opacity: Math.min(1, frame / 6) * (1 - q),
            background: "linear-gradient(to bottom, rgba(0,0,0,0.44), rgba(0,0,0,0))",
          }}
        />
      ) : null}
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: z.end ? "flex-end" : "center", ...box }}>
        <div style={{ position: "relative", alignSelf: z.center ? "center" : "flex-start", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          {!layered && (cap.veil || (scrimOn && !topZone)) ? (
            // lapisan belakang yang lembut: halaman web memudar (teks halaman tidak bertabrakan), footage gelap diredam
            <div
              style={{
                position: "absolute",
                left: -bw * 0.18,
                right: -bw * 0.18,
                top: -bh * 0.35,
                bottom: -bh * 0.35,
                opacity: Math.min(1, frame / 6) * (1 - q),
                background: cap.light
                  ? "radial-gradient(ellipse closest-side at 50% 50%, rgba(255,255,255,0.95) 52%, rgba(255,255,255,0) 100%)"
                  : "radial-gradient(ellipse closest-side at 50% 50%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0) 100%)",
              }}
            />
          ) : null}
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>{rows}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** caption biasa (di atas footage). Caption bertanda behind dirender di WindahClip, di belakang subjek. */
export const WindahCaptions: React.FC = () => {
  useCaptionFonts();
  return (
    <AbsoluteFill name="Caption Windah">
      {W_CAPTIONS.map((cap, i) => {
        if (cap.behind) return null;
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
