import { AbsoluteFill, Composition, interpolate, useCurrentFrame } from "remotion";
import { Camera } from "./Camera";
import { Captions } from "./Captions";
import { Sfx } from "./Sfx";
import { WindahClip } from "./WindahClip";
import { W_DURATION_FRAMES, W_FPS } from "./windah";
import { DURATION_FRAMES } from "./script";

type Props = {
  sfx: boolean;
  sfxGain: number;
};

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="WindahClip"
        component={WindahClip}
        durationInFrames={W_DURATION_FRAMES}
        fps={W_FPS}
        width={1920}
        height={1080}
        defaultProps={{ sfx: true, sfxGain: 1 }}
      />
      <Composition
        id="TimothyClip"
        component={MyComponent}
        durationInFrames={DURATION_FRAMES}
        fps={24}
        width={1920}
        height={1080}
        defaultProps={{ sfx: true, sfxGain: 1 }}
      />
      <Composition
        id="TimothyClip43"
        component={MyComponent}
        durationInFrames={DURATION_FRAMES}
        fps={24}
        width={1440}
        height={1080}
        defaultProps={{ sfx: true, sfxGain: 1 }}
      />
      <Composition
        id="TimothyClipVertical"
        component={MyComponent}
        durationInFrames={DURATION_FRAMES}
        fps={24}
        width={1080}
        height={1920}
        defaultProps={{ sfx: true, sfxGain: 1 }}
      />
    </>
  );
};

export const MyComponent: React.FC<Props> = ({ sfx, sfxGain }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Klip" style={{ backgroundColor: "#000" }}>
      <Camera behind={<Captions layer="behind" />} />
      <Captions layer="front" />
      <AbsoluteFill
        name="Turun ke hitam"
        style={{
          backgroundColor: "#000",
          opacity: interpolate(frame, [DURATION_FRAMES - 8, DURATION_FRAMES], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      {sfx ? <Sfx gain={sfxGain} /> : null}
    </AbsoluteFill>
  );
};
