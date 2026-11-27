---
name: media-mediabunny
description: "Mediabunny 1.61 - pure-TypeScript, zero-dependency media toolkit (WebCodecs): read metadata, decode frames/audio at any timestamp, thumbnails (CanvasSink), encode a canvas animation straight to MP4/WebM/MOV in the browser (CanvasSource), transparent VP9 video, record MediaStreams, convert/transmux/compress/trim, extract audio, HLS read/write, extensions (@mediabunny/server for Node, ProRes decoder, MP3/AAC/FLAC encoders). Use when video must be read, rendered or exported client-side or in Node without the FFmpeg CLI, when building an in-browser export button for a motion tool, frame-accurate video seeking, or when Remotion's multimedia skill points here."
---

# Mediabunny

Source: `Vanilagy/mediabunny` 1.61.4 (MPL-2.0). Full guide in `references/` (start `quick-start.md`; `media-sources.md` for encoding inputs, `media-sinks.md` for decoding, `output-formats.md`, `converting-media-files.md`, `extensions/`). Site-relative links like `/api/...` resolve at https://mediabunny.dev. Complete typed API: https://mediabunny.dev/mediabunny.d.ts (fetch it when an option is not in the guide).

Remotion uses Mediabunny underneath (`code-remotion/remotion-multimedia/` covers Remotion-specific helpers); this skill is the library itself.

## Core shapes

```ts
import { Input, ALL_FORMATS, BlobSource, UrlSource, Output, Mp4OutputFormat, WebMOutputFormat,
         BufferTarget, StreamTarget, CanvasSource, AudioBufferSource, VideoSampleSink, CanvasSink,
         Conversion, Quality, getFirstEncodableVideoCodec } from 'mediabunny';
```

- **Read**: `new Input({ formats: ALL_FORMATS, source: new BlobSource(file) })` → `computeDuration()`, `getPrimaryVideoTrack()`, `track.computeFrameRateMetrics()`; frames via `new VideoSampleSink(track).getSample(t)` or `CanvasSink(track, { width }).getCanvas(t)`; iterate `sink.samples(start, end)`.
- **Write**: `new Output({ format, target })` → `addVideoTrack(source)` / `addAudioTrack(source)` → `start()` → `source.add(...)` → `finalize()` → `output.target.buffer`.
- **Convert**: `Conversion.init({ input, output, video: {width, quality}, audio: {...}, trim: {start, end} })`, check `isValid` / `discardedTracks`, `onProgress`, `execute()`. Transmuxes when possible, transcodes when needed.

## Render a seek(t) animation to MP4 in the browser (no server, no FFmpeg)

```ts
const output = new Output({ format: new Mp4OutputFormat({ fastStart: 'in-memory' }), target: new BufferTarget() });
const codec = await getFirstEncodableVideoCodec(output.format.getSupportedVideoCodecs(), { width: W, height: H });
const video = new CanvasSource(canvas, { codec: codec!, quality: new Quality('high') });
output.addVideoTrack(video, { frameRate: FPS });
await output.start();
for (let f = 0; f < DURATION * FPS; f++) {
  window.seek(f / FPS);                  // same pure-function-of-time engine as code-motion-graphics
  await video.add(f / FPS, 1 / FPS);     // await = backpressure; never fire-and-forget
}
await output.finalize();
const blob = new Blob([output.target.buffer!], { type: output.format.mimeType });
```

- Transparent: `WebMOutputFormat` + `CanvasSource(canvas, { codec: 'vp9', alpha: 'keep' })`, canvas context `{ alpha: true }`.
- Large exports: `StreamTarget(writable, { chunked: true })` with `showSaveFilePicker()` instead of holding the file in memory.
- Audio: `AudioBufferSource({ codec: 'aac', quality })` and `add(audioBuffer)`; Web Audio `OfflineAudioContext` renders synth SFX deterministically.
- Encoder support varies by browser/GPU: always pick codecs with `getFirstEncodableVideoCodec`; H.264 encode needs even dimensions.
- DOM-based comps (HTML/SVG) cannot be drawn to canvas directly: render them with Playwright (`code-motion-graphics/assets/render.mjs`) or use Remotion; Mediabunny is for canvas/WebGL engines.

## Node / server

`@mediabunny/server` (NodeAV) adds encoders/decoders incl. transparent VP9 and ProRes, resize/rotate/crop, hardware acceleration (see `references/extensions/server.md`). ProRes *decode* in the browser: `@mediabunny/prores` (`references/extensions/prores.md`). For heavy batch finishing on a workstation the FFmpeg CLI (`media-ffmpeg`) is still simpler.

## Gotchas

- Timestamps are seconds (floats), not frames or microseconds.
- `videoSample.close()` / let sinks iterate; unclosed `VideoFrame`s exhaust GPU memory fast.
- Check `track.canDecode()` before decoding; some files carry codecs the browser lacks (ProRes, AC-3) → extensions or server.
- Frame-accurate seeking: `getSample(t)` returns the frame displayed at `t`; use exact `f / fps` timestamps to avoid off-by-one drift.
