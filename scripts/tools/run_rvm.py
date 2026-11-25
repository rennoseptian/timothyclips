import subprocess, sys, numpy as np, onnxruntime as ort, cv2, time
SRC, MODEL, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
# opsional argumen ke-4: segmen detik "a-b,c-d" (hanya segmen ini yang diproses, sisanya hitam) untuk menghemat waktu
SEGS = [tuple(map(float, x.split("-"))) for x in sys.argv[4].split(",")] if len(sys.argv) > 4 else None
W, H = 960, 540            # ukuran kerja
sess = ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])
print([i.name for i in sess.get_inputs()], [o.name for o in sess.get_outputs()])
rd = subprocess.Popen(["ffmpeg","-v","error","-i",SRC,"-vf",f"fps=30,scale={W}:{H}","-f","rawvideo","-pix_fmt","rgb24","-"],stdout=subprocess.PIPE)
wr = subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","gray","-s","1920x1080","-r","30","-i","-","-c:v","libx264","-crf","14","-pix_fmt","yuv420p","-preset","veryfast",OUT],stdin=subprocess.PIPE)
def zero(): return np.zeros((1,1,1,1),np.float32)
rec=[zero() for _ in range(4)]
ratio=np.array([0.5],np.float32)
prev=None; n=0; t0=time.time()
while True:
    buf = rd.stdout.read(W*H*3)
    if len(buf) < W*H*3: break
    fr = np.frombuffer(buf,np.uint8).reshape(H,W,3)
    if SEGS is not None and not any(a <= n / 30 < b for a, b in SEGS):
        wr.stdin.write(np.zeros((1080,1920),np.uint8).tobytes()); n += 1; prev = None
        continue
    small = cv2.resize(fr,(64,36)).astype(np.float32)
    if prev is not None and np.abs(small-prev).mean() > 18:   # potongan shot -> reset state
        rec=[zero() for _ in range(4)]
    prev = small
    src = (fr.astype(np.float32)/255).transpose(2,0,1)[None]
    fgr, pha, *rec = sess.run(None, {"src":src,"r1i":rec[0],"r2i":rec[1],"r3i":rec[2],"r4i":rec[3],"downsample_ratio":ratio})
    a = np.clip(pha[0,0],0,1)
    a = cv2.resize(a,(1920,1080),interpolation=cv2.INTER_CUBIC)
    wr.stdin.write((np.clip(a,0,1)*255).astype(np.uint8).tobytes())
    n+=1
    if n%100==0: print(n, round(time.time()-t0), "s", flush=True)
wr.stdin.close(); wr.wait(); print("done", n)
