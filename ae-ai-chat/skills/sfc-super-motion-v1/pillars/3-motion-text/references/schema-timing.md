# Schema, coordinates and timing

## Detailed catalog record

Schema 2.0 stores ID/title/dimension/factors; the complete operation and equation; grouping, activation and composition definitions; coordinate conventions; a timing template; final read pose and exit; spatial scene requirements; conditions; mixing/custom guidance; exact-content invariants; technical-source IDs and explicit unrendered status. Read a record on its own to understand the mechanism. Source IDs can be expanded through `data/sources.json`.

An input-specific blueprint adds exact source text, actual supplied groups, per-unit activation ranks, frame intervals, rig-control samples, suggested anchors, camera/geometry/material/light fields, unmet requirements and validation. Sample values are controls for the specified rig, not a universal renderer or baked mesh trajectory.

## Units and layout

Canvas anchors use normalized coordinates [0,1], origin top-left, x right, y down. Local font offsets use nominal em, not cap height. World space is right-handed: x right, y up, z toward camera; 1 wu = 1 nominal em is this skill's adapter convention. Convert units/axis signs explicitly for each engine. Fit real font bounds before rendering; suggested anchors are not measured layout.

Initial spatial camera: position (0,0,12) wu, target origin, vertical FOV 35 degrees, near .1/far100 wu. Fit distance from measured frame height with d=height/(2*tan(FOV_y/2)); also fit width/aspect. Orthographic treatments require orthographic scale fitting instead. Initial 3D depth .16 em and bevel .015 em must be reduced where thin strokes/counters require it. These values are authored heuristics.

## Frame contract

Frames start at zero. Intervals are [start,end); end is the first frame after a phase. Convert seconds with round(seconds*fps). Each unit's start is its activation rank times the stagger. The nominal stagger is .055 seconds, rounded to at least one frame. Long strings may still need phrase grouping or multiple scenes; do not cut reading time silently.

The global read interval starts after the last entrance finishes. The initial two-second hold is an editable heuristic; content complexity, audience, speech and competing visuals determine the actual requirement. T09 adds one 4 percent scale accent in the middle of that interval, so it is near-stable rather than completely static; remove the accent for dense or critical reading. Exit follows the whole read interval. Portal transit is a special exit rig after the readable title has been held.

Temporal profiles store duration and curve separately. Clamp opacity, mask, reveal and bounded progress. Families with an intrinsic spring should not receive a second spring distortion; temporal profiles may still adjust their duration. A longer requested scene budget extends the reading interval; an insufficient budget is rejected.
