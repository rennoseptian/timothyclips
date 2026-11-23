import { Video } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FACE_TRACK } from "./facetrack";
import { DURATION_FRAMES, SHOTS, START_FRAME, START_SEC } from "./script";

// Kamera digital yang tenang: tiap shot punya bingkai TETAP (berdasarkan posisi wajah median di shot itu)
// dan hanya zoom-in pelan. Tidak ada sway/tilt/rotasi. Variasi datang dari potongan antar-ukuran.
// Saat shot baru masuk ada blur singkat yang mengecil ke fokus, seperti di referensi.
// Video utama dan matte subjek memakai transformasi yang SAMA supaya teks bisa disisipkan di belakang subjek.

const SRC_W = 1920;
const SRC_H = 1080;
export const VIDEO = "Video/p1t-074cn38-6.14-6.57.mp4";
export const MATTE = "Video/matte-p1t-074cn38-6.14-6.57.mp4";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
};

// posisi dan lebar wajah median per shot (dihitung sekali). FACE_TRACK memakai waktu video sumber.
const ANCHORS = SHOTS.map((shot) => {
  const pts = FACE_TRACK.filter((p) => p[0] >= shot.from + START_SEC && p[0] < shot.to + START_SEC);
  const use = pts.length > 0 ? pts : FACE_TRACK;
  return { x: median(use.map((p) => p[1])), y: median(use.map((p) => p[2])), w: median(use.map((p) => p[3])) };
});

/** Kamera pada detik t (waktu klip): transformasi video + posisi/lebar wajah di layar output (px). */
export const cameraAt = (t: number, outW: number, outH: number) => {
  const vertical = outH > outW;
  const base = outH / SRC_H; // 16:9 = 1; 9:16 = sumber diperbesar agar tinggi mengisi layar
  let idx = SHOTS.findIndex((s) => t >= s.from && t < s.to);
  if (idx < 0) idx = SHOTS.length - 1;
  const shot = SHOTS[idx];
  const anchor = ANCHORS[idx];
  const p = clamp((t - shot.from) / (shot.to - shot.from), 0, 1);

  let s = lerp(shot.s[0], shot.s[1], p); // zoom-in linear, pelan
  if (vertical) s = 1 + (s - 1) * 0.45; // 9:16 sudah memotong sempit, jadi zoom per shot dikecilkan
  const z = s * base; // skala sumber -> output
  const w = outW / z;
  const h = outH / z;
  // vertikal: wajah di tengah horizontal dan di bagian atas, caption di sepertiga bawah
  const px = vertical ? 0.5 : shot.px;
  const py = vertical ? (shot.s[0] > 1.7 ? 0.34 : 0.37) : shot.py;
  const cx = clamp(anchor.x * SRC_W + (0.5 - px) * w, w / 2, SRC_W - w / 2);
  const cy = clamp(anchor.y * SRC_H + (0.5 - py) * h, h / 2, SRC_H - h / 2);

  const blur = shot.blur * (1 - Easing.out(Easing.cubic)(clamp((t - shot.from) / 0.35, 0, 1)));
  return {
    z,
    tx: -(cx - w / 2) * z,
    ty: -(cy - h / 2) * z,
    blur,
    face: { x: (anchor.x * SRC_W - (cx - w / 2)) * z, y: (anchor.y * SRC_H - (cy - h / 2)) * z, w: anchor.w * SRC_W * z },
  };
};

/** Video (utama atau matte) dengan kamera digital. invert = matte terbalik; audio hanya untuk satu salinan. */
export const CamVideo: React.FC<{
  src: string;
  name: string;
  audio?: boolean;
  matte?: boolean;
  invert?: boolean;
  blend?: React.CSSProperties["mixBlendMode"];
}> = ({ src, name, audio, matte, invert, blend }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const c = cameraAt(frame / fps, width, height);
  return (
    <Video
      name={name}
      src={staticFile(src)}
      muted={!audio}
      trimBefore={START_FRAME}
      volume={(f) =>
        interpolate(f, [DURATION_FRAMES - 8, DURATION_FRAMES], [1, 0], {
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
        transform: `translate(${c.tx}px, ${c.ty}px) scale(${c.z})`,
        filter: `blur(${c.blur}px)${matte ? "" : " contrast(1.04) saturate(1.05)"}${invert ? " invert(1)" : ""}`,
        mixBlendMode: blend,
      }}
    />
  );
};

/** Adegan: video + teks di belakang subjek + subjek (cutout dari matte) di depannya. */
export const Camera: React.FC<{ behind: React.ReactNode }> = ({ behind }) => (
  <AbsoluteFill name="Adegan" style={{ backgroundColor: "#000", overflow: "hidden", isolation: "isolate" }}>
    {/* latar + teks belakang; area subjek dikosongkan dengan matte terbalik (multiply) */}
    <AbsoluteFill name="Latar dan teks belakang" style={{ isolation: "isolate" }}>
      <CamVideo src={VIDEO} name="Klip utama" audio />
      {behind}
      <CamVideo src={MATTE} name="Matte terbalik" matte invert blend="multiply" />
    </AbsoluteFill>
    {/* subjek = video x matte, ditambahkan di atasnya */}
    <AbsoluteFill name="Subjek" style={{ isolation: "isolate", mixBlendMode: "plus-lighter" }}>
      <CamVideo src={VIDEO} name="Klip utama (subjek)" />
      <CamVideo src={MATTE} name="Matte" matte blend="multiply" />
    </AbsoluteFill>
  </AbsoluteFill>
);
