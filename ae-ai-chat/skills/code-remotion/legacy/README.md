# Lineage: `remotion-latest-rules` (Remotion skills 4.0.533 delta)

The former `remotion-latest-rules` skill is preserved verbatim in `remotion-latest-rules.md` (same folder). Status against the 4.0.535 hub:

| Rule | Status |
|---|---|
| §1 fps from `useVideoConfig()`, expressions inline on JSX | Active (also in `remotion-markup/timing-props.md`) |
| §1 `premountFor={fps}` on every timed item | **Superseded**: 4.0.535 Studio premounts 2 s by default. Add `premountFor` only for a longer or explicit premount |
| §2 Timing props order and child-frame formula | Active (`remotion-markup/timing-props.md`) |
| §3 Interactive / editable structure, Pre-compose | Active (`remotion-markup/REFERENCE.md`, `remotion-interactivity/`) |
| §4 Motion blur, `HtmlInCanvasMotionBlur` | Active (`remotion-markup/html-in-canvas.md`) |
| §5 Effects catalogue | Active (`remotion-markup/effects.md`) |
| §5 **Effects must be inline** (no computed / conditional `effects` arrays) | **Active, only here**: not stated in the 4.0.535 hub. Always apply |
| §6 Maps examples (Cesium, MapTiler) | Active (`remotion-maps/`) |

