/*
 * Traces the avatar image into vector layers for the animated bust.
 * Run: npm run trace:avatar   (dev deps: sharp, potrace)
 * Nothing is redrawn: every path below comes from the artist's own pixels.
 *   head  = hair, face, ear, glasses, neck   (eyes removed -> separate ellipses)
 *   body  = shoulders, shirt, sleeves, straps, backpack (down to the frame cut)
 *   marks = the blue reaction dashes beside the head
 * To swap the character, replace design/avatar/avatar.webp (1254 x 1254, same
 * pose) and rerun; AvatarFigure picks the new paths up automatically.
 */
import sharp from "sharp";
import potrace from "potrace";
import fs from "node:fs";

const SRC = new URL("../design/avatar/avatar.webp", import.meta.url).pathname;
const OUT = new URL("../src/components/avatar/avatar-paths.ts", import.meta.url).pathname;

// 50% coverage threshold keeps the original line weight; bluish pixels go to the blue layer
const isBlack = (r, g, b) => (r + g + b) / 3 < 128 && !(b > r + 45);
// dark blue-tinted pixels (blue fading into the outline) count as blue, so thin strap slivers stay solid
const isBlue = (r, g, b) => (b > 110 && b - r > 35 && (r + g + b) / 3 < 235) || (b > 60 && b - r > 45);

const NECK_SPLIT = 640; // straight cut through the neck; the head pivots on this line
const BOTTOM = 1150; // the card frame crops the bust above this line
const neckCol = (x) => x >= 586 && x <= 712;
const headRegion = (x, y) => (y >= 100 && y < 612 && x >= 300 && x <= 950) || (neckCol(x) && y >= 612 && y < NECK_SPLIT);
const bodyRegion = (x, y) => y >= 612 && y < BOTTOM && !(neckCol(x) && y < NECK_SPLIT);
const marksRegion = (x, y) => y >= 440 && y <= 600 && (x < 380 || x > 870);

const N4 = (x, y) => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];

function flood(W, H, passable, seeds) {
  const out = new Uint8Array(W * H);
  const stack = [];
  for (const [x, y] of seeds) { const k = y * W + x; if (passable(x, y) && !out[k]) { out[k] = 1; stack.push(k); } }
  while (stack.length) {
    const k = stack.pop(); const x = k % W, y = (k / W) | 0;
    for (const [nx, ny] of N4(x, y)) { if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const nk = ny * W + nx; if (!out[nk] && passable(nx, ny)) { out[nk] = 1; stack.push(nk); } }
  }
  return out;
}

function largest(W, H, mask) {
  const lab = new Int32Array(W * H).fill(-1); let best = -1, bestN = 0, id = 0;
  for (let k = 0; k < W * H; k++) {
    if (!mask[k] || lab[k] >= 0) continue;
    const st = [k]; lab[k] = id; let n = 0;
    while (st.length) { const c = st.pop(); n++; const x = c % W, y = (c / W) | 0;
      for (const [nx, ny] of N4(x, y)) { if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const nk = ny * W + nx; if (mask[nk] && lab[nk] < 0) { lab[nk] = id; st.push(nk); } } }
    if (n > bestN) { bestN = n; best = id; } id++;
  }
  const out = new Uint8Array(W * H); for (let k = 0; k < W * H; k++) out[k] = lab[k] === best ? 1 : 0; return out;
}

// Blue sits under the outline: grow it so no white hairline shows at blue/black edges
function grow(W, H, m, r) {
  let cur = m;
  for (let i = 0; i < r; i++) {
    const nx = new Uint8Array(W * H);
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const k = y * W + x; if (cur[k] || cur[k - 1] || cur[k + 1] || cur[k - W] || cur[k + W]) nx[k] = 1; }
    cur = nx;
  }
  return cur;
}

