#!/usr/bin/env python3
"""foundation_mix_lint.py - one gate for a motion_plan.json inside SFT Super Motion Studio V2.

Runs the Motion Foundation Core contract (validate_plan.py, unchanged) and then the V2 rules
the contract does not know: Pillar 2 guardrails, the Depth & Soul laws (DS-1..3) and the
senior-editor tells that can be read from a plan. See ../MIX.md for the fields and rulings.

  python3 foundation_mix_lint.py motion_plan.json --phase edit     exit 0 = gate passed
  python3 foundation_mix_lint.py motion_plan.json --phase export
  python3 foundation_mix_lint.py --selftest

Errors (E-) block the gate. Warnings (W-) need a reason in the editor's notes.
It reads declared numbers only: it does not look at a frame.
"""
import json
import re
import sys
from copy import deepcopy
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from validate_plan import validate  # noqa: E402

THEME = HERE.parents[1] / "sfc-super-motion-v1" / "pillars" / "2-shape-graph" / "theme.ts"
FALLBACK_CURVES = """EASE_IN_OUT_SINE SMOOTH_50_50 MEDIUM_DRAMA_66_66 PRO_STANDARD_75_75 HIGH_CONTRAST_80_80
EXTREME_SNAP_90_90 EASE_OUT_QUAD EASE_OUT_CUBIC SNAPPY_ENTER_20_80 PUNCHY_ENTER_15_85 EXPLOSIVE_ENTER_10_90
APPLE_IOS_SHEET M3_EMPHASIZED_DECEL EASE_IN_QUAD FAST_EXIT_80_20 WHIP_EXIT_85_15 M3_EMPHASIZED_ACCEL
EASE_OUT_BACK_OVERSHOOT EASE_IN_BACK_ANTICIPATION EASE_IN_OUT_BACK_FULL""".split()
FALLBACK_SPRINGS = "SNAPPY_UI IOS_SHEET SAAS_CARD CRITICALLY_DAMPED PLAYFUL_POP ELASTIC_CARTOON HEAVY_CINEMATIC".split()
EXTRA = {"EXPO_OUT_PREMIUM", "SPRING_APPROACH", "HOLD"}   # ae-automation-architect tokens + stepped hold
EXIT_TOKENS = {"M3_EMPHASIZED_ACCEL", "FAST_EXIT_80_20", "WHIP_EXIT_85_15", "EASE_IN_QUAD", "HOLD"}


def tokens():
    """Curve and spring names from Pillar 2 theme.ts, so the list cannot drift from the source."""
    curves, springs = list(FALLBACK_CURVES), list(FALLBACK_SPRINGS)
    try:
        text = THEME.read_text(encoding="utf-8")
        block = lambda name: re.search(r"export const %s = \{(.*?)\n\} as const" % name, text, re.S)
        c, s = block("MOTION_CURVES"), block("SPRING_PRESETS")
        if c and s:
            curves = re.findall(r"^\s{2}([A-Z][A-Z0-9_]+):", c.group(1), re.M)
            springs = re.findall(r"^\s{2}([A-Z][A-Z0-9_]+):", s.group(1), re.M)
    except OSError:
        pass
    spring_names = set(springs) | {"SPRING_" + s for s in springs}
    overshoot = {t for t in curves if "BACK" in t} | {s for s in spring_names if "CRITICALLY_DAMPED" not in s} | {"SPRING_APPROACH"}
    return set(curves) | spring_names | EXTRA, overshoot


def span(interval):
    ok = isinstance(interval, list) and len(interval) == 2 and all(isinstance(v, int) for v in interval)
    return (interval[0], interval[1]) if ok else None


