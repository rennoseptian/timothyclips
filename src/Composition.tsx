import { Video } from "@remotion/media";
import { AbsoluteFill, Composition, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CaptionLayer } from "./CaptionLayer";

type Props = {
  sfx: boolean;
  lightLeak: boolean;
};

export const MyComposition = () => {
  return (
    <Composition
      id="TimothyClip"
      component={MyComponent}
      durationInFrames={576}
      fps={24}
      width={1920}
      height={1080}
      defaultProps={{ sfx: true, lightLeak: false }}
    />
  );
};

export const MyComponent: React.FC<Props> = ({ sfx, lightLeak }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Klip" style={{ backgroundColor: "#000" }}>
      <Video
        name="Klip utama"
        src={staticFile("Video/keluarga-sederhana-6.34-6.58.mp4")}
      />
      {lightLeak ? (
        <Video
          name="Light leak"
          src={staticFile(
            "Overlays-for-transition-if-need-it/free-light-leak-transitions-pack-4k-ultra-hd-ytmp4.savetube.vip.mp4"
          )}
          muted
          objectFit="cover"
          durationInFrames={48}
          style={{
            mixBlendMode: "screen",
            opacity: interpolate(frame, [0, 10, 38, 48], [0, 0.6, 0.6, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      ) : null}
      <CaptionLayer sfx={sfx} />
    </AbsoluteFill>
  );
};
