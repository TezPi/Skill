#!/usr/bin/env python3
"""es3_lint.py - gate for After Effects ExtendScript written under ae-automation-architect.

Checks the ExtendScript layer of a .jsx file (code outside string literals) against the
five engine rules and the motion laws. Expression code lives inside string literals and is
only checked for nondeterminism and linear() used as a motion curve.

  python3 es3_lint.py file.jsx [more.jsx]     exit 0 = no errors
  python3 es3_lint.py --bridge snippet.jsx    code sent through an AE bridge that owns undo
  python3 es3_lint.py --selftest

ponytail: regex scan, not a parser. A regex literal that contains a quote character can
confuse the string scanner; build such patterns with split/join or new RegExp("...").
"""
import re
import sys

OWNED_PREFIXES = ("ADBE ", "CC ", "SFT ", "Pseudo/")   # matchNames, or names this plugin assigns

ES3_RULES = [
    ("E-ES3-DECL", r"\b(?:const|let)\s+[A-Za-z_$\[{]", "const/let: use var (AE-1)"),
    ("E-ES3-ARROW", r"=>", "arrow function: use function () {} (AE-1)"),
    ("E-ES3-TEMPLATE", r"`", "template literal: concatenate strings (AE-1)"),
    ("E-ES3-ITER", r"\.(?:forEach|map|filter|reduce|some|every|find|findIndex|includes|flatMap)\s*\(",
     "array iteration method: use a for loop (AE-1)"),
    ("E-ES3-API", r"\b(?:JSON\.|Object\.(?:keys|values|entries|assign|freeze)|Array\.(?:isArray|from)|Date\.now|Promise\b|Symbol\b)",
     "not available in ExtendScript ES3 (AE-1)"),
    ("E-ES3-STRFN", r"\.(?:trim|startsWith|endsWith|padStart|padEnd|repeat|bind)\s*\(", "ES5+ method (AE-1)"),
    ("E-ES3-SYNTAX", r"\bclass\s+[A-Za-z_$]|\basync\s+function|\bawait\s|\.\.\.[A-Za-z_$\[]|\bfor\s*\([^;)]*\sof\s",
     "ES2015+ syntax (AE-1)"),
    ("E-ES3-TRAILING-COMMA", r",\s*[}\]]", "trailing comma breaks ExtendScript (AE-1)"),
    ("E-AE-INDEX0", r"\.(?:layer|item|property|key\w*)\(\s*0\s*[,)]|\.layers\[\s*0\s*\]",
     "index 0: AE collections are 1-based (AE-3)"),
    ("E-MOTION-LINEAR", r"KeyframeInterpolationType\.LINEAR", "linear keyframes are banned (DS-1 / AE-4)"),
    ("W-MOTION-F9", r"new\s+KeyframeEase\(\s*0\s*,\s*33(?:\.\d+)?\s*\)",
     "default Easy Ease 0 / 33.33: give explicit speeds and influences (DS-1 / AE-4)"),
    ("E-RANDOM", r"Math\.random\s*\(", "unseeded randomness: use a seeded hash"),
]
EXPR_RULES = [
    ("E-RANDOM", r"Math\.random\s*\(", "unseeded randomness in an expression: use seedRandom(seed, true)"),
    ("W-EXPR-LINEAR", r"(?<![\w.])linear\s*\(", "linear() as a motion curve is banned; as a unit remap, say so in a comment"),
]
LOOKUP = re.compile(r"\.(property|effect|addProperty|canAddProperty)\(\s*[\"']\x00(\d+)\x00[\"']")
WRITES = re.compile(r"\.(?:addProperty|setValue\w*|setTemporalEaseAtKey|remove|add(?:Comp|Solid|Null|Shape|Text|Camera|Light)?)\s*\(|\.expression\s*=")


def split_code(src):
    """Return (code with strings replaced by NUL-delimited indices and comments blanked, strings)."""
    out, strings, i, n = [], [], 0, len(src)
    while i < n:
        c, nxt = src[i], src[i + 1] if i + 1 < n else ""
        if c == "/" and nxt == "/":
            while i < n and src[i] != "\n":
                i += 1
        elif c == "/" and nxt == "*":
            j = src.find("*/", i + 2)
            j = n if j < 0 else j + 2
            out.append("\n" * src.count("\n", i, j))
            i = j
        elif c in "\"'":
            j, buf = i + 1, []
            while j < n and src[j] != c:
                if src[j] == "\\" and j + 1 < n:
                    buf.append(src[j:j + 2])
                    j += 2
                else:
                    buf.append(src[j])
                    j += 1
            strings.append("".join(buf))
            out.append("%s\x00%d\x00%s" % (c, len(strings) - 1, c))
            i = j + 1
        else:
            out.append(c)
            i += 1
    return "".join(out), strings