def mix_lint(plan):
    known, overshoot = tokens()
    found = []
    add = lambda code, path, msg: found.append({"code": code, "path": path, "message": msg})
    out = plan.get("output", {}) if isinstance(plan, dict) else {}
    fps = (out.get("fps_num") or 30) / (out.get("fps_den") or 1)
    mult = 2 if fps > 40 else 1
    scenes = [s for s in plan.get("scenes", []) if isinstance(s, dict)] if isinstance(plan, dict) else []

    durations = [s["end"] - s["start"] for s in scenes if isinstance(s.get("start"), int) and isinstance(s.get("end"), int)]
    if len(durations) >= 3 and len(set(durations)) == 1:
        add("W-ME01", "scenes", "every scene is %d frames: take durations from the beat map, not a default" % durations[0])

    for si, scene in enumerate(scenes):
        sp = "scenes[%d]" % si
        entries, exits, signatures, moving = [], [], [], False
        for li, layer in enumerate(l for l in scene.get("layers", []) if isinstance(l, dict)):
            lp = "%s.layers[%d]" % (sp, li)
            motion = layer.get("motion", {}) if isinstance(layer.get("motion"), dict) else {}
            keys = [k for k in motion.get("keyframes", []) if isinstance(k, dict)]
            props = sorted({k.get("property") for k in keys if isinstance(k.get("property"), str)})
            entry, exit_ = span(motion.get("entry")), span(motion.get("exit"))
            token, exit_token = motion.get("token"), motion.get("exit_token")
            words = " ".join(str(motion.get(f, "")) for f in ("token", "exit_token", "easing")).lower()
            if re.search(r"\blinear\b", words) and not str(motion.get("mechanical_reason", "")).strip():
                add("E-LINEAR", lp + ".motion", "linear motion is banned (DS-1); constant-rate motion needs mechanical_reason")
            if entry and entry[1] > entry[0]:
                moving = True
                entries.append((entry[0], motion.get("group", "main"), layer.get("id")))
                if token not in known:
                    add("E-TOKEN", lp + ".motion.token", "name a Pillar 2 curve or spring, EXPO_OUT_PREMIUM or SPRING_APPROACH (got %r)" % (token,))
                elif token in overshoot and (set(props) <= {"opacity"} or set(props) & {"numeric_value", "path_end"} or layer.get("role") in {"data", "counter"}):
                    add("E-GUARD", lp + ".motion.token", "no overshoot on opacity, colour or data values: use a monotone curve")
                if layer.get("kind") == "text":
                    signatures.append((tuple(props), token))
            scale0 = next((k.get("value") for k in keys if k.get("property") == "scale"), None)
            if isinstance(scale0, list) and scale0 and min(scale0[:2]) < 90 and layer.get("role") not in {"data", "particle"}:
                add("E-FLOOR", lp + ".motion.keyframes", "entrance scale starts under 90 %: scale floor is 90 unless the layer is a particle or a data mark")
            if exit_ and exit_[1] > exit_[0]:
                exits.append(exit_[0])
                if exit_token not in EXIT_TOKENS:
                    add("E-EXIT-TOKEN", lp + ".motion.exit_token", "exits accelerate out with one of %s (got %r)" % (", ".join(sorted(EXIT_TOKENS)), exit_token))
                if entry and entry[1] > entry[0] and (exit_[1] - exit_[0]) > 0.7 * (entry[1] - entry[0]):
                    add("W-EXIT-LONG", lp + ".motion.exit", "exit %d f vs entry %d f: exits run 30-50 %% shorter" % (exit_[1] - exit_[0], entry[1] - entry[0]))

        starts = sorted(e[0] for e in entries)
        if len(starts) != len(set(starts)):
            add("E-DS2-SIMULTANEOUS", sp, "two layers start their entrance on the same frame: offset them 2-4 frames (DS-2)")
        for group in sorted({e[1] for e in entries}):
            g = sorted(e[0] for e in entries if e[1] == group)
            gaps = [b - a for a, b in zip(g, g[1:])]
            if any(x and not 2 * mult <= x <= 4 * mult for x in gaps):
                add("W-DS2-WINDOW", sp, "group %r gaps %s f: the window is %d-%d f; a layer that waits for a cue belongs to its own group" % (group, gaps, 2 * mult, 4 * mult))
            if g and g[-1] - g[0] > round(0.4 * fps):
                add("W-DS2-CAP", sp, "group %r stagger spans %d f: Pillar 2 caps a group at %d f" % (group, g[-1] - g[0], round(0.4 * fps)))
        if len(set(exits)) > 1:
            add("W-EXIT-STAGGER", sp, "exits start on %d different frames: leave together, no stagger on exits" % len(set(exits)))
        if len(signatures) >= 3 and len(set(signatures)) == 1:
            add("W-ME03", sp, "every text layer enters the same way with the same curve: give hero, support and context different mechanisms")
        secondary = scene.get("secondary")
        has_secondary = isinstance(secondary, dict) and all(str(secondary.get(k, "")).strip() for k in ("system", "coupled_to", "budget"))
        if moving and not has_secondary and not str(scene.get("secondary_none_reason", "")).strip():
            add("W-DS3", sp, "moving shot without a coupled secondary system: add secondary {system, coupled_to, budget} or secondary_none_reason")
    return found


