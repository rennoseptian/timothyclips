import { Video } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FACE_TRACK } from "./facetrack";
import { DURATION_FRAMES, SHOTS } from "./script";

// Kamera digital yang tenang, mengikuti referensi: tiap shot punya posisi bingkai TETAP
// (berdasarkan posisi wajah median di shot itu) dan hanya zoom-in pelan untuk membangun tegangan.
// Tidak ada sway, rotasi, tilt, atau dorongan. Variasi datang dari potongan antar-ukuran.
// Saat shot baru masuk ada blur singkat yang mengecil ke fokus, seperti di referensi.

const SRC_W = 1920;
const SRC_H = 1080;
const VIDEO = "Video/77k-ugH5yF0-1.37.16-1.37.50.mp4";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
};

// posisi wajah median per shot (dihitung sekali)
const ANCHORS = SHOTS.map((shot) => {
  const pts = FACE_TRACK.filter((p) => p[0] >= shot.from && p[0] < shot.to);
  const use = pts.length > 0 ? pts : FACE_TRACK;
  return { x: median(use.map((p) => p[1])), y: median(use.map((p) => p[2])) };
});

// Output 16:9 -> base 1 (bingkai penuh). Output 9:16 -> sumber diperbesar agar tinggi 1080 mengisi 1920,
// lalu jendela 9:16 diambil di sekitar wajah. Zoom per shot (shot.s) tetap relatif terhadap dasar itu.
const cameraAt = (t: number, outW: number, outH: number) => {
  const vertical = outH > outW;
  const base = outH / SRC_H;
  let idx = SHOTS.findIndex((s) => t >= s.from && t < s.to);
  if (idx < 0) idx = SHOTS.length - 1;
  const shot = SHOTS[idx];
  const anchor = ANCHORS[idx];
  const p = clamp((t - shot.from) / (shot.to - shot.from), 0, 1);

  const s = lerp(shot.s[0], shot.s[1], p); // zoom-in linear, pelan
  const z = s * base; // skala sumber -> output
  const w = outW / z;
  const h = outH / z;
  // vertikal: wajah di tengah horizontal dan di bagian atas, caption di sepertiga bawah
  const px = vertical ? 0.5 : shot.px;
  const py = vertical ? (shot.s[0] > 1.7 ? 0.34 : 0.37) : shot.py;
  const cx = clamp(anchor.x * SRC_W + (0.5 - px) * w, w / 2, SRC_W - w / 2);
  const cy = clamp(anchor.y * SRC_H + (0.5 - py) * h, h / 2, SRC_H - h / 2);

  const blur = shot.blur * (1 - Easing.out(Easing.cubic)(clamp((t - shot.from) / 0.35, 0, 1)));
  return { s: z, tx: -(cx - w / 2) * z, ty: -(cy - h / 2) * z, blur };
};

export const Camera: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const c = cameraAt(frame / fps, width, height);
  return (
    <AbsoluteFill name="Kamera" style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Video
        name="Klip utama"
        src={staticFile(VIDEO)}
        volume={(f) =>
          interpolate(f, [DURATION_FRAMES - 10, DURATION_FRAMES], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SRC_W,
          height: SRC_H,
          transformOrigin: "0 0",
          transform: `translate(${c.tx}px, ${c.ty}px) scale(${c.s})`,
          filter: `blur(${c.blur}px) contrast(1.04) saturate(1.05)`,
        }}
      />
    </AbsoluteFill>
  );
};
