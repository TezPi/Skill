// ExtendScript (ES3) side of the panel. Loaded into After Effects via CSXS/manifest.xml <ScriptPath>.
// Every function returns a JSON string: AE's engine has no native JSON, so aiJson does the encoding.

function aiQuote(s) {
  return '"' + s.replace(/[\\"\u0000-\u001f\u2028\u2029]/g, function (c) {
    var m = { '"': '\\"', "\\": "\\\\", "\n": "\\n", "\r": "\\r", "\t": "\\t" }[c];
    return m || "\\u" + ("000" + c.charCodeAt(0).toString(16)).slice(-4);
  }) + '"';
}

function aiJson(v, depth) {
  depth = depth || 0;
  if (v === null || v === undefined) return "null";
  var t = typeof v;
  if (t === "number") return isFinite(v) ? String(v) : "null";
  if (t === "boolean") return String(v);
  if (t === "string") return aiQuote(v);
  if (depth > 8) return aiQuote(String(v));
  var parts = [], i;
  if (v instanceof Array) {
    for (i = 0; i < v.length; i++) parts.push(aiJson(v[i], depth + 1));
    return "[" + parts.join(",") + "]";
  }
  if (v.constructor === Object) {
    for (i in v) if (v.hasOwnProperty(i)) parts.push(aiQuote(i) + ":" + aiJson(v[i], depth + 1));
    return "{" + parts.join(",") + "}";
  }
  return aiQuote(String(v)); // AE objects (Layer, Property, ...) would recurse forever; send their name instead
}

function aiLayer(l) {
  var type = l instanceof TextLayer ? "text"
    : l instanceof ShapeLayer ? "shape"
    : l instanceof CameraLayer ? "camera"
    : l instanceof LightLayer ? "light"
    : l.nullLayer ? "null"
    : l.adjustmentLayer ? "adjustment"
    : l.source instanceof CompItem ? "precomp"
    : l.source && l.source.mainSource instanceof SolidSource ? "solid"
    : "footage";
  var o = {
    index: l.index, name: l.name, type: type, enabled: l.enabled, locked: l.locked,
    inPoint: l.inPoint, outPoint: l.outPoint, parent: l.parent ? l.parent.index : null
  };
  if (l.threeDLayer) o.threeD = true;
  var fx = l.property("ADBE Effect Parade");
  if (fx && fx.numProperties) {
    o.effects = [];
    for (var k = 1; k <= fx.numProperties; k++) o.effects.push(fx.property(k).name);
  }
  return o;
}

function aiContext() {
  try {
    var p = app.project, c = p.activeItem, out = { project: p.file ? p.file.name : "(unsaved)", comps: [], activeComp: null };
    for (var i = 1; i <= p.numItems && out.comps.length < 50; i++) {
      if (p.item(i) instanceof CompItem) out.comps.push(p.item(i).name);
    }
    if (c instanceof CompItem) {
      // ponytail: first 100 layers only; the model can query the rest via run_extendscript
      var layers = [], selected = [];
      for (var j = 1; j <= Math.min(c.numLayers, 100); j++) layers.push(aiLayer(c.layer(j)));
      for (var s = 0; s < c.selectedLayers.length; s++) selected.push(c.selectedLayers[s].index);
      out.activeComp = {
        name: c.name, width: c.width, height: c.height, pixelAspect: c.pixelAspect,
        frameRate: c.frameRate, duration: c.duration, time: c.time,
        workArea: [c.workAreaStart, c.workAreaStart + c.workAreaDuration],
        numLayers: c.numLayers, selectedLayers: selected, layers: layers
      };
    }
    return aiJson(out);
  } catch (e) {
    return aiJson({ error: String(e) });
  }
}

// Runs model-written code as one undo step, so the user can Ctrl/Cmd+Z each AI edit.
function aiRun(code, label) {
  app.beginUndoGroup("AI: " + label);
  try {
    var result = new Function(code)();
    return aiJson({ ok: true, result: result === undefined ? null : result });
  } catch (e) {
    return aiJson({ ok: false, error: String(e), line: e.line });
  } finally {
    app.endUndoGroup();
  }
}

function aiUndo() {
  app.executeCommand(16); // 16 = Edit > Undo; keystrokes inside the panel never reach AE's own undo
  return aiJson({ ok: true });
}

/* ---------- Skill library (skills/, vendored from SFT Super Motion Studio V2). Paths use "/". ---------- */

function aiReadText(file, max) {
  file.encoding = "UTF-8";
  if (!file.open("r")) throw new Error("Can't open " + File.decode(file.name));
  try { return max ? file.read(max) : file.read(); } finally { file.close(); }
}

// Name + frontmatter head of every skill; the panel parses the description.
function aiSkillIndex(root) {
  try {
    var dirs = new Folder(root).getFiles(), out = [];
    for (var i = 0; i < dirs.length; i++) {
      var skill = new File(dirs[i].fsName + "/SKILL.md");
      if (dirs[i] instanceof Folder && skill.exists) out.push({ name: File.decode(dirs[i].name), head: aiReadText(skill, 4000) });
    }
    return aiJson({ ok: true, skills: out });
  } catch (e) {
    return aiJson({ ok: false, error: String(e) });
  }
}

function aiListFiles(folder, prefix, out) {
  var items = folder.getFiles();
  for (var i = 0; i < items.length && out.length < 400; i++) {
    var n = prefix + File.decode(items[i].name);
    if (items[i] instanceof Folder) aiListFiles(items[i], n + "/", out); else out.push(n);
  }
  return out;
}

// A file → its text; a folder → its file list (recursive, capped).
function aiSkillRead(root, rel) {
  try {
    if (/(^|[\/\\])\.\.([\/\\]|$)/.test(rel)) return aiJson({ ok: false, error: "Path must stay inside the skill library." });
    var clean = rel.replace(/^[\/\\]+|[\/\\]+$/g, "");
    var item = File(root + "/" + clean); // File() (no new) returns a Folder for folders
    if (item instanceof Folder) {
      if (!item.exists) return aiJson({ ok: false, error: "Not found: " + rel });
      var files = aiListFiles(item, "", []).sort();
      return aiJson({ ok: true, files: files, truncated: files.length >= 400 });
    }
    if (!item.exists) return aiJson({ ok: false, error: "Not found: " + rel });
    if (/\.(png|jpe?g|gif|webp|mp4|mov|woff2?|ttf|otf|zip)$/i.test(clean)) return aiJson({ ok: false, error: "Binary file, can't be read as text: " + rel });
    return aiJson({ ok: true, text: aiReadText(item) });
  } catch (e) {
    return aiJson({ ok: false, error: String(e) });
  }
}

// Evaluates a library (sft_depth_soul.jsx) into AE's global scope so later run_extendscript calls can use it.
function aiLoadLib(path) {
  try {
    $.evalFile(new File(path));
    return aiJson({ ok: !!$.global.SFT_DS });
  } catch (e) {
    return aiJson({ ok: false, error: String(e) });
  }
}
