import { Video } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FACE_TRACK } from "./facetrack";
import { CAPTIONS, DURATION_FRAMES, SHOTS } from "./script";

// Kamera digital: satu klip lebar "dipotong" jadi wide / medium / close-up.
// Jendela kamera mengikuti wajah (facetrack.ts), lalu ditambah zoom, tilt naik-turun,
// kemiringan, blur-in saat ganti shot, dorongan kecil saat kata penting muncul, dan sway halus.

const SRC_W = 1920;
const SRC_H = 1080;
// potongan kamera asli pada klip (ke tamu dan kembali), untuk menghaluskan data wajah terpisah
const HARD_CUTS = [12.25, 14.667];
const VIDEO = "Video/77k-ugH5yF0-1.37.16-1.37.50.mp4";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.quad);

const faceAt = (t: number): [number, number] => {
  const n = FACE_TRACK.length;
  if (t <= FACE_TRACK[0][0]) return [FACE_TRACK[0][1], FACE_TRACK[0][2]];
  for (let i = 0; i < n - 1; i++) {
    const a = FACE_TRACK[i];
    const b = FACE_TRACK[i + 1];
    if (t >= a[0] && t < b[0]) {
      const cut = HARD_CUTS.find((c) => c > a[0] && c <= b[0]);
      if (cut !== undefined) {
        const pick = t < cut ? a : b;
        return [pick[1], pick[2]];
      }
      const k = (t - a[0]) / (b[0] - a[0]);
      return [lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
    }
  }
  return [FACE_TRACK[n - 1][1], FACE_TRACK[n - 1][2]];
};

// dorongan kecil di kamera tiap kata penting muncul (tidak ikut kalau tepat setelah ganti shot)
const PUNCHES = CAPTIONS.flatMap((ev) =>
  ev.lines
    .filter((l) => l.kind !== "soft")
    .filter((l) => !SHOTS.some((s) => l.at - s.from >= 0 && l.at - s.from < 0.3))
    .map((l) => ({ at: l.at, amt: l.kind === "huge" ? 0.05 : 0.032 }))
);

const punchEnv = (dt: number) => {
  if (dt < 0) return 0;
  if (dt < 0.1) return dt / 0.1;
  if (dt < 0.55) return 1 - easeOut((dt - 0.1) / 0.45);
  return 0;
};

const cameraAt = (t: number) => {
  let idx = SHOTS.findIndex((s) => t >= s.from && t < s.to);
  if (idx < 0) idx = SHOTS.length - 1;
  const shot = SHOTS[idx];
  const p = clamp((t - shot.from) / (shot.to - shot.from), 0, 1);
  const e = easeInOut(p);
  const k = 1 - easeOut(clamp((t - shot.from) / 0.4, 0, 1)); // 1 saat shot baru masuk -> 0

  let s = lerp(shot.s[0], shot.s[1], e) + shot.kick * k;
  for (const pu of PUNCHES) s *= 1 + pu.amt * punchEnv(t - pu.at);

  const sway = { x: Math.cos(t * 1.4) * 3, y: Math.sin(t * 1.9) * 2.5, r: Math.sin(t * 1.1) * 0.12 };
  const rot = lerp(shot.rot[0], shot.rot[1], e) + (shot.kick > 0 ? (idx % 2 ? 1 : -1) * 1.0 * k : 0) + sway.r;

  const th = (Math.abs(rot) * Math.PI) / 180;
  const cover = Math.cos(th) + (SRC_W / SRC_H) * Math.sin(th);
  const sEff = Math.max(s, cover);
  const w = SRC_W / sEff;
  const h = SRC_H / sEff;

  const [fx, fy] = faceAt(t);
  const dy = lerp(shot.dy[0], shot.dy[1], e) + shot.tiltIn * k;
  let cx = fx * SRC_W + (0.5 - shot.px) * w;
  let cy = fy * SRC_H + (0.5 - shot.py) * h + dy * h;
  const hw = 0.5 * (w * Math.cos(th) + h * Math.sin(th));
  const hh = 0.5 * (w * Math.sin(th) + h * Math.cos(th));
  cx = clamp(cx, hw, SRC_W - hw);
  cy = clamp(cy, hh, SRC_H - hh);

  return {
    s: sEff,
    rot,
    tx: -(cx - w / 2) * sEff + sway.x,
    ty: -(cy - h / 2) * sEff + sway.y,
    blur: shot.blur * k,
  };
};

export const Camera: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = cameraAt(frame / fps);
  return (
    <AbsoluteFill name="Kamera" style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Video
        name="Klip utama"
        src={staticFile(VIDEO)}
        volume={(f) =>
          interpolate(f, [DURATION_FRAMES - 6, DURATION_FRAMES], [1, 0], {
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
          transform: `translate(${SRC_W / 2}px, ${SRC_H / 2}px) rotate(${c.rot}deg) translate(${-SRC_W / 2}px, ${-SRC_H / 2}px) translate(${c.tx}px, ${c.ty}px) scale(${c.s})`,
          filter: `blur(${c.blur}px) contrast(1.04) saturate(1.05)`,
        }}
      />
    </AbsoluteFill>
  );
};
