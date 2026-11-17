import { loadFont } from "@remotion/fonts";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { CAPTIONS, CapEvent, CapLine } from "./script";

// Caption hanya untuk kata penting. Kata muncul bertumpuk: baris pengantar kecil, lalu kata kunci
// besar. Baris lama meredup dan blur saat baris baru masuk. Kata puncak boleh berkedip.

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

const kindStyle = (kind: CapLine["kind"], k = 1): React.CSSProperties => {
  if (kind === "soft") {
    return { fontFamily: "CoolveticaRg, sans-serif", fontSize: 66 * k, lineHeight: 1.0, letterSpacing: 0.5 };
  }
  return {
    fontFamily: "CoolveticaHv, sans-serif",
    fontSize: (kind === "huge" ? 250 : 184) * k,
    // tinggi huruf kapital font ini 0.664em; 0.76 menyisakan jarak terlihat ~0.10em antarbaris
    lineHeight: 0.76,
    letterSpacing: 1,
    textTransform: "uppercase",
  };
};

// pola kedip (opacity per frame) saat kata muncul
const FLICKER = [0, 1, 0.2, 1, 0.35, 1, 0.1, 1, 0.6, 0.25, 1, 0.5, 1, 1];

const LineView: React.FC<{
  line: CapLine;
  startFrame: number;
  nextFrame: number | null;
  k: number;
  vertical: boolean;
}> = ({ line, startFrame, nextFrame, k, vertical }) => {
  const frame = useCurrentFrame();
  const age = frame - startFrame;
  const soft = line.kind === "soft";
  const flick = line.flicker && age >= 0 && age < FLICKER.length;

  const dim =
    nextFrame === null
      ? 0
      : interpolate(frame, [nextFrame, nextFrame + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return (
    <div
      style={{
        ...kindStyle(line.kind, k),
        color: line.color === "red" ? "#ff2b2b" : "#ffffff",
        textShadow:
          line.color === "red"
            ? "0 0 10px rgba(255,43,43,0.55), 0 0 30px rgba(255,43,43,0.28), 0 4px 22px rgba(0,0,0,0.5)"
            : undefined,
        opacity:
          (line.flicker
            ? interpolate(age, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : interpolate(age, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) *
          (flick ? FLICKER[age] : 1) *
          (1 - dim * (soft ? 0.35 : 0.3)),
        filter: `blur(${
          interpolate(age, [0, 8], [soft ? 6 : 14, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }) +
          dim * (soft ? 2.5 : 3)
        }px)`,
        scale:
          line.color === "red"
            ? interpolate(age, [0, 5, 9, 14], [1.28, 0.97, 1.025, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              })
            : interpolate(age, [0, 9], [soft ? 1.04 : line.kind === "huge" ? 1.22 : 1.14, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }),
        translate: `${flick ? Math.sin(age * 12.9898) * 5 : 0}px ${interpolate(
          age,
          [0, 9],
          [soft ? 10 : 22, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
        )}px`,
        transformOrigin: line.color === "red" || vertical ? "50% 50%" : "0% 50%",
        whiteSpace: "nowrap",
      }}
    >
      {line.text}
    </div>
  );
};

const EventView: React.FC<{ ev: CapEvent }> = ({ ev }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const vertical = height > width;
  const k = vertical ? 0.8 : 1;
  const firstAt = ev.lines[0].at;
  const starts = ev.lines.map((l) => Math.round((l.at - firstAt) * fps));
  const exit = interpolate(frame, [durationInFrames - 7, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const box: React.CSSProperties = vertical
    ? { left: 40, right: 40, top: 1230, bottom: 110, justifyContent: "center", alignItems: "center" }
    : ev.side === "R"
      ? { left: 1150, width: 720, top: 0, bottom: 0, justifyContent: "center", paddingBottom: 40, alignItems: "flex-start" }
      : ev.side === "L"
        ? { left: 90, width: 720, top: 0, bottom: 0, justifyContent: "center", paddingBottom: 40, alignItems: "flex-start" }
        : ev.side === "C"
          ? { left: 0, right: 0, top: 0, bottom: 0, justifyContent: "center", alignItems: "center" }
          : { left: 0, right: 0, bottom: 70, justifyContent: "flex-end", alignItems: "center" };

  return (
    <AbsoluteFill
      name="Caption"
      style={{
        opacity: 1 - exit,
        filter: `blur(${exit * 10}px)`,
        translate: `0px ${-exit * 14}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          textShadow: "0 6px 30px rgba(0,0,0,0.55)",
          textAlign: vertical ? "center" : "left",
          ...box,
        }}
      >
        {ev.lines.map((l, i) => (
          <div key={i} style={{ marginTop: i > 0 && l.kind !== "soft" && ev.lines[i - 1].kind === "soft" ? -8 * k : 0 }}>
            <LineView
              line={l}
              startFrame={starts[i]}
              nextFrame={i + 1 < starts.length ? starts[i + 1] : null}
              k={k}
              vertical={vertical}
            />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC = () => {
  useCaptionFonts();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill name="Caption penting">
      {CAPTIONS.map((ev, i) => {
        const from = Math.round(ev.lines[0].at * fps);
        const to = Math.round(ev.end * fps);
        return (
          <Sequence key={i} name={`Caption ${i + 1}: ${ev.lines.map((l) => l.text).join(" ")}`} from={from} durationInFrames={to - from}>
            <EventView ev={ev} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
