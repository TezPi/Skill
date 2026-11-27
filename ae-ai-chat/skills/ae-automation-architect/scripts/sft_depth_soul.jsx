/*
 * sft_depth_soul.jsx
 * SFT Super Motion Studio V2 - ae-automation-architect (Depth & Soul framework)
 *
 * ES3 ExtendScript rig library. Defines $.global.SFT_DS and changes nothing until a
 * function is called. Expression strings (V8 engine) are the only modern-syntax code here.
 *
 *   Standalone (File > Scripts):  SFT_DS.run("name", function () { ... });        // owns undo
 *   Through an AE bridge eval:    SFT_DS.run("name", function () { ... }, false); // bridge owns undo
 *
 * Rules enforced: AE-1 ES3 wrapper, AE-2 matchName lookups, AE-3 1-based indices +
 * undo group + try/catch, AE-4 DHO / KeyframeEase, AE-5 three-band inverse-square glow.
 * Lint: python3 es3_lint.py sft_depth_soul.jsx
 */
(function (root) {
    var VERSION = "1.0.0";

    // AE-2: every lookup goes through a matchName. Sub-properties of an effect follow
    // "<effect matchName>-NNNN"; confirm on the live build with SFT_DS.dump(effect).
    var MN = {
        FX: "ADBE Effect Parade",
        TRANSFORM: "ADBE Transform Group",
        ANCHOR: "ADBE Anchor Point",
        POSITION: "ADBE Position",
        POSITION_Z: "ADBE Position_2",
        SCALE: "ADBE Scale",
        OPACITY: "ADBE Opacity",
        CAM_OPTIONS: "ADBE Camera Options Group",
        CAM_ZOOM: "ADBE Camera Zoom",
        SLIDER: "ADBE Slider Control",
        SLIDER_VALUE: "ADBE Slider Control-0001",
        GLOW: "ADBE Glo2",
        GLOW_RADIUS: "ADBE Glo2-0003",
        GLOW_INTENSITY: "ADBE Glo2-0004",
        DROP_SHADOW: "ADBE Drop Shadow",
        SHADOW_OPACITY: "ADBE Drop Shadow-0002",
        SHADOW_DISTANCE: "ADBE Drop Shadow-0004",
        SHADOW_SOFTNESS: "ADBE Drop Shadow-0005",
        CHANNEL_BLUR: "ADBE Channel Blur",
        CHANNEL_BLUR_RED: "ADBE Channel Blur-0001",
        CHANNEL_BLUR_BLUE: "ADBE Channel Blur-0003",
        SHAPE_ROOT: "ADBE Root Vectors Group",
        SHAPE_GROUP: "ADBE Vector Group",
        SHAPE_CONTENTS: "ADBE Vectors Group",
        SHAPE_RECT: "ADBE Vector Shape - Rect",
        RECT_SIZE: "ADBE Vector Rect Size",
        RECT_ROUND: "ADBE Vector Rect Roundness",
        SHAPE_FILL: "ADBE Vector Graphic - Fill",
        FILL_COLOR: "ADBE Vector Fill Color",
        TEXT_PROPS: "ADBE Text Properties",
        TEXT_DOC: "ADBE Text Document"
    };

    // Curve tokens as [x1, y1, x2, y2]. DS-1: sharp attack, long deceleration.
    var CURVES = {
        EXPO_OUT_PREMIUM: [0.16, 1, 0.3, 1],          // out 16% @ 6.25x avg, in 70% @ 0
        PUNCHY_ENTER_15_85: [0.15, 0, 0.15, 1],       // Pillar 2 hero reveal
        M3_EMPHASIZED_DECEL: [0.05, 0.7, 0.1, 1],     // Pillar 2 hardest attack
        SPRING_APPROACH: [0.2, 0.75, 0.6, 0.7],       // arrives at 0.75x avg: pair with dho()
        M3_EMPHASIZED_ACCEL: [0.3, 0, 0.8, 0.15]      // exits only (Pillar 2 guardrail)
    };

    // Pillar 2 spring presets as DHO parameters: f = sqrt(k/m) / 2pi, zeta = c / (2 sqrt(k m)).
    var SPRINGS = {
        SNAPPY_UI: { frequency: 3.18, damping: 0.70 },
        IOS_SHEET: { frequency: 2.66, damping: 0.82 },
        SAAS_CARD: { frequency: 2.76, damping: 0.69 },
        PLAYFUL_POP: { frequency: 2.52, damping: 0.44 },
        ELASTIC_CARTOON: { frequency: 2.14, damping: 0.30 },
        HEAVY_CINEMATIC: { frequency: 1.07, damping: 0.89 }
    };

    var CTRL_NAME = "SFT CTRL";

    // ---------------------------------------------------------------- basics

    function fail(msg) {
        throw new Error("SFT_DS: " + msg);
    }

    function clamp(v, lo, hi) {
        return v < lo ? lo : (v > hi ? hi : v);
    }

    function pick(v, fallback) {
        return v === undefined || v === null ? fallback : v;
    }

    function isArray(v) {
        return v instanceof Array;
    }

    function quote(s) {
        return '"' + String(s).split("\\").join("\\\\").split('"').join('\\"') + '"';
    }

    // AE-3: one undo group + try/catch around every creation or modification.
    // ownsUndo === false when a bridge already opens the undo group for the call.
    function run(name, fn, ownsUndo) {
        var own = ownsUndo !== false;
        var out = { ok: false, result: null, error: null };
        if (own) {
            app.beginUndoGroup(name);
        }
        try {
            out.result = fn();
            out.ok = true;
        } catch (e) {
            out.error = (e && e.message ? e.message : String(e)) + (e && e.line ? " (line " + e.line + ")" : "");
        } finally {
            if (own) {
                app.endUndoGroup();
            }
        }
        return out;
    }

    function activeComp() {
        var item = app.project ? app.project.activeItem : null;
        if (!item || !(item instanceof CompItem)) {
            fail("open a composition first");
        }
        return item;
    }

    // Walk a path of matchNames from a layer or group. Throws with the missing step.
    function prop(base, path) {
        var p = base;
        var i;
        for (i = 0; i < path.length; i++) {
            p = p.property(path[i]);
            if (!p) {
                fail("matchName not found: " + path[i] + " (step " + (i + 1) + " of " + path.length + ")");
            }
        }
        return p;
    }

    // Text listing of matchNames under a group: the schema-first check before a build.
    function dump(group, maxDepth, indent) {
        var lines = [];
        var pad = pick(indent, "");
        var depth = pick(maxDepth, 2);
        var i;
        var p;
        for (i = 1; i <= group.numProperties; i++) {   // AE-3: 1-based
            p = group.property(i);
            lines.push(pad + "[" + i + "] " + p.matchName + "  |  " + p.name);
            if (depth > 1 && p.propertyType !== PropertyType.PROPERTY) {
                lines.push(dump(p, depth - 1, pad + "    "));
            }
        }
        return lines.join("\n");
    }

    function ownerLayer(p) {
        return p.propertyGroup(p.propertyDepth);
    }

    // A property reference dies when a sibling is added to its group, so keep the
    // 1-based index path and resolve it again after any addProperty.
    function pathOf(p) {
        var path = [];
        var q = p;
        while (q.propertyDepth > 0) {
            path.unshift(q.propertyIndex);
            q = q.parentProperty;
        }
        return { layer: q, path: path };
    }

    function resolve(ref) {
        var q = ref.layer;
        var i;
        for (i = 0; i < ref.path.length; i++) {
            q = q.property(ref.path[i]);
        }
        return q;
    }

    function parade(layer) {
        var fx = layer.property(MN.FX);
        if (!fx) {
            fail("layer '" + layer.name + "' cannot hold effects (camera or light): put controls on a null");
        }
        return fx;
    }

    // Find by the name this script assigned, or add by matchName and name it.
    function ensureFx(layer, matchName, name) {
        var fx = parade(layer);
        if (!fx.property(name)) {
            if (!fx.canAddProperty(matchName)) {
                fail("effect not available in this After Effects build: " + matchName);
            }
            fx.addProperty(matchName).name = name;
        }
        return parade(layer).property(name);
    }

    // Slider control; an existing one keeps the value the artist tuned.
    function slider(layer, name, value) {
        var fx = parade(layer);
        if (!fx.property(name)) {
            fx.addProperty(MN.SLIDER).name = name;
            prop(parade(layer).property(name), [MN.SLIDER_VALUE]).setValue(value);
        }
        return name;
    }

    function ctrlNull(comp) {
        var i;
        var nl;
        for (i = 1; i <= comp.numLayers; i++) {   // AE-3: 1-based
            if (comp.layer(i).name === CTRL_NAME) {
                return comp.layer(i);
            }
        }
        nl = comp.layers.addNull();
        nl.name = CTRL_NAME;
        nl.guideLayer = true;
        return nl;
    }

    // AE-1: expressions use V8 syntax, so the project must run the JavaScript engine.
    function requireV8() {
        var engine = app.project.expressionEngine;
        if (engine !== undefined && engine !== "javascript-1.0") {
            fail("project uses the Legacy ExtendScript expression engine; switch to JavaScript in File > Project Settings > Expressions");
        }
    }

    function setExpression(p, lines) {
        if (!p.canSetExpression) {
            fail("property cannot take an expression: " + p.name);
        }
        requireV8();
        p.expression = lines.join("\n");
        if (p.expressionError) {
            fail("expression error on " + p.name + ": " + p.expressionError);
        }
    }

    // ---------------------------------------------- AE-4a: KeyframeEase curves

    function monotone(bez) {
        return bez[1] >= 0 && bez[1] <= 1 && bez[3] >= 0 && bez[3] <= 1;
    }

    function noOvershoot(p) {
        return p.matchName === MN.OPACITY || p.propertyValueType === PropertyValueType.COLOR;
    }

    // cubic-bezier -> influence % and speed as a multiple of the segment's average speed.
    function bezierToEase(bez) {
        var x1 = bez[0];
        var y1 = bez[1];
        var x2 = bez[2];
        var y2 = bez[3];
        return {
            outInfluence: clamp(x1 * 100, 0.1, 100),
            outRatio: x1 > 0.0001 ? y1 / x1 : 0,
            inInfluence: clamp((1 - x2) * 100, 0.1, 100),
            inRatio: (1 - x2) > 0.0001 ? (1 - y2) / (1 - x2) : 0
        };
    }

    // Apply a cubic-bezier to the segment between adjacent keys kA and kB (1-based),
    // with explicit outgoing velocity at kA and incoming velocity at kB.
    function bezierEase(p, kA, kB, bez) {
        var e = bezierToEase(bez);
        var t1;
        var dt;
        var v1;
        var v2;
        var inA;
        var outB;
        var outA = [];
        var inB = [];
        var spatial;
        var d;
        var i;
        var sum;
        var avg;
        if (kA < 1 || kB > p.numKeys || kB !== kA + 1) {
            fail("bezierEase needs two adjacent keys, 1-based: got " + kA + ", " + kB);
        }
        if (noOvershoot(p) && !monotone(bez)) {
            fail("overshoot is not allowed on opacity or colour: " + p.name);
        }
        t1 = p.keyTime(kA);
        dt = p.keyTime(kB) - t1;
        if (dt <= 0) {
            fail("keys " + kA + " and " + kB + " share a time");
        }
        v1 = p.keyValue(kA);
        v2 = p.keyValue(kB);
        inA = p.keyInTemporalEase(kA);
        outB = p.keyOutTemporalEase(kB);
        spatial = p.propertyValueType === PropertyValueType.TwoD_SPATIAL ||
            p.propertyValueType === PropertyValueType.ThreeD_SPATIAL;
        for (d = 0; d < inA.length; d++) {
            if (spatial) {
                // ponytail: chord length; a curved motion path needs its arc length here
                sum = 0;
                for (i = 0; i < v1.length; i++) {
                    sum += (v2[i] - v1[i]) * (v2[i] - v1[i]);
                }
                avg = Math.sqrt(sum) / dt;
            } else if (isArray(v1)) {
                avg = (v2[d] - v1[d]) / dt;
            } else {
                avg = (v2 - v1) / dt;
            }
            outA[d] = new KeyframeEase(avg * e.outRatio, e.outInfluence);
            inB[d] = new KeyframeEase(avg * e.inRatio, e.inInfluence);
        }
        p.setInterpolationTypeAtKey(kA, p.keyInInterpolationType(kA), KeyframeInterpolationType.BEZIER);
        p.setInterpolationTypeAtKey(kB, KeyframeInterpolationType.BEZIER, p.keyOutInterpolationType(kB));
        p.setTemporalAutoBezierAtKey(kA, false);
        p.setTemporalAutoBezierAtKey(kB, false);
        p.setTemporalContinuousAtKey(kA, false);
        p.setTemporalContinuousAtKey(kB, false);
        p.setTemporalEaseAtKey(kA, inA, outA);
        p.setTemporalEaseAtKey(kB, inB, outB);
    }

    function easeAll(p, bez) {
        var k;
        for (k = 1; k < p.numKeys; k++) {
            bezierEase(p, k, k + 1, bez);
        }
    }

    // ------------------------------------- AE-4b: damped harmonic oscillator

    var EXPR = {};

    // x(t) = target + exp(-z w0 t) * (v0 / wd) * sin(wd t), v0 measured just before the key.
    EXPR.dho = function (ctrl) {
        return [
            "// SFT DHO: damped harmonic oscillator fed by the measured arrival velocity",
            "const C = " + ctrl + ";",
            "const f = C.effect(\"SFT DHO Frequency\")(1).value;",
            "const z = Math.min(Math.max(C.effect(\"SFT DHO Damping\")(1).value, 0.05), 0.99);",
            "let out = value;",
            "if (numKeys > 0) {",
            "  let k = nearestKey(time).index;",
            "  if (key(k).time > time) k--;",
            "  if (k > 0) {",
            "    const t = time - key(k).time;",
            "    if (t < 4) {",
            "      const v0 = velocityAtTime(key(k).time - thisComp.frameDuration / 10);",
            "      const w0 = 2 * Math.PI * f;",
            "      const wd = w0 * Math.sqrt(1 - z * z);",
            "      const s = Math.exp(-z * w0 * t) * Math.sin(wd * t) / wd;",
            "      out = (value instanceof Array) ? add(value, mul(v0, s)) : value + v0 * s;",
            "    }",
            "  }",
            "}",
            "out;"
        ];
    };

    // opts: frequency (Hz), damping (zeta 0.05-0.99), ctrlLayer. Or pass SFT_DS.SPRINGS.X.
    function dho(p, opts) {
        var o = opts || {};
        var ref;
        var layer;
        var ctrl;
        if (noOvershoot(p)) {
            fail("a spring overshoots: not allowed on opacity or colour (" + p.name + "); use bezierEase");
        }
        if (p.numKeys < 2) {
            fail("dho continues the arrival velocity of a key: " + p.name + " needs keyframes");
        }
        ref = pathOf(p);
        layer = ref.layer;
        ctrl = o.ctrlLayer || layer;
        slider(ctrl, "SFT DHO Frequency", pick(o.frequency, 2.76));
        slider(ctrl, "SFT DHO Damping", pick(o.damping, 0.69));
        setExpression(resolve(ref), EXPR.dho(ctrl === layer ? "thisLayer" : "thisComp.layer(" + quote(ctrl.name) + ")"));
    }

    // --------------------------------------------- DS-2: overlapping action

    // Seeded gaps of 2-4 frames (counted at 24-30 fps; doubled on 50/60 fps comps).
    function staggerGaps(count, fps, seed) {
        var gaps = [];
        var mult = fps > 40 ? 2 : 1;
        var i;
        var h;
        for (i = 0; i < count - 1; i++) {
            h = (seed * 73 + i * 151 + 17) % 97;
            gaps[i] = (2 + (h % 3)) * mult;
        }
        return gaps;
    }

    // layers: array in lead order (plates/shapes, then titles, then secondary elements).
    // opts: seed, gaps (frames, each inside the 2-4 window), capSeconds (Pillar 2 cap, 0.4).
    // Returns { offsets: frames per layer, capped: names that hit the cap and need regrouping }.
    function stagger(layers, opts) {
        var o = opts || {};
        var comp;
        var fps;
        var mult;
        var gaps;
        var capFrames;
        var acc = 0;
        var report = { offsets: [0], capped: [] };
        var i;
        if (!layers || layers.length < 2) {
            return report;
        }
        comp = layers[0].containingComp;
        fps = comp.frameRate;
        mult = fps > 40 ? 2 : 1;
        gaps = o.gaps || staggerGaps(layers.length, fps, pick(o.seed, 7));
        capFrames = Math.round(pick(o.capSeconds, 0.4) * fps);
        for (i = 1; i < layers.length; i++) {
            if (gaps[i - 1] < 2 * mult || gaps[i - 1] > 4 * mult) {
                fail("stagger gap " + gaps[i - 1] + " f is outside the DS-2 window (" + (2 * mult) + "-" + (4 * mult) + " f at " + fps + " fps)");
            }
            acc += gaps[i - 1];
            if (acc > capFrames) {
                acc = capFrames;
                report.capped.push(layers[i].name);
            }
            layers[i].startTime = layers[i].startTime + acc * comp.frameDuration;
            report.offsets[i] = acc;
        }
        return report;
    }

    // --------------------------------- AE-5: three-band inverse-square glow

    EXPR.glowByDistance = function (power) {
        return [
            "// SFT glow: scales with camera distance (inverse-square on intensity)",
            "let cam = null;",
            "try { cam = thisComp.activeCamera; } catch (e) { cam = null; }",
            "let out = value;",
            "if (cam !== null) {",
            "  const dist = (t) => length(sub(cam.toWorld([0, 0, 0], t), toWorld(anchorPoint, t)));",
            "  const ref = effect(\"SFT Glow Ref Distance\")(1).value;",
            "  const dRef = ref > 0 ? ref : dist(inPoint);",
            "  const q = dRef / Math.max(dist(time), 1);",
            "  out = value * Math.min(Math.max(Math.pow(q, " + power + "), 0.25), 4);",
            "}",
            "out;"
        ];
    };

    // Core (narrow, intense) / Mid (moderate diffusion) / Atmosphere (broad, soft).
    // Band n = 1, 2, 3: intensity = coreIntensity / n^exponent, radius = coreRadius * spread^(n-1).
    // opts: coreRadius (px), coreIntensity, spread (3), exponent (2 = inverse-square),
    //       distanceAware (true: intensity and radius follow the camera distance).
    function glowStack(layer, opts) {
        var o = opts || {};
        var names = ["SFT Glow Core", "SFT Glow Mid", "SFT Glow Atmosphere"];
        var r0 = pick(o.coreRadius, Math.round(layer.containingComp.width * 0.006));
        var i0 = pick(o.coreIntensity, 1);
        var spread = pick(o.spread, 3);
        var exponent = pick(o.exponent, 2);
        var bands = [];
        var n;
        var fx;
        for (n = 1; n <= 3; n++) {
            fx = ensureFx(layer, MN.GLOW, names[n - 1]);
            bands[n - 1] = {
                name: names[n - 1],
                radius: r0 * Math.pow(spread, n - 1),
                intensity: i0 / Math.pow(n, exponent)
            };
            prop(fx, [MN.GLOW_RADIUS]).setValue(bands[n - 1].radius);
            prop(fx, [MN.GLOW_INTENSITY]).setValue(bands[n - 1].intensity);
        }
        if (o.distanceAware) {
            slider(layer, "SFT Glow Ref Distance", 0);
            for (n = 1; n <= 3; n++) {
                fx = parade(layer).property(names[n - 1]);
                setExpression(prop(fx, [MN.GLOW_INTENSITY]), EXPR.glowByDistance(2));
                setExpression(prop(fx, [MN.GLOW_RADIUS]), EXPR.glowByDistance(1));
            }
        }
        return bands;
    }

    // ------------------------------------ DS-3: secondary motion and optics

    // Monotonic push whose speed breathes: never a linear keyframe pair, never reverses.
    EXPR.cameraDrift = function (ctrl, separated) {
        return [
            "// SFT camera drift on Z: continuous, speed breathes, direction never reverses",
            "const C = " + ctrl + ";",
            "const r = C.effect(\"SFT Drift Rate\")(1).value;",
            "const hz = Math.max(C.effect(\"SFT Drift Hz\")(1).value, 0.01);",
            "const b = Math.min(Math.max(C.effect(\"SFT Drift Breath\")(1).value, 0), 0.9);",
            "const t = Math.max(time - inPoint, 0);",
            "seedRandom(index, true);",
            "const ph = random(0, 2 * Math.PI);",
            "const w = 2 * Math.PI * hz;",
            "const d = r * t + (b * r / w) * (Math.sin(w * t + ph) - Math.sin(ph));",
            separated ? "value + d;" : "add(value, [0, 0, d]);"
        ];
    };

    // opts: rate (px/s toward the subject; default 0.4% of the camera distance per second),
    //       hz (0.12), breath (0.3 = speed varies +/-30%).
    function cameraDrift(cam, opts) {
        var o = opts || {};
        var comp;
        var ctrl;
        var zoom;
        var tg;
        var pos;
        var separated;
        if (!(cam instanceof CameraLayer)) {
            fail("cameraDrift needs a camera layer");
        }
        comp = cam.containingComp;
        ctrl = ctrlNull(comp);
        zoom = prop(cam, [MN.CAM_OPTIONS, MN.CAM_ZOOM]).value;
        slider(ctrl, "SFT Drift Rate", pick(o.rate, Math.round(zoom * 0.004 * 10) / 10));
        slider(ctrl, "SFT Drift Hz", pick(o.hz, 0.12));
        slider(ctrl, "SFT Drift Breath", pick(o.breath, 0.3));
        tg = prop(cam, [MN.TRANSFORM]);
        pos = prop(tg, [MN.POSITION]);
        separated = pos.dimensionsSeparated;
        setExpression(separated ? prop(tg, [MN.POSITION_Z]) : pos,
            EXPR.cameraDrift("thisComp.layer(" + quote(ctrl.name) + ")", separated));
        return ctrl;
    }

    // Axial chromatic aberration: red and blue defocus with the hero's world speed, zero at rest.
    EXPR.chroma = function (hero, gain) {
        return [
            "// SFT chromatic aberration: follows the hero's speed, zero at rest",
            "const H = thisComp.layer(" + hero + ");",
            "const dt = thisComp.frameDuration;",
            "const speed = length(sub(H.toWorld(H.anchorPoint, time), H.toWorld(H.anchorPoint, time - dt))) / dt;",
            "const floor = effect(\"SFT CA Speed Floor\")(1).value;",
            "const ref = Math.max(effect(\"SFT CA Speed Ref\")(1).value, floor + 1);",
            "const u = Math.min(Math.max((speed - floor) / (ref - floor), 0), 1);",
            "effect(\"SFT CA Max\")(1).value * u * u * " + gain + ";"
        ];
    };

    // target: the hero itself or an adjustment layer above the scene. hero: the layer whose speed drives it.
    // opts: maxPx (0.2% of comp width), speedFloor and speedRef (px/s).
    function chromaAtVelocity(target, hero, opts) {
        var o = opts || {};
        var k = target.containingComp.width / 1920;
        var fx;
        slider(target, "SFT CA Max", pick(o.maxPx, Math.round(target.containingComp.width * 0.002 * 10) / 10));
        slider(target, "SFT CA Speed Floor", pick(o.speedFloor, Math.round(600 * k)));
        slider(target, "SFT CA Speed Ref", pick(o.speedRef, Math.round(3000 * k)));
        fx = ensureFx(target, MN.CHANNEL_BLUR, "SFT CA");
        setExpression(prop(fx, [MN.CHANNEL_BLUR_RED]), EXPR.chroma(quote(hero.name), 1));
        setExpression(prop(fx, [MN.CHANNEL_BLUR_BLUE]), EXPR.chroma(quote(hero.name), 0.6));
    }

    // h = height above the ground plane. Expressions scale the keyed/base value, so units stay AE's.
    EXPR.shadow = function (threeD, formula) {
        return [
            "// SFT shadow: shifts with the layer's distance from the ground plane",
            "const h0 = Math.max(effect(\"SFT Shadow Ref Height\")(1).value, 1);",
            threeD ?
                "const h = Math.max(effect(\"SFT Shadow Ground Z\")(1).value - toWorld(anchorPoint)[2], 0);" :
                "const h = Math.max(transform.scale[0] - 100, 0) * effect(\"SFT Shadow 2D Lift\")(1).value;",
            formula
        ];
    };

    // opts: groundZ (world Z of the surface behind the layer), refHeight (px), lift2D (px per 1% scale),
    //       distance and softness (px at height 0).
    function shadowByDistance(layer, opts) {
        var o = opts || {};
        var threeD = layer.threeDLayer;
        var fx;
        slider(layer, "SFT Shadow Ground Z", pick(o.groundZ, 0));
        slider(layer, "SFT Shadow Ref Height", pick(o.refHeight, 200));
        slider(layer, "SFT Shadow 2D Lift", pick(o.lift2D, 10));
        fx = ensureFx(layer, MN.DROP_SHADOW, "SFT Shadow");
        prop(fx, [MN.SHADOW_DISTANCE]).setValue(pick(o.distance, 6));
        prop(fx, [MN.SHADOW_SOFTNESS]).setValue(pick(o.softness, 14));
        setExpression(prop(fx, [MN.SHADOW_DISTANCE]), EXPR.shadow(threeD, "value * (1 + h / h0);"));
        setExpression(prop(fx, [MN.SHADOW_SOFTNESS]), EXPR.shadow(threeD, "value * (1 + 2 * h / h0);"));
        setExpression(prop(fx, [MN.SHADOW_OPACITY]), EXPR.shadow(threeD, "value / (1 + (h / h0) * (h / h0));"));
    }

    // ------------------------------------------------------------------ demo

    function keys(p, times, values) {
        var i;
        for (i = 0; i < times.length; i++) {
            p.setValueAtTime(times[i], values[i]);
        }
    }

    function roundedRect(layer, size, roundness, color) {
        var contents = function () {
            return prop(layer, [MN.SHAPE_ROOT]).property(1).property(MN.SHAPE_CONTENTS);   // AE-3: 1-based
        };
        prop(layer, [MN.SHAPE_ROOT]).addProperty(MN.SHAPE_GROUP);
        contents().addProperty(MN.SHAPE_RECT);
        prop(contents().property(1), [MN.RECT_SIZE]).setValue(size);
        prop(contents().property(1), [MN.RECT_ROUND]).setValue(roundness);
        contents().addProperty(MN.SHAPE_FILL);   // fill stays at the bottom of the stack
        prop(contents().property(2), [MN.FILL_COLOR]).setValue(color);
    }

    // Builds a new 5 s comp that shows every law once. Touches nothing that already exists.
    function demo() {
        var w = 1920;
        var h = 1080;
        var comp = app.project.items.addComp("SFT Depth Soul Demo", w, h, 1, 5, 30);
        var fd = comp.frameDuration;
        var t0 = 6 * fd;
        var plate;
        var title;
        var accent;
        var lens;
        var cam;
        var doc;
        var tg;
        var report;

        comp.layers.addSolid([0.03, 0.035, 0.05], "BG", w, h, 1);

        plate = comp.layers.addShape();
        plate.name = "Plate";
        plate.threeDLayer = true;
        roundedRect(plate, [980, 440], 36, [0.09, 0.11, 0.16, 1]);
        tg = prop(plate, [MN.TRANSFORM]);
        keys(prop(tg, [MN.POSITION]), [t0, t0 + 20 * fd], [[w / 2, h / 2 + 48, 240], [w / 2, h / 2, 240]]);
        keys(prop(tg, [MN.SCALE]), [t0, t0 + 20 * fd], [[92, 92, 100], [100, 100, 100]]);
        keys(prop(tg, [MN.OPACITY]), [t0, t0 + 12 * fd], [0, 100]);
        easeAll(prop(tg, [MN.POSITION]), CURVES.EXPO_OUT_PREMIUM);
        easeAll(prop(tg, [MN.SCALE]), CURVES.EXPO_OUT_PREMIUM);
        easeAll(prop(tg, [MN.OPACITY]), CURVES.EXPO_OUT_PREMIUM);

        title = comp.layers.addText("DEPTH & SOUL");
        title.name = "Title";
        title.threeDLayer = true;
        doc = prop(title, [MN.TEXT_PROPS, MN.TEXT_DOC]).value;
        doc.fontSize = 132;
        doc.justification = ParagraphJustification.CENTER_JUSTIFY;
        prop(title, [MN.TEXT_PROPS, MN.TEXT_DOC]).setValue(doc);
        tg = prop(title, [MN.TRANSFORM]);
        keys(prop(tg, [MN.POSITION]), [t0, t0 + 12 * fd], [[w / 2, h / 2 + 96, -160], [w / 2, h / 2 + 44, 0]]);
        keys(prop(tg, [MN.OPACITY]), [t0, t0 + 10 * fd], [0, 100]);
        easeAll(prop(tg, [MN.POSITION]), CURVES.SPRING_APPROACH);
        easeAll(prop(tg, [MN.OPACITY]), CURVES.EXPO_OUT_PREMIUM);
        dho(prop(prop(title, [MN.TRANSFORM]), [MN.POSITION]), SPRINGS.SAAS_CARD);
        shadowByDistance(title, { groundZ: 240, refHeight: 240 });

        accent = comp.layers.addShape();
        accent.name = "Accent";
        accent.threeDLayer = true;
        roundedRect(accent, [220, 10], 5, [0.36, 0.72, 1, 1]);
        tg = prop(accent, [MN.TRANSFORM]);
        keys(prop(tg, [MN.POSITION]), [t0, t0 + 16 * fd], [[w / 2 - 140, h / 2 + 120, -60], [w / 2, h / 2 + 120, -60]]);
        keys(prop(tg, [MN.OPACITY]), [t0, t0 + 8 * fd], [0, 100]);
        easeAll(prop(tg, [MN.POSITION]), CURVES.EXPO_OUT_PREMIUM);
        easeAll(prop(tg, [MN.OPACITY]), CURVES.EXPO_OUT_PREMIUM);
        glowStack(accent, { coreRadius: 10, coreIntensity: 1.4, distanceAware: true });

        report = stagger([plate, title, accent], { seed: 7 });

        cam = comp.layers.addCamera("SFT CAM", [w / 2, h / 2]);
        tg = prop(cam, [MN.TRANSFORM]);
        prop(tg, [MN.ANCHOR]).setValue([w / 2, h / 2, 0]);   // point of interest
        prop(tg, [MN.POSITION]).setValue([w / 2, h / 2, -prop(cam, [MN.CAM_OPTIONS, MN.CAM_ZOOM]).value]);
        cameraDrift(cam);

        lens = comp.layers.addSolid([0, 0, 0], "SFT Lens", w, h, 1);
        lens.adjustmentLayer = true;
        chromaAtVelocity(lens, title, { speedRef: 1800 });

        comp.openInViewer();
        return { comp: comp.name, staggerFrames: report.offsets, capped: report.capped };
    }

    root.SFT_DS = {
        VERSION: VERSION,
        MN: MN,
        CURVES: CURVES,
        SPRINGS: SPRINGS,
        EXPR: EXPR,
        run: run,
        activeComp: activeComp,
        prop: prop,
        dump: dump,
        ensureFx: ensureFx,
        slider: slider,
        ctrlNull: ctrlNull,
        bezierToEase: bezierToEase,
        bezierEase: bezierEase,
        easeAll: easeAll,
        dho: dho,
        staggerGaps: staggerGaps,
        stagger: stagger,
        glowStack: glowStack,
        cameraDrift: cameraDrift,
        chromaAtVelocity: chromaAtVelocity,
        shadowByDistance: shadowByDistance,
        demo: demo
    };
}($.global));
