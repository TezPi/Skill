# Alpha-layer handoff (transparent motion graphics)

Adapted from Remotion's internal `homepage-video-assets` agent skill (transparent creator-strip videos) plus FFmpeg `doc/encoders.texi`. One rule: **every delivery format is cut from one ProRes 4444 master**, never from another lossy file.

## 1. Make the master

| Source | Command |
|---|---|
| Remotion | `npx remotion render <id> out/master.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png` (composition must have no opaque background) |
| PNG sequence (raw seek(t) engine, Motion Canvas, three.js, AE) | `ffmpeg -framerate 60 -i frames/f_%05d.png -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le -alpha_bits 16 -vendor apl0 master.mov` |
| After Effects | Render Queue → QuickTime, Apple ProRes 4444, Channels RGB + Alpha, Straight or Premultiplied (note which) |

`-profile:v 4444xq` for heavy grading. ProRes alpha in FFmpeg needs `prores_ks` (not `prores`/`prores_aw` defaults).

## 2. Verify the master really has alpha

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,profile,pix_fmt -of csv=p=0 master.mov   # expect prores,4444,yuva444p1Xle (decoder may report 12-bit)
ffmpeg -y -ss 1 -i master.mov -vf alphaextract -frames:v 1 alpha.png                                     # must NOT be fully white
```

Failure mode: `alphaextract` succeeds but every pixel is opaque → the comp had a background colour or a stale opaque master was reused.

## 3. Cut deliveries from the master

```bash
# Chrome / Edge / Firefox web: VP9 + alpha (VP8 `libvpx` also works)
ffmpeg -y -i master.mov -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30 -row-mt 1 -auto-alt-ref 0 -an web.webm

# Safari: HEVC with alpha. Encoder only on macOS:
ffmpeg -y -i master.mov -c:v hevc_videotoolbox -alpha_quality 0.75 -tag:v hvc1 -b:v 6M -an safari.mp4
#   or Apple's avconvert --preset PresetHEVCHighestQualityWithAlpha
#   On Windows there is no HEVC-alpha encoder: ship WebM + a PNG/AVIF poster fallback for Safari, or hand the master to a Mac.

# Editors (Premiere/AE/DaVinci/CapCut desktop): hand over the ProRes 4444 master itself.
# Lottie-like overlays for apps: consider exporting Lottie/Rive instead of video (anim-lottie, anim-rive).
```

HTML:

```html
<video autoplay muted loop playsinline>
  <source src="safari.mp4" type='video/mp4; codecs="hvc1"'>
  <source src="web.webm" type="video/webm">
</video>
```

## 4. Read alpha WebM back in FFmpeg

The native VP9 decoder drops alpha. Force libvpx on input: `ffmpeg -c:v libvpx-vp9 -i web.webm ...`.

## 5. Composite check

Over footage: `ffmpeg -i bg.mp4 -i master.mov -filter_complex "[0][1]overlay=format=auto" -c:v libx264 -crf 16 check.mp4`. Look at edges: dark fringes = premultiplied alpha treated as straight → add `premultiply`/`unpremultiply` to match. Light fringes on dark plates = matte choke needed in AE.
