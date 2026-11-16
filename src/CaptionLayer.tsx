import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
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
import { captions } from "./captions";
import { LineStyle, pageSpec } from "./pages";

type W = { text: string; startMs: number; endMs: number };
type Line = { style: LineStyle; words: W[] };
type Page = { startMs: number; endMs: number; lines: Line[] };

// Menyusun halaman dari captions.ts + pages.ts. Error kalau jumlah kata tidak cocok.
const buildPages = (): Page[] => {
  let i = 0;
  const out: Page[] = [];
  for (const spec of pageSpec) {
    const lines = spec.map((l) => {
      const words = captions.slice(i, i + l.count);
      i += l.count;
      return { style: l.style, words };
    });
    const all = lines.flatMap((l) => l.words);
    if (all.length === 0) {
      throw new Error("pages.ts: ada halaman tanpa kata");
    }
    out.push({
      startMs: all[0].startMs,
      endMs: all[all.length - 1].endMs,
      lines,
    });
  }
  if (i !== captions.length) {
    throw new Error(
      `pages.ts memakai ${i} kata, tapi captions.ts punya ${captions.length} kata`
    );
  }
  return out;
};

const pages = buildPages();

const AMBER = "#F4A62A";
const HOLD_SECONDS = 0.3; // caption bertahan sebentar setelah kata terakhir
const OVERLAP_FRAMES = 2; // halaman lama memudar tepat sebelum halaman baru masuk
const EXIT_FRAMES = 6;

const useCaptionFonts = () => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Memuat font caption"));
  useEffect(() => {
    Promise.all([
      loadFont({
        family: "Montserrat Black",
        url: staticFile("Fonts/Montserrat-Black.ttf"),
        weight: "900",
      }),
      loadFont({
        family: "Coolvetica",
        url: staticFile("Fonts/Coolvetica Rg It.otf"),
        style: "italic",
      }),
      loadFont({
        family: "Aston Script",
        url: staticFile("Fonts/Aston Script.ttf"),
      }),
    ])
      .then(() => continueRender(handle))
      .catch((e) => cancelRender(e));
  }, [handle, continueRender, cancelRender]);
};

const lineStyle = (style: LineStyle): React.CSSProperties => {
  switch (style) {
    case "soft":
      return {
        fontFamily: "Coolvetica, sans-serif",
        fontStyle: "italic",
        fontSize: 62,
        lineHeight: 1.12,
        color: "#ffffff",
      };
    case "bold":
      return {
        fontFamily: "'Montserrat Black', sans-serif",
        fontWeight: 900,
        fontSize: 80,
        lineHeight: 1.02,
        textTransform: "uppercase",
        letterSpacing: -1,
        color: "#ffffff",
      };
    case "key":
      return {
        fontFamily: "'Montserrat Black', sans-serif",
        fontWeight: 900,
        fontSize: 86,
        lineHeight: 1.02,
        textTransform: "uppercase",
        letterSpacing: -1,
        color: AMBER,
      };
    case "script":
      return {
        fontFamily: "'Aston Script', cursive",
        fontSize: 104,
        lineHeight: 1,
        color: AMBER,
      };
  }
};

const WordPop: React.FC<{
  text: string;
  startFrame: number;
  emphasis: boolean;
}> = ({ text, startFrame, emphasis }) => {
  const frame = useCurrentFrame();
  return (
    <span
      style={{
        display: "inline-block",
        marginRight: "0.28em",
        opacity: interpolate(frame, [startFrame, startFrame + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: interpolate(
          frame,
          [startFrame, startFrame + 8],
          ["0px 20px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }
        ),
        scale: emphasis
          ? interpolate(frame, [startFrame, startFrame + 9], [0.9, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: "perceptual-scale",
            })
          : 1,
        filter: `blur(${interpolate(
          frame,
          [startFrame, startFrame + 7],
          [10, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }
        )}px)`,
      }}
    >
      {text}
    </span>
  );
};

const PageView: React.FC<{ page: Page; pageStartFrame: number }> = ({
  page,
  pageStartFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill
      name="Halaman caption"
      style={{
        justifyContent: "center",
        paddingLeft: 1210,
        paddingRight: 70,
        paddingBottom: 120,
        opacity: interpolate(
          frame,
          [durationInFrames - EXIT_FRAMES, durationInFrames],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        ),
        filter: `blur(${interpolate(
          frame,
          [durationInFrames - EXIT_FRAMES, durationInFrames],
          [0, 8],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )}px)`,
        textShadow: "0 4px 28px rgba(0,0,0,0.55)",
      }}
    >
      {page.lines.map((line, li) => (
        <div key={li} style={{ ...lineStyle(line.style), marginTop: li === 0 ? 0 : 6 }}>
          {line.words.map((w, wi) => (
            <WordPop
              key={wi}
              text={w.text}
              startFrame={Math.round((w.startMs / 1000) * fps) - pageStartFrame}
              emphasis={line.style === "key" || line.style === "script"}
            />
          ))}
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const CaptionLayer: React.FC<{ sfx: boolean }> = ({ sfx }) => {
  useCaptionFonts();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill name="Caption">
      <AbsoluteFill
        name="Bayangan kanan"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0) 52%, rgba(0,0,0,0.4) 100%)",
        }}
      />
      {pages.map((page, i) => {
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const holdEnd = Math.round(((page.endMs / 1000) + HOLD_SECONDS) * fps);
        const next = pages[i + 1];
        const nextStart = next
          ? Math.round((next.startMs / 1000) * fps) + OVERLAP_FRAMES
          : holdEnd;
        const endFrame = Math.max(startFrame + 12, Math.min(holdEnd, nextStart));
        return (
          <Sequence
            key={i}
            name={`Caption ${i + 1}`}
            from={startFrame}
            durationInFrames={endFrame - startFrame}
          >
            <PageView page={page} pageStartFrame={startFrame} />
          </Sequence>
        );
      })}
      {sfx
        ? pages.map((page, i) => {
            const keyLine = page.lines.find((l) => l.style === "key");
            if (!keyLine) return null;
            const f = Math.round((keyLine.words[0].startMs / 1000) * fps);
            return (
              <Audio
                key={i}
                name={`Klik ${i + 1}`}
                src={staticFile("Sfx/Click.wav")}
                from={f}
                durationInFrames={Math.ceil(0.5 * fps)}
                volume={0.1}
              />
            );
          })
        : null}
    </AbsoluteFill>
  );
};
