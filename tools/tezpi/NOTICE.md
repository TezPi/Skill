# Vendored from the tezpi-motion plugin

`seam-gate.mjs`, `seam-stamp.mjs` and `seam-gate.md` come from the tezpi-motion plugin
(`skills/motion-doctrine/scripts/`, `references/`), which takes them from
github.com/heygen-com/hyperframes `.claude/skills` v0.8.140. Licensed Apache-2.0; see
`LICENSE-hyperframes`.

Vendored so every session runs the same gate with zero lookup into the synced plugin path.
Call them through `tools/seam.mjs` (`npm run seam:*`), which pins the preview server to
the film's own `hyperframes@<version>`.

## Modifications

| File | Change |
| --- | --- |
| `seam-gate.mjs` `findChrome()` | Also discovers the pinned build in `~/.cache/hyperframes/chrome/chrome-headless-shell/` (installed by `npx hyperframes browser ensure`), so the gate measures with the same Chrome that renders. |
| `seam-gate.mjs` `findChrome()` | `CHROME_PATH` pointing at a headless-shell binary no longer receives `--headless=new`. |
| `seam-gate.mjs` `launchChrome()` | Adds `--no-sandbox` only when running as root (cloud/CI containers), where Chrome otherwise refuses to start. |

`seam-stamp.mjs` is unmodified. Re-vendor after a plugin update and re-apply the table above.
