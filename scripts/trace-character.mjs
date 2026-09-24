/*
 * Traces the master model image into vector layers for the rig.
 * Run: node scripts/trace-character.mjs  (dev deps: sharp, potrace)
 * Nothing is redrawn: every path below comes from the artist's own pixels.
 *   head  = hair, face, ear, glasses, neck   (eyes removed -> separate ellipses)
 *   torso = shirt top, sleeves, straps, backpack
 */
import sharp from "sharp";
import potrace from "potrace";
import fs from "node:fs";
const SRC = new URL("../design/character/master-model.webp", import.meta.url).pathname;

// 50% coverage threshold keeps the original line weight; bluish pixels go to the blue layer
const isBlack = (r, g, b) => (r + g + b) / 3 < 128 && !(b > r + 45);
const isBlue = (r, g, b) => b > 110 && b - r > 35 && (r + g + b) / 3 < 235;

function flood(W, H, passable, seeds) {
  const out = new Uint8Array(W * H);
  const stack = [];
  for (const [x, y] of seeds) { const k = y * W + x; if (passable(x, y) && !out[k]) { out[k] = 1; stack.push(k); } }
  while (stack.length) {
    const k = stack.pop(); const x = k % W, y = (k / W) | 0;
    const n = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    for (const [nx, ny] of n) { if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const nk = ny * W + nx; if (!out[nk] && passable(nx, ny)) { out[nk] = 1; stack.push(nk); } }
  }
  return out;
}

function largest(W, H, mask) {
  const lab = new Int32Array(W * H).fill(-1); let best = -1, bestN = 0, id = 0;
  for (let k = 0; k < W * H; k++) {
    if (!mask[k] || lab[k] >= 0) continue;
    const st = [k]; lab[k] = id; let n = 0;
    while (st.length) { const c = st.pop(); n++; const x = c % W, y = (c / W) | 0;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) { if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const nk = ny * W + nx; if (mask[nk] && lab[nk] < 0) { lab[nk] = id; st.push(nk); } } }
    if (n > bestN) { bestN = n; best = id; } id++;
  }
  const out = new Uint8Array(W * H); for (let k = 0; k < W * H; k++) out[k] = lab[k] === best ? 1 : 0; return out;
}

