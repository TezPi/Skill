# Engine mapping and implementation limits

All targets can receive a descriptive specification. Implement only features actually available in the selected application/version. This package includes no native AE/Blender/C4D projects and no renderer.

| Target | Practical mapping | Conditions |
|---|---|---|
| After Effects text | Text animators, range/expression selectors, transforms, masks, parenting | Native char/word/line groups differ from semantic/phrase groups; use explicit ranges/layers when needed. |
| After Effects 3D | Planes, cameras and lights; supported Advanced 3D/C4D text extrusion | Research accessed 2026-10-28 documents extrusion in current renderers; verify installed version and material/deformation limits. Custom fracture/physics is not implied. |
| GSAP | SplitText wrappers, transforms, stagger, timeline | Load fonts before splitting, handle reflow and cleanup, preserve accessible source text. CSS perspective is planar 2.5D. |
| Remotion | Compute properties from current frame; explicit interpolation and spring | Avoid wall-clock state/randomness. Standard HTML/CSS text alone does not create solid glyph geometry. |
| Three.js | TextGeometry/meshes, paths, camera and lights | One TextGeometry string is not automatically a per-grapheme rig. Supply shaping/grouping and glyph correspondence. Sprite is a billboard plane and cannot cast shadows. |
| Blender | Shaped text/curves or supplied meshes, transforms, modifiers and camera | Exact nodes/API must be verified in the installed version. Three Blender manual sources were index-only during research. |
| Cinema 4D | Text Object, MoGraph transforms/fields/effectors, extrusion and camera | Per-unit grouping, pivots, subdivisions, topology and renderer materials need actual setup. |
| Premiere/CapCut | Supported title controls or imported rendered/native templates | These CLI adapters deliberately accept canvas 2D only. A plugin-specific route needs a separately verified adapter. |

CLI engine acceptance denotes a dimension-level route, not universal support for every rig. Keep missing paths, topology, lights, collision caches or metadata explicit. If a target cannot implement a mechanism, choose a compatible renderer or propose a clearly labeled different recipe with parent ID and reason.
