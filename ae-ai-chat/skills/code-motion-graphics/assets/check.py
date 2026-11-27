"""QA gate for a rendered motion video. Changes nothing; prints a verdict.

usage: python3 check.py out.mp4 [--loop] [--sheet sheet.png]

Checks
  1. single-frame jumps: a frame that differs from both neighbours far more than the
     neighbours differ from each other (pops, globalAlpha leaks, camera spikes).
  2. dead time: runs of identical frames longer than --hold seconds (default 1.0).
  3. loop seam (--loop): last frame -> first frame must look like any other step.
  4. contact sheet (--sheet): 4 frames per second tiled, for a human/vision pass.
Needs ffmpeg + numpy.
"""
import argparse, json, subprocess, sys
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("--loop", action="store_true")
ap.add_argument("--hold", type=float, default=1.0)
ap.add_argument("--sheet")
a = ap.parse_args()

probe = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
    "stream=r_frame_rate,nb_frames", "-of", "json", a.video], capture_output=True, text=True, check=True).stdout)
num, den = map(int, probe["streams"][0]["r_frame_rate"].split("/"))
fps = num / den
w, h = 160, 160  # tiny grayscale proxy is enough to find pops
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", a.video, "-vf", f"scale={w}:{h},format=gray",
    "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)
n = len(fr)
d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))           # d[i] = |f[i+1]-f[i]|
med = float(np.median(d[d > 0])) if (d > 0).any() else 0.0
fails = []

# 1. single-frame jumps: f[i] differs from f[i-1] and f[i+1], but f[i-1]~f[i+1]
for i in range(1, n - 1):
    skip = np.abs(fr[i + 1] - fr[i - 1]).mean()
    spike = min(d[i - 1], d[i])
    if spike > max(4 * skip, 6 * med, 1.5):
        fails.append(f"pop at frame {i} ({i / fps:.3f}s): step {spike:.2f} vs skip {skip:.2f}")

# 2. dead time
still = d < 0.02
run = 0
for i, s in enumerate(still):
    run = run + 1 if s else 0
    if run == int(a.hold * fps):
        fails.append(f"frozen > {a.hold}s ending near {(i + 1) / fps:.2f}s")

# 3. loop seam
if a.loop:
    seam = np.abs(fr[0] - fr[-1]).mean()
    if seam > max(3 * med, 1.0):
        fails.append(f"loop seam step {seam:.2f} vs median step {med:.2f} (render [0, D) and make t=D == t=0)")

if a.sheet:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.video, "-vf",
        f"fps=4,scale=320:-1,tile=8x{max(1, int(np.ceil(n / fps * 4 / 8)))}", "-frames:v", "1", a.sheet], check=True)

print(f"{n} frames @ {fps:g}fps, median step {med:.2f}")
print("PASS" if not fails else "FAIL\n  " + "\n  ".join(fails))
sys.exit(1 if fails else 0)
