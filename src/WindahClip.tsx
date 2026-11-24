import { Video } from "@remotion/media";
import { AbsoluteFill, staticFile } from "remotion";
import { WindahCaptions } from "./WindahCaptions";
import { WindahSfx } from "./WindahSfx";

// Kamera DIAM: footage asli apa adanya (tanpa zoom/geser/blur potongan), hanya caption di atasnya.
export const WindahClip: React.FC<{ sfx: boolean; sfxGain: number }> = ({ sfx, sfxGain }) => {
  return (
    <AbsoluteFill name="Klip Windah" style={{ backgroundColor: "#000" }}>
      <Video name="Footage" src={staticFile("Video/lv_0_20261123215856.mp4")} style={{ position: "absolute", width: "100%", height: "100%" }} />
      <WindahCaptions />
      {sfx ? <WindahSfx gain={sfxGain} /> : null}
    </AbsoluteFill>
  );
};