def run(plan, phase):
    report = validate(plan)
    mix = mix_lint(plan)
    errors = [f for f in mix if f["code"].startswith("E-")]
    report["mix_errors"] = errors
    report["mix_warnings"] = [f for f in mix if f["code"].startswith("W-")]
    report["ready_to_edit"] = bool(report.get("ready_to_edit")) and not errors
    report["ready_to_export"] = bool(report.get("ready_to_export")) and not errors
    return report, 0 if report["ready_to_" + phase] else 1


def selftest():
    good = json.loads((HERE.parent / "assets" / "mix-example-plan.json").read_text(encoding="utf-8"))
    report, code = run(good, "edit")
    assert code == 0 and not report["mix_errors"] and not report["mix_warnings"], report
    layer = lambda p, s=0, l=1: p["scenes"][s]["layers"][l]
    cases = {}
    p = deepcopy(good); layer(p)["motion"]["token"] = "ease-out"; cases["E-TOKEN"] = p
    p = deepcopy(good); layer(p)["motion"]["easing"] = "linear"; cases["E-LINEAR"] = p
    p = deepcopy(good); layer(p)["motion"]["token"] = "SPRING_PLAYFUL_POP"; layer(p)["motion"]["keyframes"] = [k for k in layer(p)["motion"]["keyframes"] if k["property"] == "opacity"]; cases["E-GUARD"] = p
    p = deepcopy(good); layer(p, 0, 0)["motion"]["keyframes"][0]["value"] = [0, 0]; cases["E-FLOOR"] = p
    p = deepcopy(good); layer(p)["motion"]["exit_token"] = "EXPO_OUT_PREMIUM"; cases["E-EXIT-TOKEN"] = p
    p = deepcopy(good); layer(p, 0, 2)["motion"]["entry"][0] = layer(p)["motion"]["entry"][0]; cases["E-DS2-SIMULTANEOUS"] = p
    p = deepcopy(good); layer(p, 0, 2)["motion"]["entry"] = [14, 30]; cases["W-DS2-WINDOW"] = p
    p = deepcopy(good); layer(p)["motion"]["exit"] = [86, 104]; cases["W-EXIT-LONG"] = p
    p = deepcopy(good); layer(p)["motion"]["exit"] = [92, 102]; cases["W-EXIT-STAGGER"] = p
    p = deepcopy(good); del p["scenes"][0]["secondary"]; cases["W-DS3"] = p
    p = deepcopy(good); p["scenes"].append(deepcopy(p["scenes"][0])); [s.update(start=i * 108, end=(i + 1) * 108) for i, s in enumerate(p["scenes"])]; cases["W-ME01"] = p
    for code_, plan in cases.items():
        codes = [f["code"] for f in mix_lint(plan)]
        assert code_ in codes, (code_, codes)
    original = json.loads((HERE.parent / "assets" / "example-create-plan.json").read_text(encoding="utf-8"))
    assert validate(original)["ready_to_edit"] and run(original, "edit")[1] == 1, "the 1.0 example passes the contract and fails the V2 mix on purpose"
    print("foundation_mix_lint selftest: clean plan passes, %d rule cases caught, 1.0 example fails the mix as documented" % len(cases))


def main(argv):
    if "--selftest" in argv:
        selftest()
        return 0
    phase = "export" if "export" in argv else "edit"
    paths = [a for a in argv if a.endswith(".json")]
    if len(paths) != 1:
        print(__doc__)
        return 2
    try:
        plan = json.loads(Path(paths[0]).read_text(encoding="utf-8-sig"))
    except (OSError, ValueError) as exc:
        print(json.dumps({"ready_to_edit": False, "ready_to_export": False, "error": str(exc)}, ensure_ascii=False))
        return 1
    report, code = run(plan, phase)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return code


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
