# AE engine rules in detail (AE-1 to AE-3)

## 1. Two languages in one file (AE-1)

The `.jsx` wrapper runs in ExtendScript, an ES3 engine. The strings it assigns to `.expression` run in After Effects' V8 JavaScript expression engine. Keep the two apart: modern syntax is legal only inside the string.

| In the ExtendScript wrapper | Use instead |
|---|---|
| `const`, `let` | `var`, declared at the top of the function |
| `(a) => a * 2` | `function (a) { return a * 2; }` |
| `` `x ${y}` `` | `"x " + y`; multi-line expressions as `[ "line 1", "line 2" ].join("\n")` |
| `.forEach`, `.map`, `.filter`, `.reduce`, `.some`, `.every`, `.find`, `.includes` | `for (i = 0; i < list.length; i++)` |
| `array.indexOf(x)` | a `for` loop (`String.indexOf` is fine) |
| `JSON.stringify` / `JSON.parse` | build the string by hand, or ship a json2 polyfill on purpose |
| `Object.keys`, `Array.isArray`, `Date.now`, `.trim()`, `.bind()` | `for (k in o)` with `hasOwnProperty`, `instanceof Array`, `new Date().getTime()` |
| default parameters, destructuring, spread, `for…of`, classes | explicit `if (x === undefined)`, indexed access, loops, constructor functions |
| trailing comma in `{ }` or `[ ]` | remove it: ExtendScript throws |
| a regex literal containing a quote | `split(...).join(...)`, or `new RegExp("...")` |

`try / catch / finally`, `push`, `unshift`, `join`, `split`, `Math.*`, `instanceof` are all ES3 and safe.

Keep the file ASCII. Non-ASCII characters in a `.jsx` saved without a BOM break on Windows.

Before assigning a V8 expression, check the project engine: `app.project.expressionEngine === "javascript-1.0"`. On `"extendscript"` stop and say so; switching the engine of an existing project can break its legacy expressions, so that is the user's call.

### Wrapper template

```jsx
(function () {
    var comp = app.project.activeItem;
    var i;
    var layer;
    if (!comp || !(comp instanceof CompItem)) { alert("Open a composition first."); return; }
    app.beginUndoGroup("SFT: describe the operation");
    try {
        for (i = 1; i <= comp.numLayers; i++) {                       // 1-based
            layer = comp.layer(i);
            // layer.property("ADBE Transform Group").property("ADBE Position") ...
        }
    } catch (e) {
        alert("Stopped: " + e.message + (e.line ? " (line " + e.line + ")" : ""));
    } finally {
        app.endUndoGroup();
    }
}());
```

With the library: `SFT_DS.run("SFT: name", function () { ... })` does the same and returns `{ ok, result, error }`.

## 2. matchNames (AE-2)

Display names change with the UI language and with user renames; matchNames do not. Layer, transform, camera and effect rows were checked against the After Effects Scripting Guide on 2026-11-11; shape and text rows come from property dumps.

| Group / property | matchName |
|---|---|
| Effects (layer) | `ADBE Effect Parade` |
| Masks | `ADBE Mask Parade` |
| Transform | `ADBE Transform Group` |
| Anchor Point (on a camera this slot is Point of Interest; confirm with `dump`) | `ADBE Anchor Point` |
| Position; X / Y / Z when separated | `ADBE Position`; `ADBE Position_0` / `_1` / `_2` |
| Scale, Opacity | `ADBE Scale`, `ADBE Opacity` |
| Orientation; X / Y / Z Rotation | `ADBE Orientation`; `ADBE Rotate X` / `Y` / `Z` |
| Camera Options | `ADBE Camera Options Group` |
| Zoom, Depth of Field, Focus Distance, Aperture, Blur Level | `ADBE Camera Zoom`, `ADBE Camera Depth of Field`, `ADBE Camera Focus Distance`, `ADBE Camera Aperture`, `ADBE Camera Blur Level` |
| Shape contents, group, group contents | `ADBE Root Vectors Group`, `ADBE Vector Group`, `ADBE Vectors Group` |
| Rectangle, fill, stroke, Trim Paths | `ADBE Vector Shape - Rect`, `ADBE Vector Graphic - Fill`, `ADBE Vector Graphic - Stroke`, `ADBE Vector Filter - Trim` |
| Text, Source Text | `ADBE Text Properties`, `ADBE Text Document` |

