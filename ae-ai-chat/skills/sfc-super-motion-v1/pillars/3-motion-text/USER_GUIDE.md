# Motion Text Custom: user guide

Keep this folder intact and give `SKILL.md` to your AI. If your AI application supports skills, copy the folder into its skill location using that application's normal procedure. This archive is portable and does not install itself.

The full package includes one million detailed descriptions. The compact package includes the same definitions and resolver and can reproduce any description without storing all shards. No external Python libraries are needed. Neither package renders video by itself.

## Start with a content brief

> Read motion-text-custom/SKILL.md. Use this exact text: "Ideas become clearer through motion." Create a 1080x1920 educational video at 30 fps with a 7-second scene budget. Suggest three different mechanisms, explain their fit, then produce one detailed entrance/read/exit blueprint. Preserve the text exactly. Add one custom structure beyond the catalog and a reduced/static alternative. State what remains unrendered.

> Read motion-text-custom. Design a real 3D luxury title reading "FUTURE", targeting Blender. Specify actual glyph volume, camera, lights, material, units, framing and keyframe timing. Compare two rigs and develop one. Keep unsupported node/API details conditional until verified in the installed engine.

> Read motion-text-custom. Build ten finance-explainer scenes. Keep all numbers, periods, signs, units and qualifiers intact. Vary the motion according to semantic purpose and keep enough stable reading time. Do not apply the same effect to every scene.

## Commands

Run these from the skill folder with Python 3:

```text
python scripts/motion_catalog.py describe MT-0021000 --out detail.json
python scripts/motion_catalog.py query --domain education --dimension 2d --engine remotion
python scripts/motion_catalog.py resolve MT-0001000 --text "Ideas become clearer" --engine remotion --fps 30 --hold 2.5
python scripts/motion_catalog.py resolve MT-0701000 --text "FUTURE" --engine blender --fps 24
python scripts/motion_catalog.py sample --count 3 --seed 7 --out sample.json
python scripts/motion_catalog.py custom --parents MT-0121000 MT-0701000 --stages-file examples/custom-stages.json --rationale "Reveal the claim before giving it physical depth" --out custom.json
python scripts/motion_catalog.py selftest
python scripts/motion_catalog.py validate --full
```

`--groups-file` accepts a JSON array of source-preserving substrings. For phrase, line, grapheme, semantic and paired modes, provide the required boundaries instead of expecting an unsafe guess. `--priorities-file` supplies a numeric priority per unit for semantic traversal. `--assets` declares available rig inputs; it does not prove the assets have been verified. `--scene-seconds` rejects insufficient time and extends the read hold to fill a longer budget.

## Understand one ID

IDs range from MT-0000000 to MT-0999999. The numeric address is `family*10000 + grouping*1000 + traversal*100 + temporal*10 + composition`. Family indices range 0..99 and other factors 0..9. For example, MT-0701000 means family F070, G01, O00, T00, C00. `describe` expands every field directly; no shard scan is necessary.

Read a shard as UTF-8 JSON Lines inside gzip. Each line is a complete detailed motion description, not just a list of factor IDs. Actual text/font/paths still need binding. See `catalog/manifest.json` for the real stored count, shard hashes and declared validation limits. The full scan reads every record; visual quality still requires actual rendering and review.

To regenerate the full catalog from the compact package, use `python scripts/motion_catalog.py generate`, then validate. This produces substantial expanded data; the gzip files preserve detailed repeated specifications efficiently.