async function tracePath(W, H, mask, turd = 6) {
  const buf = Buffer.alloc(W * H);
  for (let k = 0; k < W * H; k++) buf[k] = mask[k] ? 0 : 255;
  const png = await sharp(buf, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
  return new Promise((resolve, reject) => {
    const t = new potrace.Potrace();
    t.setParameters({ turdSize: turd, alphaMax: 1, optCurve: true, optTolerance: 0.25, threshold: 128, blackOnWhite: true });
    t.loadImage(png, (err) => {
      if (err) return reject(err);
      resolve(t.getPathTag("#000").match(/ d="([^"]+)"/)[1].replace(/(\d+\.\d)\d+/g, "$1"));
    });
  });
}

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, C = info.channels;
const black = new Uint8Array(W * H), blue = new Uint8Array(W * H);
for (let k = 0; k < W * H; k++) {
  const i = k * C; const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  if (isBlue(r, g, b)) blue[k] = 1; else if (isBlack(r, g, b)) black[k] = 1;
}

// Eyes: small black blobs inside the lenses -> removed from the line art, redrawn as exact ellipses
const eyes = [];
{
  const seen = new Uint8Array(W * H);
  for (let y = 380; y < 480; y++) for (let x = 680; x < 840; x++) {
    const k0 = y * W + x; if (!black[k0] || seen[k0]) continue;
    const st = [k0]; seen[k0] = 1; const pix = [];
    while (st.length) { const c = st.pop(); pix.push(c); for (const [nx, ny] of N4(c % W, (c / W) | 0)) { const nk = ny * W + nx; if (black[nk] && !seen[nk]) { seen[nk] = 1; st.push(nk); } } }
    const bb = [Infinity, Infinity, -Infinity, -Infinity];
    for (const c of pix) { const px = c % W, py = (c / W) | 0; bb[0] = Math.min(bb[0], px); bb[1] = Math.min(bb[1], py); bb[2] = Math.max(bb[2], px); bb[3] = Math.max(bb[3], py); }
    if (pix.length > 30 && bb[2] - bb[0] < 60 && bb[3] - bb[1] < 80) {
      eyes.push({ cx: (bb[0] + bb[2] + 1) / 2, cy: (bb[1] + bb[3] + 1) / 2, rx: (bb[2] - bb[0] + 1) / 2, ry: (bb[3] - bb[1] + 1) / 2 });
      for (const c of pix) black[c] = 0;
    }
  }
}
eyes.sort((a, b) => a.cx - b.cx);
if (eyes.length !== 2) throw new Error(`expected 2 eyes, found ${eyes.length}`);

// Background = white reachable from the top and sides. The wall at BOTTOM closes the
// open shirt hem so the shirt reads as a filled shape instead of leaking into the page.
const seeds = [];
for (let x = 0; x < W; x++) seeds.push([x, 0]);
for (let y = 0; y < BOTTOM; y++) { seeds.push([0, y]); seeds.push([W - 1, y]); }
const bg = flood(W, H, (x, y) => { const k = y * W + x; return y < BOTTOM && !black[k] && !blue[k]; }, seeds);

const layer = (region) => {
  const sil = new Uint8Array(W * H), blk = new Uint8Array(W * H), blu = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!region(x, y)) continue; const k = y * W + x;
    if (!bg[k]) sil[k] = 1; if (black[k]) blk[k] = 1; if (blue[k]) blu[k] = 1;
  }
  const s = largest(W, H, sil);
  // keep only ink that belongs to this silhouette (drops the loose reaction dashes)
  for (let k = 0; k < W * H; k++) { if (!s[k]) { blk[k] = 0; blu[k] = 0; } }
  return { sil: s, blk, blu };
};

const head = layer(headRegion);
const body = layer(bodyRegion);
const bodyBlue = grow(W, H, body.blu, 2);
for (let k = 0; k < W * H; k++) if (!body.sil[k]) bodyBlue[k] = 0;
const marks = new Uint8Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (marksRegion(x, y) && blue[y * W + x]) marks[y * W + x] = 1;

const e = (o) => `{ cx: ${o.cx}, cy: ${o.cy}, rx: ${o.rx}, ry: ${o.ry} }`;
const out = `/*
 * AVATAR ASSET. Generated by scripts/trace-avatar.mjs from design/avatar/avatar.webp.
 * Do not hand-edit: these paths ARE the character (hair, face, glasses, neck,
 * shirt, sleeves, straps, backpack). Coordinates are source-image pixels (${W} x ${H}).
 */

/** Hair, face, ear, glasses, neck. Pivots on the neck split line (y = ${NECK_SPLIT}). */
export const HEAD = {
  fill: ${JSON.stringify(await tracePath(W, H, head.sil, 20))},
  line: ${JSON.stringify(await tracePath(W, H, head.blk))},
} as const;

/** Shoulders, shirt, sleeves, straps and backpack, cut flat at y = ${BOTTOM}. */
export const BODY = {
  fill: ${JSON.stringify(await tracePath(W, H, body.sil, 20))},
  blue: ${JSON.stringify(await tracePath(W, H, bodyBlue))},
  line: ${JSON.stringify(await tracePath(W, H, body.blk))},
} as const;

/** The blue reaction dashes beside the head (shown on happy / surprised beats). */
export const MARKS = ${JSON.stringify(await tracePath(W, H, marks, 10))};

/** Eyes measured from the source (far = viewer-left lens, near = viewer-right lens). */
export const EYES = {
  far: ${e(eyes[0])},
  near: ${e(eyes[1])},
} as const;
`;
fs.writeFileSync(OUT, out);
console.log("wrote", OUT, out.length, "bytes");
