#!/usr/bin/env python3
"""Editorial rhythm fingerprint of a finished cut (motion analogue of the humanizer voice fingerprint).

  scan VIDEO [--scene 0.3] [--out fp.json]   cuts, stillness and silence -> fingerprint JSON
  diff ANCHOR.json CANDIDATE.json            per-metric drift of a cut from a reference
  selftest                                   builds a uniform-cut clip and checks detection

Diagnostics, not quality scores: a flag says "look here", never "this is bad".
Needs ffmpeg + ffprobe on PATH. Stdlib only.
"""
import json, re, statistics as st, subprocess, sys, tempfile, os

def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True).stderr

def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True).stdout
    return float(out.strip())

def has_audio(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries",
                          "stream=index", "-of", "csv=p=0", path], capture_output=True, text=True).stdout
    return bool(out.strip())

def spans(log, start_key, end_key, total):
    starts = [float(x) for x in re.findall(start_key + r":\s*([\d.]+)", log)]
    ends = [float(x) for x in re.findall(end_key + r":\s*([\d.]+)", log)]
    ends += [total] * (len(starts) - len(ends))  # still/silent until the end
    return [(s, e) for s, e in zip(starts, ends) if e > s]

def scan(path, scene=0.3):
    total = duration(path)
    log = run(["ffmpeg", "-hide_banner", "-i", path, "-an", "-vf",
               f"select='gt(scene,{scene})',showinfo,freezedetect=n=-60dB:d=0.5",
               "-f", "null", "-"])
    cuts = sorted({round(float(t), 3) for t in re.findall(r"pts_time:([\d.]+)", log) if 0 < float(t) < total})
    bounds = [0.0] + cuts + [total]
    shots = [round(b - a, 3) for a, b in zip(bounds, bounds[1:]) if b - a > 0.04]
    stills = spans(log, "freeze_start", "freeze_end", total)
    silences = []
    if has_audio(path):
        alog = run(["ffmpeg", "-hide_banner", "-i", path, "-vn", "-af",
                    "silencedetect=n=-40dB:d=0.3", "-f", "null", "-"])
        silences = spans(alog, "silence_start", "silence_end", total)
    med = st.median(shots)
    mean = st.mean(shots)
    cv = st.pstdev(shots) / mean if len(shots) > 1 else 0.0
    near = sum(abs(s - med) <= 0.1 * med for s in shots) / len(shots)
    still_ratio = sum(e - s for s, e in stills) / total
    fp = {
        "file": os.path.basename(path), "duration_s": round(total, 2), "shots": len(shots),
        "cuts_per_10s": round(10 * len(cuts) / total, 2), "asl_s": round(mean, 2),
        "median_s": round(med, 2), "cv": round(cv, 2), "min_s": min(shots), "max_s": max(shots),
        "longest_share": round(max(shots) / total, 2), "near_median_share": round(near, 2),
        "still_ratio": round(still_ratio, 2), "stills": len(stills),
        "audio": has_audio(path), "silences": len(silences),
        "silence_ratio": round(sum(e - s for s, e in silences) / total, 2), "shot_lengths": shots,
    }
    flags = []
    if len(shots) >= 4 and (cv < 0.25 or near >= 0.6):
        flags.append("ME-01 rhythm by rule? shot lengths nearly uniform")
    if total > 8 and still_ratio == 0:
        flags.append("ME-10 constant motion? no stillness >= 0.5 s anywhere")
    if fp["audio"] and total > 8 and not silences:
        flags.append("ME-23 wall-to-wall sound? no silence >= 0.3 s")
    fp["flags"] = flags
    return fp

def diff(a, b):
    keys = ["cuts_per_10s", "asl_s", "median_s", "cv", "longest_share", "still_ratio", "silence_ratio"]
    print(f"{'metric':16}{'anchor':>10}{'cut':>10}  drift")
    for k in keys:
        x, y = a[k], b[k]
        rel = (y - x) / x if x else (0.0 if y == 0 else float("inf"))
        word = "on anchor" if abs(rel) <= 0.15 else ("higher" if rel > 0 else "lower")
        print(f"{k:16}{x:>10}{y:>10}  {word} ({rel:+.0%})" if rel != float("inf") else f"{k:16}{x:>10}{y:>10}  new")
    for f in b.get("flags", []):
        print("flag:", f)

def selftest():
    with tempfile.TemporaryDirectory() as d:
        clip = os.path.join(d, "uniform.mp4")
        colors = ["red", "blue", "green", "white", "black", "yellow"]
        inputs, chain = [], ""
        for i, c in enumerate(colors):
            inputs += ["-f", "lavfi", "-i", f"color=c={c}:s=320x180:r=30:d=2"]
            chain += f"[{i}:v]"
        subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex",
                        f"{chain}concat=n={len(colors)}:v=1:a=0[v]", "-map", "[v]", clip], check=True)
        fp = scan(clip)
        assert fp["shots"] == 6, fp
        assert abs(fp["asl_s"] - 2.0) < 0.1, fp
        assert any(f.startswith("ME-01") for f in fp["flags"]), fp
        print("selftest OK:", {k: fp[k] for k in ("shots", "asl_s", "cv", "flags")})

if __name__ == "__main__":
    args = sys.argv[1:]
    if not args or args[0] not in ("scan", "diff", "selftest"):
        sys.exit(__doc__)
    if args[0] == "selftest":
        selftest()
    elif args[0] == "diff":
        diff(*(json.load(open(p)) for p in args[1:3]))
    else:
        sc = float(args[args.index("--scene") + 1]) if "--scene" in args else 0.3
        fp = scan(args[1], sc)
        text = json.dumps(fp, indent=2)
        if "--out" in args:
            open(args[args.index("--out") + 1], "w").write(text)
        print(text)
