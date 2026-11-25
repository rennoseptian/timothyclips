import { Audio } from "@remotion/media";
import { interpolate, staticFile, useVideoConfig } from "remotion";
import { W_SFX_CUES, W_SFX_LIB } from "./windah";

// Semua SFX dibaca dari W_SFX_CUES di script.ts. Tiap file punya volume dasar yang sudah
// dinormalisasi; `gain` adalah pengali global (panel Props di Studio).
export const WindahSfx: React.FC<{ gain: number }> = ({ gain }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {W_SFX_CUES.map((c, i) => {
        const lib = W_SFX_LIB[c.k];
        const rate = c.rate ?? 1;
        const audible = c.fade ?? lib.dur / rate + 0.05;
        const dur = Math.ceil(audible * fps);
        const fadeLen = c.fade ? Math.round(dur * 0.6) : 0;
        const v = Math.min(1, lib.vol * (c.gain ?? 1) * gain);
        return (
          <Audio
            key={i}
            name={`SFX ${c.k} @${c.at}s`}
            src={staticFile(lib.file)}
            from={Math.round(c.at * fps)}
            durationInFrames={dur}
            playbackRate={rate}
            volume={(f) =>
              fadeLen > 0
                ? v * interpolate(f, [dur - fadeLen, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
                : v
            }
          />
        );
      })}
    </>
  );
};
