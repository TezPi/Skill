---
name: media-ffmpeg
description: "FFmpeg finishing desk for motion graphics: frames-to-video, delivery encodes (H.264/HEVC/AV1/ProRes) per platform, alpha masters and transparent WebM/HEVC handoff, xfade transitions, overlay compositing, LUT/colour tagging, film grain and vignette, frame-blend motion blur, retime/interpolation, GIF palettes, contact sheets, loudness (-14 LUFS) and ducking, Vietnamese drawtext, whisper.cpp subtitles, drawvg vector overlays, ffprobe QA. Use whenever a render must become a deliverable file, when the user asks to encode, convert, compress, export for TikTok/Reels/YouTube, make a transparent video, stitch clips, add a transition or LUT, normalize audio, burn subtitles, or make a GIF."
---

# FFmpeg finishing

Source: `FFmpeg/FFmpeg` master docs at import. Verified syntax offline: `references/filters-motion.texi` (51 motion-relevant filters extracted from `doc/filters.texi`), `references/drawvg-reference.texi` (new vector-drawing filter), `references/alpha-delivery.md` (transparent handoff). Check the local build first: `ffmpeg -version`, `ffmpeg -filters | grep <name>`, `ffmpeg -h encoder=<enc>`; newer filters (`whisper`, `drawvg`) need FFmpeg 8+ built with them.

## Golden rules

1. One **master** (ProRes 422 HQ, or ProRes 4444 / PNG sequence when alpha), every delivery cut from it. Never re-encode a lossy delivery.
2. Tag colour explicitly (`-colorspace bt709 -color_primaries bt709 -color_trc bt709`) or browsers/phones shift gamma and the brand orange drifts.
3. `-pix_fmt yuv420p` for anything social/web unless alpha. `-movflags +faststart` for MP4 on the web.
4. Measure, don't trust: `ffprobe` every output; loudness re-measured after AAC encode.

## Recipes

```bash
# PNG/JPEG sequence → master / delivery
ffmpeg -framerate 60 -i frames/f_%05d.png -c:v prores_ks -profile:v hq -pix_fmt yuv422p10le master.mov
ffmpeg -i master.mov -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -profile:v high \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart \
  -c:a aac -b:a 320k -ar 48000 out.mp4

# Platform cuts (from master). 9:16 1080x1920 for TikTok/Reels/Shorts, 16:9 1920x1080 YouTube, 4:5 1080x1350 feed
ffmpeg -i master.mov -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -c:v libx264 -crf 18 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 256k reel.mp4
ffmpeg -i master.mov -c:v libsvtav1 -crf 30 -preset 6 -pix_fmt yuv420p10le -c:a libopus -b:a 160k web-av1.mp4   # small high-quality web

# Transition between two clips (same size/fps/pix_fmt). offset = clip1 duration - transition duration
ffmpeg -i a.mp4 -i b.mp4 -filter_complex "[0:v][1:v]xfade=transition=smoothleft:duration=0.5:offset=4.5,format=yuv420p[v];[0:a][1:a]acrossfade=d=0.5[a]" -map "[v]" -map "[a]" ab.mp4
#   transitions: fade wipe* slide* smooth* circleopen/close radial dissolve pixelize zoomin squeezeh/v cover*/reveal* hblur fadeblack/white ... or custom expr

# Overlay an alpha layer (lower third, logo sting) over footage
ffmpeg -i plate.mp4 -i lowerthird.mov -filter_complex "[0][1]overlay=x=0:y=0:enable='between(t,2,7)':format=auto" -c:v libx264 -crf 16 -pix_fmt yuv420p comp.mp4

# Grade + finish: LUT, subtle grain, vignette
ffmpeg -i master.mov -vf "lut3d=file=grade.cube,noise=alls=6:allf=t,vignette=PI/5" -c:v prores_ks -profile:v hq graded.mov

# Motion blur from an over-cranked render (render at 240 fps, deliver 60): blend 4 sub-frames
ffmpeg -framerate 240 -i sub/f_%05d.png -vf "tmix=frames=4,fps=60" -c:v prores_ks -profile:v hq blurred.mov

# Retime: slow-mo with optical-flow interpolation (expensive) / speed ramp-free 2x
ffmpeg -i in.mp4 -vf "minterpolate=fps=120:mi_mode=mci:mc_mode=aobmc,setpts=2*PTS" slow.mp4
ffmpeg -i in.mp4 -vf "setpts=0.5*PTS" -af "atempo=2.0" fast.mp4

# GIF (palette per clip, lanczos)
ffmpeg -i in.mp4 -vf "fps=15,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3" out.gif

# Contact sheet for QA (1 frame / second at 30 fps, 6x5 grid)
ffmpeg -i out.mp4 -vf "select='not(mod(n\,30))',scale=320:-1,tile=6x5" -frames:v 1 -fps_mode vfr sheet.png
```

## Audio

```bash
# Loudness: social/web -14 LUFS, -2 dBTP (two-pass: measure, then apply measured_* values)
ffmpeg -i mix.wav -af loudnorm=I=-14:TP=-2:LRA=11:print_format=json -f null -
ffmpeg -i mix.wav -af "loudnorm=I=-14:TP=-2:LRA=11:measured_I=..:measured_TP=..:measured_LRA=..:measured_thresh=..:offset=..:linear=true" -ar 48000 mix-norm.wav
# Duck music under VO (12-18 dB)
ffmpeg -i music.wav -i vo.wav -filter_complex "[1:a]asplit[vo][sc];[0:a][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=350[duck];[duck][vo]amix=inputs=2:normalize=0[out]" -map "[out]" mix.wav
# Place an SFX at an exact time (ms) on the action frame
ffmpeg -i bed.wav -i whoosh.wav -filter_complex "[1:a]adelay=2480|2480[s];[0:a][s]amix=inputs=2:normalize=0" out.wav
```

## Text and subtitles

```bash
# Vietnamese drawtext: real font file with Vietnamese glyphs; text_shaping=1 when built with harfbuzz.
# Windows paths: escape the drive colon -> fontfile='C\:/Windows/Fonts/BeVietnamPro-Bold.ttf'
ffmpeg -i in.mp4 -vf "drawtext=fontfile=BeVietnamPro-Bold.ttf:text='Nếp Nhà':fontsize=96:fontcolor=white:x=(w-tw)/2:y=h*0.78:alpha='if(lt(t,1),t,1)'" out.mp4
# Burn styled subtitles (ASS keeps typography from type-kinetic-fx)
ffmpeg -i in.mp4 -vf "subtitles=captions.ass" -c:a copy burned.mp4
# Transcribe to SRT with the whisper filter (FFmpeg 8+, whisper.cpp model file)
ffmpeg -i in.mp4 -vn -af "whisper=model=ggml-medium.bin:language=vi:queue=3:destination=captions.srt:format=srt" -f null -
```

For styled, animated captions inside a code host prefer `code-remotion` (remotion-captions) or HyperFrames `embedded-captions`; FFmpeg burn-in is for finishing.

## QA

```bash
ffprobe -v error -show_entries stream=codec_name,profile,pix_fmt,width,height,r_frame_rate,color_space:format=duration -of json out.mp4
ffmpeg -i out.mp4 -af ebur128=peak=true -f null -            # integrated LUFS + true peak after encode
ffmpeg -i out.mp4 -vf "blackdetect=d=0.1,freezedetect=n=-60dB:d=0.5" -f null -   # accidental black/frozen holds
```

Also run `code-motion-graphics/assets/check.py` (pops, dead holds, loop seam, contact sheet). Alpha handoff details: `references/alpha-delivery.md`.
