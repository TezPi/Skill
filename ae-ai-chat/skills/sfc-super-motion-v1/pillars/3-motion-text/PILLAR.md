---
name: motion-text-custom
description: Design, describe, mix and customize motion typography for 2D, 2.5D and 3D video titles, captions and content presentations, using one million detailed compositional motion specifications and an extensible motion grammar.
---

# Motion Text Custom

Turn exact content and communication intent into a concrete, reproducible motion specification. The entire skill is written in English; it can animate text in other languages without translating or altering that text.

## What the million contains

The full catalog contains **1,000,000 individually addressable, self-contained detailed descriptions**: 100 authored operator families x 10 groupings x 10 activation orders x 10 timing profiles x 10 compositions. Each record explains its actual mechanism, movement equation, channels, grouping, activation, layout, timing, read pose, exit, 3D setup when applicable, constraints and mixing/customization options. Records are stored in 100 compressed JSONL shards.

The sources support underlying techniques and catalog taxonomy. These million compositions are original synthesized specifications; they are not a million separately researched commercial presets. They are unrendered and not individually visually reviewed. Some need assets or metadata; different IDs can yield identical visuals on short or single-unit text. Preserve these distinctions when reporting counts or quality.

## Work from a brief

1. Establish exact text, semantic intent, audience, industry, aspect ratio, duration, voice/beat cues, target engine and motion intensity. State reasonable assumptions and continue when they do not affect correctness.
2. Select two or three meaningfully different mechanisms and explain their fit. Read [domain profiles](data/domains.json) and [grammar](references/grammar.md) as needed. Optional lookup: `python scripts/motion_catalog.py query --domain education --dimension 2d --engine remotion`.
3. Retrieve a detailed record with `describe ID`, or resolve an input-specific plan with `resolve ID --text "Exact content"`. Read [timing and schema](references/schema-timing.md). Supply actual grouping boundaries, font metrics, paths and rigs when required. A JSON plan is not a rendered project.
4. Read only the relevant [engine mapping](references/engines.md), [3D contract](references/3d.md) and [content/readability rules](references/semantics-accessibility.md). Distinguish flat perspective planes from volumetric glyph geometry. Retain unresolved requirements explicitly.
5. **You may freely mix and create motion beyond the catalog within the user's brief, without asking permission for each variant.** Follow [custom extension](references/custom-extension.md). Change paths, deformation, topology, relations, staging or camera geometry deliberately; retain parent IDs, equations, channel ownership and a semantic rationale.
6. Check exact content, units, time budgets, final pose, constraints and degeneracy. Supply an appropriate reduced/static alternative. When rendering is requested and available, inspect visible onset, maximum displacement, middle, start/end of reading and exit; report actual checks and remaining limits.

## Deliver a useful specification

Return brief assumptions, a reasoned shortlist, one selected detailed blueprint, optional custom variants, fallback and validation status. Include entrance/read/exit timing, grouping, trajectories with units, easing, pivot/transform hierarchy, layout targets, compositing and camera/geometry/material/light definitions for spatial work. Use the detailed record as a starting point; adapt it to actual content.

Python is optional. An AI can read the registry and references directly; the CLI provides deterministic lookup and frame planning. Do not load one million records into the context at once. See [User guide](USER_GUIDE.md), [operator manual](references/operator-manual.md), [worked blueprints](examples/blueprints.json), [domain briefs](examples/domain-briefs.md) and [research sources](references/research-sources.md).