| Effect | matchName |
|---|---|
| Glow | `ADBE Glo2` |
| Drop Shadow / Radial Shadow | `ADBE Drop Shadow` / `ADBE Radial Shadow` |
| Gaussian Blur / Fast Box Blur / Directional Blur | `ADBE Gaussian Blur 2` / `ADBE Box Blur2` / `ADBE Motion Blur` |
| Channel Blur / Shift Channels / Set Channels | `ADBE Channel Blur` / `ADBE Shift Channels` / `ADBE Set Channels` |
| Transform (effect) / Offset / Optics Compensation | `ADBE Geometry2` / `ADBE Offset` / `ADBE Optics Compensation` |
| Camera Lens Blur / Exposure / Tint / Fill | `ADBE Camera Lens Blur` / `ADBE Exposure2` / `ADBE Tint` / `ADBE Fill` |
| Slider / Point / 3D Point / Angle / Checkbox / Color / Layer / Dropdown Control | `ADBE Slider Control` / `ADBE Point Control` / `ADBE Point3D Control` / `ADBE Angle Control` / `ADBE Checkbox Control` / `ADBE Color Control` / `ADBE Layer Control` / `ADBE Dropdown Control` |

**Effect parameters** follow the pattern `<effect matchName>-NNNN`, numbered in parameter order. The library uses `ADBE Slider Control-0001` (Slider), `ADBE Glo2-0003` / `-0004` (Glow Radius / Intensity), `ADBE Drop Shadow-0002` / `-0004` / `-0005` (Opacity / Distance / Softness) and `ADBE Channel Blur-0001` / `-0003` (Red / Blue Blurriness). These follow the convention and were not checked on a live build from this plugin: run `SFT_DS.dump(effect)` once on the installed After Effects version, and correct the `MN` table if a line differs. A wrong one fails loudly ("matchName not found: … step n"), never silently.

Third-party effects have their own matchNames (often without the `ADBE` prefix). Always `canAddProperty(matchName)` before `addProperty`, and fail with the name of the missing plug-in.

What is **not** a display-name lookup: a layer name (`comp.layer("Title")`), and a control this script created and named itself (`SFT DHO Frequency`). The linter accepts names that start with `ADBE `, `CC `, `SFT ` or `Pseudo/`.

## 3. Indices, references, undo (AE-3)

- `comp.layer(i)`, `group.property(i)`, `prop.keyTime(k)`, `app.project.item(i)`: all **1..n**. A plain JavaScript array you built yourself is still 0-based.
- A property reference becomes invalid when a sibling is added to its group. Set values straight after `addProperty`, then fetch again by matchName or by script-assigned name. To come back to a property after adding controls, store its `propertyIndex` path first (`pathOf` / `resolve` in the library).
- Cameras and lights have no effect group: controls for them live on a null (`SFT CTRL`, created by `ctrlNull`).
- One undo group per user-visible operation. Standalone file: the script opens and closes it. Through an AE bridge whose call is already one undo group: do not open another (`SFT_DS.run(name, fn, false)`, lint with `--bridge`). Either way the body sits in `try/catch`, and `endUndoGroup` runs in `finally` so a failure cannot leave the group open.
- After a failed run, inspect before retrying: a partial build usually shows up as duplicate layers.

## 4. Expression layer conventions

- Result = the last evaluated statement. Compute into `out` and end with `out;` so both branches of an `if` return something.
- Controls by script-assigned name plus index: `effect("SFT Drift Rate")(1)`. Never `("Slider")`: that is the display name.
- Scale `value` instead of writing absolute numbers into effect parameters whose script units differ from the UI (Glow threshold, Drop Shadow opacity).
- Vector maths with `add`, `sub`, `mul`, `length`; world space with `toWorld(anchorPoint, t)`. `+` on arrays does not add them in the V8 engine.
- Deterministic only: `seedRandom(seed, true)` before `random()`. No `Math.random()`, no wall clock.
- `thisComp.activeCamera` throws when the comp has no camera: wrap it in `try/catch` and fall back to `value`.
- `linear()` as a motion curve is banned (DS-1). As a unit remap, say so in a comment.

## 5. Lint

```bash
python3 scripts/es3_lint.py my_rig.jsx            # standalone file
python3 scripts/es3_lint.py --bridge snippet.jsx  # bridge owns the undo group
python3 scripts/es3_lint.py --selftest
```

Errors (`E-`) fail the gate: `E-ES3-*` syntax outside strings, `E-AE-DISPLAYNAME`, `E-AE-INDEX0`, `E-AE-UNDO` / `E-AE-UNDO-NESTED` / `E-AE-TRY`, `E-MOTION-LINEAR`, `E-RANDOM`. Warnings (`W-MOTION-F9`, `W-EXPR-LINEAR`) need a reason in the notes. It is a regex scan, not a parser: it cannot see a display name passed through a variable.

## Sources

- After Effects Scripting Guide, match names: `ae-scripting.docsforadobe.dev/matchnames/layer/avlayer/`, `/layer/cameralayer/`, `/effects/firstparty/`
- After Effects Scripting Guide, `KeyframeEase` object: `ae-scripting.docsforadobe.dev/other/keyframeease/`