def lint(src, bridge=False):
    code, strings = split_code(src)
    found = []

    def line_of(pos):
        return code.count("\n", 0, pos) + 1

    for rule, pattern, msg in ES3_RULES:
        for m in re.finditer(pattern, code):
            found.append((line_of(m.start()), rule, msg))
    for m in LOOKUP.finditer(code):
        name = strings[int(m.group(2))]
        if not name.startswith(OWNED_PREFIXES):
            found.append((line_of(m.start()), "E-AE-DISPLAYNAME",
                          "%s(\"%s\"): reference by matchName, not display name (AE-2)" % (m.group(1), name)))
    for s in strings:
        for rule, pattern, msg in EXPR_RULES:
            if re.search(pattern, s):
                found.append((0, rule, msg + " -> " + s.strip()[:60]))
    if WRITES.search(code):
        has_undo = "app.beginUndoGroup" in code and "app.endUndoGroup" in code
        has_try = re.search(r"\btry\s*\{", code) and re.search(r"\bcatch\s*\(", code)
        uses_runner = re.search(r"SFT_DS\.run\s*\(", code)
        if bridge:
            if has_undo:
                found.append((0, "E-AE-UNDO-NESTED", "the bridge owns the undo group: remove app.beginUndoGroup (AE-3)"))
            if not (has_try or uses_runner):
                found.append((0, "E-AE-TRY", "wrap the operations in try/catch or SFT_DS.run(name, fn, false) (AE-3)"))
        elif not uses_runner and not (has_undo and has_try):
            found.append((0, "E-AE-UNDO", "writes need app.beginUndoGroup/endUndoGroup + try/catch, or SFT_DS.run (AE-3)"))
    return sorted(found)


def report(path, found):
    for line, rule, msg in found:
        print("%s:%s  %s  %s" % (path, line or "-", rule, msg))
    return any(rule.startswith("E-") for _, rule, _ in found)


def selftest():
    good = (
        "(function () {\n"
        "  app.beginUndoGroup('x');\n"
        "  try {\n"
        "    var fx = layer.property('ADBE Effect Parade').addProperty('ADBE Glo2');\n"
        "    var names = ['a', 'b'];\n"
        "    var i;\n"
        "    for (i = 1; i <= comp.numLayers; i++) { comp.layer(i).name = names[0]; }\n"
        "    p.expression = ['const v = velocityAtTime(time);', 'let k = (a) => a * 2;', 'add(value, v);'].join('\\n');\n"
        "    p.setTemporalEaseAtKey(1, [new KeyframeEase(0, 16)], [new KeyframeEase(900, 70)]);\n"
        "  } catch (e) { alert(e); } finally { app.endUndoGroup(); }\n"
        "}());\n"
    )
    bad = {
        "E-ES3-DECL": "const a = 1;",
        "E-ES3-ARROW": "var f = function () {}; var g = (a) => a;",
        "E-ES3-TEMPLATE": "var s = `x`;",
        "E-ES3-ITER": "list.forEach(function (x) {});",
        "E-ES3-API": "var s = JSON.stringify(o);",
        "E-ES3-TRAILING-COMMA": "var o = { a: 1, };",
        "E-AE-INDEX0": "var l = comp.layer(0);",
        "E-AE-DISPLAYNAME": "var g = layer.property('Effects').addProperty('Glow');",
        "E-MOTION-LINEAR": "p.setInterpolationTypeAtKey(1, KeyframeInterpolationType.LINEAR);",
        "W-MOTION-F9": "var e = new KeyframeEase(0, 33.33);",
        "E-RANDOM": "var r = Math.random();",
        "W-EXPR-LINEAR": "p.expression = 'linear(time, 0, 1, 0, 100)';",
        "E-AE-UNDO": "layer.property('ADBE Effect Parade').addProperty('ADBE Glo2');",
    }
    assert lint(good) == [], lint(good)
    for rule, snippet in bad.items():
        rules = [r for _, r, _ in lint(snippet)]
        assert rule in rules, (rule, rules)
    nested = [r for _, r, _ in lint(good, bridge=True)]
    assert "E-AE-UNDO-NESTED" in nested, nested
    print("es3_lint selftest: %d bad cases caught, clean file passes" % len(bad))


def main(argv):
    if "--selftest" in argv:
        selftest()
        return 0
    bridge = "--bridge" in argv
    paths = [a for a in argv if not a.startswith("--")]
    if not paths:
        print(__doc__)
        return 2
    failed = False
    for path in paths:
        with open(path, encoding="utf-8") as fh:
            failed = report(path, lint(fh.read(), bridge)) or failed
    if not failed:
        print("es3_lint: OK (%d file%s)" % (len(paths), "" if len(paths) == 1 else "s"))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
