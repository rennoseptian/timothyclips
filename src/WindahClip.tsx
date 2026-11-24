import { Video } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CapView, useCaptionFonts, WindahCaptions } from "./WindahCaptions";
import { WindahSfx } from "./WindahSfx";
import { W_CAPTIONS, W_FPS, W_SHOTS } from "./windah";

// Kamera hanya bergerak saat Windah bicara ke kamera (adegan halaman web). B-roll (footage lain) DIAM.
// Per shot: bingkai tetap, zoom-in pelan di sekitar titik (ox, oy) yang tidak bergeser di layar, blur singkat
// saat shot baru masuk (hanya potongan di dalam adegan yang sama). Tanpa goyang/tilt.
export const VIDEO = "Video/windah.mp4";
export const MATTE = "Video/matte-windah.mp4";
const SRC_W = 1920;
const SRC_H = 1080;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export const windahCameraAt = (t: number) => {
  const shot = W_SHOTS.find((s) => t >= s.from && t < s.to);
  if (!shot) return { z: 1, tx: 0, ty: 0, blur: 0 };
  const p = clamp((t - shot.from) / (shot.to - shot.from), 0, 1);
  const z = shot.s0 + (shot.s1 - shot.s0) * p;
  const blur = shot.blur * (1 - Easing.out(Easing.cubic)(clamp((t - shot.from) / 0.35, 0, 1)));
  return { z, tx: shot.ox * (1 - z), ty: shot.oy * (1 - z), blur };
};

/** video (utama atau matte) dengan kamera. offset = frame awal Sequence induk supaya waktu absolut benar. */
const CamVideo: React.FC<{ src: string; name: string; offset: number; audio?: boolean; matte?: boolean; invert?: boolean; blend?: React.CSSProperties["mixBlendMode"] }> = ({
  src,
  name,
  offset,
  audio,
  matte,
  invert,
  blend,
}) => {
  const frame = useCurrentFrame();
  const c = windahCameraAt((frame + offset) / W_FPS);
  return (
    <Video
      name={name}
      src={staticFile(src)}
      muted={!audio}
      trimBefore={offset}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: SRC_W,
        height: SRC_H,
        transformOrigin: "0 0",
        transform: `translate(${c.tx}px, ${c.ty}px) scale(${c.z})`,
        filter: `blur(${c.blur}px)${invert ? " invert(1)" : ""}`,
        mixBlendMode: blend,
      }}
    />
  );
};

/** hero di belakang subjek: video + teks, dilubangi matte terbalik, lalu subjek (video x matte) ditambahkan di atasnya */
const BehindStack: React.FC<{ from: number; index: number }> = ({ from, index }) => {
  const cap = W_CAPTIONS[index];
  return (
    <AbsoluteFill name={`Hero belakang subjek ${index + 1}`} style={{ backgroundColor: "#000", overflow: "hidden", isolation: "isolate" }}>
      <AbsoluteFill name="Latar + teks" style={{ isolation: "isolate" }}>
        <CamVideo src={VIDEO} name="Footage" offset={from} />
        <CapView cap={cap} index={index} layered />
        <CamVideo src={MATTE} name="Matte terbalik" offset={from} matte invert blend="multiply" />
      </AbsoluteFill>
      <AbsoluteFill name="Subjek" style={{ isolation: "isolate", mixBlendMode: "plus-lighter" }}>
        <CamVideo src={VIDEO} name="Footage (subjek)" offset={from} />
        <CamVideo src={MATTE} name="Matte" offset={from} matte blend="multiply" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const WindahClip: React.FC<{ sfx: boolean; sfxGain: number }> = ({ sfx, sfxGain }) => {
  useCaptionFonts();
  return (
    <AbsoluteFill name="Klip Windah" style={{ backgroundColor: "#000" }}>
      <Sequence name="Footage + kamera" layout="none">
        <CamVideo src={VIDEO} name="Footage" offset={0} audio />
      </Sequence>
      {W_CAPTIONS.map((cap, i) => {
        if (!cap.behind) return null;
        const from = Math.round(cap.at * W_FPS);
        const to = Math.round(cap.end * W_FPS);
        return (
          <Sequence key={i} name={`Belakang subjek ${i + 1}`} from={from} durationInFrames={Math.max(8, to - from)} premountFor={20}>
            <BehindStack from={from} index={i} />
          </Sequence>
        );
      })}
      <WindahCaptions />
      {sfx ? <WindahSfx gain={sfxGain} /> : null}
    </AbsoluteFill>
  );
};