async function tracePath(W, H, mask, opts = {}) {
  const buf = Buffer.alloc(W * H);
  for (let k = 0; k < W * H; k++) buf[k] = mask[k] ? 0 : 255;
  const png = await sharp(buf, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
  return new Promise((resolve, reject) => {
    const t = new potrace.Potrace();
    t.setParameters({ turdSize: opts.turd ?? 6, alphaMax: 1, optCurve: true, optTolerance: 0.25, threshold: 128, blackOnWhite: true });
    t.loadImage(png, (err) => { if (err) return reject(err); const tag = t.getPathTag("#000"); resolve(tag.match(/ d="([^"]+)"/)[1].replace(/(\d+\.\d)\d+/g, "$1")); });
  });
}

(async () => {
  const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;
  const P = (x, y) => { const i = (y * W + x) * C; return [data[i], data[i + 1], data[i + 2]]; };
  const black = new Uint8Array(W * H), blue = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const [r, g, b] = P(x, y); const k = y * W + x; if (isBlue(r, g, b)) blue[k] = 1; else if (isBlack(r, g, b)) black[k] = 1; }

  // Collar top per x inside the neck column: first black pixel below y=600 after the neck interior
  const collar = {};
  for (let x = 586; x <= 712; x++) { let y = 612; while (y < 720 && !black[y * W + x]) y++; collar[x] = y; }
  const inNeck = (x, y) => x >= 586 && x <= 712 && y >= 600 && y < (collar[x] ?? 700);

  // Regions
  const CUT = 1082; // just below the sleeve hems: forearms are rig parts
  // Split through the neck on a straight line; the head pivots on this line so the neck never kinks
  const NECK_SPLIT = 640;
  const neckCol = (x) => x >= 586 && x <= 712;
  const headRegion = (x, y) => (y >= 100 && y < 612 && x >= 300 && x <= 950) || (neckCol(x) && y >= 612 && y < NECK_SPLIT);
  const torsoRegion = (x, y) => ((y >= 612 && y <= CUT) || (y > CUT && y <= 1172 && x <= 368)) && !(neckCol(x) && y < NECK_SPLIT);

  // Eyes: small black blobs inside the lenses -> removed from line art, re-drawn as exact ellipses
  const eyesFound = [];
  { const seen = new Uint8Array(W * H);
    for (let y = 380; y < 480; y++) for (let x = 680; x < 840; x++) { const k0 = y * W + x; if (!black[k0] || seen[k0]) continue;
      const st = [k0]; seen[k0] = 1; const pix = [];
      while (st.length) { const c = st.pop(); pix.push(c); const cx = c % W, cy = (c / W) | 0; for (const [nx, ny] of [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]]) { const nk = ny * W + nx; if (black[nk] && !seen[nk]) { seen[nk] = 1; st.push(nk); } } }
      const bb = [Infinity, Infinity, -Infinity, -Infinity];
      for (const c of pix) { const px = c % W, py = (c / W) | 0; if (px < bb[0]) bb[0] = px; if (py < bb[1]) bb[1] = py; if (px > bb[2]) bb[2] = px; if (py > bb[3]) bb[3] = py; }
      if (pix.length > 30 && bb[2] - bb[0] < 60 && bb[3] - bb[1] < 80) { eyesFound.push({ cx: (bb[0] + bb[2] + 1) / 2, cy: (bb[1] + bb[3] + 1) / 2, rx: (bb[2] - bb[0] + 1) / 2, ry: (bb[3] - bb[1] + 1) / 2 }); for (const c of pix) black[c] = 0; } } }

  // Background = white reachable from the top/left/right borders, with a wall under the cut so it can't leak into the shirt
  const wall = (x, y) => (y >= CUT - 2 && x > 368) || y >= 1170;
  const seeds = []; for (let x = 0; x < W; x++) seeds.push([x, 0]); for (let y = 0; y < 1000; y++) { seeds.push([0, y]); seeds.push([W - 1, y]); }
  const bg = flood(W, H, (x, y) => { const k = y * W + x; return !black[k] && !blue[k] && !wall(x, y); }, seeds);

  const build = (region, withBlue) => {
    const sil = new Uint8Array(W * H), blk = new Uint8Array(W * H), blu = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!region(x, y)) continue; const k = y * W + x; if (!bg[k]) sil[k] = 1; if (black[k]) blk[k] = 1; if (withBlue && blue[k]) blu[k] = 1; }
    return { sil: largest(W, H, sil), blk, blu };
  };

  // Blue sits under the outline: grow it 2px so no white hairline shows at blue/black edges
  const grow = (m, r) => { let cur = m; for (let i = 0; i < r; i++) { const nx = new Uint8Array(W * H); for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const k = y * W + x; if (cur[k] || cur[k - 1] || cur[k + 1] || cur[k - W] || cur[k + W]) nx[k] = 1; } cur = nx; } return cur; };
  const head = build(headRegion, false);
  // head line art must not include the blue "surprise" dashes' neighbours: keep only line art touching the silhouette
  for (let k = 0; k < W * H; k++) if (head.blk[k] && !head.sil[k]) head.blk[k] = 0;
  const torso = build(torsoRegion, true);
  torso.blu = grow(torso.blu, 2);
  for (let k = 0; k < W * H; k++) { if (torso.blk[k] && !torso.sil[k]) torso.blk[k] = 0; if (torso.blu[k] && !torso.sil[k]) torso.blu[k] = 0; }

  const eyes = [...eyesFound].sort((a, b) => a.cx - b.cx);
  const out = `/*
 * MASTER CHARACTER ASSET. Generated by scripts/trace-character.mjs from the
 * artist's master model image. Do not hand-edit these paths: they ARE the
 * character (hair, face, glasses, neck, shirt top, sleeves, straps, backpack).
 * Coordinates are master-image pixels (1254 x 1254 source).
 */

/** Head: hair, face, ear, glasses, neck. Pivots on the neck split line (y = 640). */
export const HEAD = {
  fill: ${JSON.stringify(await tracePath(W, H, head.sil, { turd: 20 }))},
  line: ${JSON.stringify(await tracePath(W, H, head.blk))},
} as const;

/** Torso: shirt top, sleeves, backpack straps and pack (cut just under the sleeve hems). */
export const TORSO = {
  fill: ${JSON.stringify(await tracePath(W, H, torso.sil, { turd: 20 }))},
  blue: ${JSON.stringify(await tracePath(W, H, torso.blu))},
  line: ${JSON.stringify(await tracePath(W, H, torso.blk))},
} as const;

/** Eyes measured from the master (far = viewer-left lens, near = viewer-right lens). */
export const EYES = {
  far: { cx: ${eyes[0].cx}, cy: ${eyes[0].cy}, rx: ${eyes[0].rx}, ry: ${eyes[0].ry} },
  near: { cx: ${eyes[1].cx}, cy: ${eyes[1].cy}, rx: ${eyes[1].rx}, ry: ${eyes[1].ry} },
} as const;
`;
  const target = new URL("../src/components/character/master-paths.ts", import.meta.url).pathname;
  fs.writeFileSync(target, out);
  console.log("wrote", target, out.length, "bytes");
})();
