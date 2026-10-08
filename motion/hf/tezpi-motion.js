/* tezpi-motion.js — doctrine primitives for HyperFrames GSAP timelines.
 * Source: motion/hf/tezpi-motion.js (synced into each film's vendor/ by `npm run film:sync`).
 * Numbers come from window.TEZPI (vendor/tokens.js) — load that first.
 *
 * Every primitive takes the composition's single paused timeline, schedules seek-safe tweens
 * (transform/opacity/filter only, no callbacks, no randomness) and RETURNS its end time so
 * beats chain without magic numbers:
 *
 *   var t = TZM.waterfallEntry(tl, [{ el: "#w1", weight: "heavy" }, { el: "#w2" }], 0.25);
 *   t = TZM.nudge(tl, "#group", { axis: "y", distance: -48 }, t + 0.2);
 *
 * Scene-to-scene seams are NOT here: write ledger.json and run `npm run seam:stamp`.
 * In-scene word-level seams (waterfall cut) and rack-focus swaps are, because they tween
 * children inside one scene rather than the scene wrappers.
 */
(function () {
  var T = window.TEZPI;
  if (!T) throw new Error("tezpi-motion.js: load vendor/tokens.js before this file");
  var M = T.motion;
  var F = 1 / 60; // cascade overlap unit (cut-the-curve §6 reference timing)
  var DIR = { left: [-1, "x"], right: [1, "x"], up: [-1, "y"], down: [1, "y"] };
  var WEIGHT_OVERLAP = { heavy: -2, normal: 1, light: 1 }; // frames; negative = deliberate gap

  function travelPx(axis) {
    return Math.round((axis === "x" ? T.canvas.width : T.canvas.height) * M.distance.travelFraction);
  }
  function current() {
    return DIR[M.current] || DIR.left;
  }

  var TZM = {
    /** §6 Waterfall ENTRY — binary opacity, power4.out from below, overlapping cascade.
     *  items: [{ el, weight: "heavy"|"normal"|"light", offset?, duration? }] in reading order.
     *  Split the final word into fragments (weight "light", larger offset) for a longer climax. */
    waterfallEntry: function (tl, items, t0, opts) {
      opts = opts || {};
      var axis = opts.axis || "y";
      var sign = opts.from === "above" ? -1 : 1;
      var t = t0;
      var end = t0;
      items.forEach(function (it, i) {
        var w = it.weight || "normal";
        var off = (it.offset != null ? it.offset : M.distance.arrival[w]) * sign;
        var dur = it.duration != null ? it.duration : M.duration.arrival[w];
        var from = {};
        from[axis] = off;
        var to = { duration: dur, ease: M.ease.arrival, immediateRender: false };
        to[axis] = 0;
        tl.set(it.el, { opacity: 1 }, t);
        tl.fromTo(it.el, from, to, t);
        end = Math.max(end, t + dur);
        var next = items[i + 1];
        if (next) t = t + dur - (WEIGHT_OVERLAP[next.weight || "normal"] || 0) * F;
      });
      return end;
    },

    /** §4 Waterfall CUT — word-level cut-the-curve between two stacked beat layers in ONE scene.
     *  Pre-hides incoming words; hard-swaps the layers AT the cut. Returns entry end time. */
    waterfallCut: function (tl, o) {
      var d = M.duration.waterfallCut;
      var cur = current();
      var sign = cur[0];
      var axis = cur[1];
      var px = travelPx(axis);
      var outs = gsap.utils.toArray(o.outWords);
      var ins = gsap.utils.toArray(o.inWords);
      var init = { opacity: 0 };
      init[axis] = -sign * px;
      gsap.set(ins, init); // build-time pre-set: immediateRender:false alone leaves words visible
      var s = o.cut - (d.exit - 0.02);
      outs.forEach(function (el) {
        var move = { duration: d.exit, ease: M.ease.seamExit };
        move[axis] = sign * px;
        tl.to(el, move, s);
        tl.to(el, { opacity: 0, duration: d.fade, ease: "power1.in" }, s);
        s += d.exitStagger;
      });
      if (o.outLayer) tl.set(o.outLayer, { opacity: 0 }, o.cut);
      if (o.inLayer) tl.set(o.inLayer, { opacity: 1 }, o.cut);
      var off = 0;
      var gap = d.entryGap;
      var end = o.cut;
      ins.forEach(function (el) {
        var from = { opacity: M.opacity.seamIgnite };
        from[axis] = -sign * px;
        var to = { opacity: 1, duration: d.entry, ease: M.ease.seamEntry, immediateRender: false };
        to[axis] = 0;
        tl.fromTo(el, from, to, o.cut + off);
        end = o.cut + off + d.entry;
        off += gap;
        gap *= d.gapDecay;
      });
      return end;
    },

    /** §7 Nudge curve — slow-fast-slow group slide as three chained tweens on one property.
     *  opts: { axis: "x"|"y", distance (px, signed), from (px start, default 0), duration (s, default 0.57) }
     *  Pair `from` with a build-time gsap.set so the group can sit in normal flow and still start
     *  at true center (avoids absolutely-positioned overflow). */
    nudge: function (tl, targets, opts, t) {
      var axis = opts.axis || "x";
      var base = opts.from || 0;
      var total = opts.duration || 0.57;
      var dist = M.nudge.distance;
      var time = M.nudge.time;
      var eases = [M.ease.nudgeRamp, M.ease.nudgeBurst, M.ease.nudgeTail];
      var prevT = 0;
      for (var i = 0; i < 3; i++) {
        var v = { duration: +(total * (time[i] - prevT)).toFixed(4), ease: eases[i] };
        v[axis] = +(base + opts.distance * dist[i]).toFixed(2);
        tl.to(targets, v, t + total * prevT);
        prevT = time[i];
      }
      return t + total;
    },

    /** Start time of the nudge's linear burst — reveal new content here (§7 rule). */
    nudgeBurstAt: function (t, duration) {
      return t + (duration || 0.57) * M.nudge.time[0];
    },

    /** Oversized cursor: top-left position that lands the arrow TIP on (cx, cy). */
    tipTo: function (cursorPx, cx, cy) {
      var o = M.cursor.tipOrigin.split(" ").map(parseFloat);
      return { x: +(cx - (cursorPx * o[0]) / 100).toFixed(2), y: +(cy - (cursorPx * o[1]) / 100).toFixed(2) };
    },

    /** Entry law — physical glide from off-screen (default: straight up from below). */
    cursorEnter: function (tl, cursor, to, t, opts) {
      opts = opts || {};
      var from = opts.from || { x: to.x, y: Math.round(T.canvas.height * 1.15) };
      var dur = opts.duration || M.duration.cursorEnter;
      tl.fromTo(cursor, from, { x: to.x, y: to.y, duration: dur, ease: M.ease.cursorEnter, immediateRender: false }, t);
      return t + dur;
    },

    /** Click tap (1:2 compress/expand, pivot on the tip) + optional parallel target press.
     *  Returns t — the ignition frame: start the caused beat AT this time, never after. */
    click: function (tl, cursor, t, opts) {
      opts = opts || {};
      var d = M.duration.press;
      var origin = M.cursor.tipOrigin;
      tl.to(cursor, { scale: M.scale.press, duration: d.in, ease: M.ease.pressIn, transformOrigin: origin }, t);
      tl.to(cursor, { scale: 1, duration: d.out, ease: M.ease.pressOut, transformOrigin: origin }, t + d.in);
      if (opts.target) {
        tl.to(opts.target, { scale: M.scale.targetPress, duration: d.in, ease: M.ease.pressIn }, t);
        tl.to(opts.target, { scale: 1, duration: d.out, ease: M.ease.pressOut }, t + d.in);
      }
      return t;
    },

    /** Drift aside during beats the cursor doesn't own — never frozen on the action, never wobbling. */
    cursorDrift: function (tl, cursor, to, t, opts) {
      var dur = (opts && opts.duration) || M.duration.cursorDrift;
      tl.to(cursor, { x: to.x, y: to.y, duration: dur, ease: M.ease.cursorDrift }, t);
      return t + dur;
    },

    /** Exit law — accelerate off the nearest edge. edge: "left"|"right"|"bottom". */
    cursorExit: function (tl, cursor, edge, t, opts) {
      var dur = (opts && opts.duration) || M.duration.cursorExit;
      var v = { duration: dur, ease: M.ease.cursorExit };
      if (edge === "left") v.x = -0.12 * T.canvas.width;
      else if (edge === "right") v.x = 1.06 * T.canvas.width;
      else v.y = 1.16 * T.canvas.height;
      tl.to(cursor, v, t);
      return t + dur;
    },

    /** §5 Rack-focus blur-cut — same-surface state swap, ≤ once per ~8s. Wrappers only. */
    rackFocus: function (tl, outEl, inEl, t, opts) {
      opts = opts || {};
      var d = M.duration.rackFocus;
      var cur = current();
      var px = opts.travel != null ? opts.travel : 80;
      var blur = "blur(" + (opts.blur || M.blur.rackPeak) + "px)";
      var outV = { scale: M.scale.rackBreath, filter: blur, duration: d.exit, ease: M.ease.rackExit };
      outV[cur[1]] = cur[0] * px;
      tl.to(outEl, outV, t);
      tl.set(outEl, { opacity: 0 }, t + d.exit);
      var from = { opacity: 1, scale: M.scale.rackBreath, filter: blur };
      from[cur[1]] = -cur[0] * px;
      var to = { scale: 1, filter: "blur(0px)", duration: d.entry, ease: M.ease.rackEntry, immediateRender: false };
      to[cur[1]] = 0;
      tl.fromTo(inEl, from, to, t + d.exit);
      return t + d.exit + d.entry;
    },
  };

  window.TZM = Object.freeze(TZM);
})();
