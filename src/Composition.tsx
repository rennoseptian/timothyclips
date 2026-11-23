import { Video } from "@remotion/media";
import { AbsoluteFill, Composition, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Camera } from "./Camera";
import { Captions } from "./Captions";
import { Sfx } from "./Sfx";
import { DURATION_FRAMES, FPS, LEAKS } from "./script";

type Props = {
  sfx: boolean;
  sfxGain: number;
  leak: boolean;
  captionMode: "key" | "all";
};

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="TimothyClip"
        component={MyComponent}
        durationInFrames={816}
        fps={24}
        width={1920}
        height={1080}
        defaultProps={{ sfx: true, sfxGain: 1, leak: true, captionMode: "key" }}
      />
      <Composition
        id="TimothyClipVertical"
        component={MyComponent}
        durationInFrames={816}
        fps={24}
        width={1080}
        height={1920}
        defaultProps={{ sfx: true, sfxGain: 1, leak: true, captionMode: "key" }}
      />
      <Composition
        id="TimothyClipAll"
        component={MyComponent}
        durationInFrames={816}
        fps={24}
        width={1920}
        height={1080}
        defaultProps={{ sfx: true, sfxGain: 1, leak: true, captionMode: "all" }}
      />
      <Composition
        id="TimothyClipVerticalAll"
        component={MyComponent}
        durationInFrames={816}
        fps={24}
        width={1080}
        height={1920}
        defaultProps={{ sfx: true, sfxGain: 1, leak: true, captionMode: "all" }}
      />
    </>
  );
};

export const MyComponent: React.FC<Props> = ({ sfx, sfxGain, leak, captionMode }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Klip" style={{ backgroundColor: "#000" }}>
      <Camera />
      {leak
        ? LEAKS.map((l, i) => {
            const from = Math.round(l.at * FPS);
            const dur = Math.round(l.dur * FPS);
            return (
              <Video
                key={i}
                name={`Light leak ${i + 1}`}
                src={staticFile(
                  "Overlays-for-transition-if-need-it/free-light-leak-transitions-pack-4k-ultra-hd-ytmp4.savetube.vip.mp4"
                )}
                from={from}
                durationInFrames={dur}
                trimBefore={Math.round(l.offset * 25)}
                muted
                objectFit="cover"
                style={{
                  mixBlendMode: "screen",
                  opacity:
                    l.opacity *
                    interpolate(frame, [from, from + 3, from + dur - 9, from + dur], [0, 1, 1, 0], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                }}
              />
            );
          })
        : null}
      <Captions mode={captionMode} />
      <AbsoluteFill
        name="Turun ke hitam"
        style={{
          backgroundColor: "#000",
          opacity: interpolate(frame, [DURATION_FRAMES - 10, DURATION_FRAMES], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      {sfx ? <Sfx gain={sfxGain} /> : null}
    </AbsoluteFill>
  );
};

// DURATION_FRAMES di script.ts harus sama dengan durationInFrames di atas (816)
