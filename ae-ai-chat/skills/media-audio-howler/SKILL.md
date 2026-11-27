---
name: media-audio-howler
description: "Interactive web audio with howler.js 2.2: UI/micro-interaction sound design, sound sprites, pooling, fades, rate, seek, loops, spatial/stereo panning, mobile autoplay unlock, format fallbacks (webm + mp3), plus syncing sound to GSAP/anime.js/Motion animations and Rive/Lottie events; and when NOT to use it (rendered video audio goes through Web Audio offline or FFmpeg). Use when a website, app, game HUD or interactive piece needs click/hover/whoosh sounds, ambient loops, audio sprites, spatial audio, or sound synced to on-screen motion."
---

# Interactive audio (howler.js)

Source: `goldfire/howler.js` 2.2.4 README (MIT). Howler is **playback for live, interactive pages**. Rendered video audio is offline work: place SFX on frames with FFmpeg (`media-ffmpeg` → `adelay`/`amix`, loudness), Remotion `<Audio>`/`@remotion/sfx` (`code-remotion`), or HyperFrames audio (`code-hyperframes`). Never rely on wall-clock playback inside a frame render.

## Setup

```js
import { Howl, Howler } from 'howler';

const ui = new Howl({
  src: ['/sfx/ui.webm', '/sfx/ui.mp3'],      // first playable wins: webm then mp3
  sprite: {                                   // [offsetMs, durationMs, loop?]
    tap:   [0, 120],
    hover: [200, 80],
    whoosh:[400, 450],
    success:[1000, 700],
  },
  volume: 0.5,
  pool: 8,                                    // concurrent voices for rapid taps
});

button.addEventListener('pointerdown', () => ui.play('tap'));
```

- Build sprites with `audiosprite`; encode webm with cues so Firefox can seek: `ffmpeg -i in.wav -dash 1 out.webm`.
- `ui.fade(0, 1, 400, id)`, `ui.rate(1.2, id)`, `ui.seek(1.5, id)`, `ui.loop(true, id)`; `play()` returns the voice `id` to target one instance.
- Long music/ambience: `html5: true` (streams, no full decode) at the cost of precise timing.
- Global: `Howler.volume(0.8)`, `Howler.mute(true)`, `Howler.ctx` (Web Audio context, e.g. to add an AnalyserNode for audio-reactive visuals).
- Spatial plugin: `sound.stereo(-0.5, id)`, `sound.pos(x, y, z, id)` for HUD/game positioning.

## Autoplay and mobile

Audio is locked until a user gesture; howler unlocks on the first `touchend`/click. Autoplaying on load: listen for `playerror`, then `sound.once('unlock', () => sound.play())`. Always ship a visible mute toggle and remember the choice (localStorage).

## Sound design rules for UI motion (SFT)

- Sound confirms an action; it never decorates. Tap/press, success, error, toggle, drag-snap, page transition: yes. Hover on every element, scroll ticks: no (fatigue).
- Fire the sound at the **moment of contact**, not at animation start: press = pointerdown; a card landing = when the spring settles (GSAP: position the `call()` at the land time; anime.js: `tl.call(fn, '<')` = end of the previous animation; Motion: `onAnimationComplete`). Whooshes start ~40-80 ms before the motion peak.
- Short (40-150 ms) for UI, quiet (-18 to -24 dBFS peaks under page context), no long tails on repeated actions.
- Respect `prefers-reduced-motion` as a hint to tone down sound too, and keep everything usable muted (audio is never the only feedback channel; a11y).
- Rive/Lottie events: Rive `EventType.RiveEvent` (`anim-rive`) or dotLottie `addEventListener('complete' | 'frame', ...)` (`anim-lottie`) → `ui.play(...)`.
- Clean up: `sound.unload()` on route change for large files; sprites for UI stay loaded.

For rendered videos, SFX timing laws (transient peak on the action frame, duck music 12-18 dB under VO, -14 LUFS master) are in `code-motion-graphics` and `type-spatial-hud-sfx`.
