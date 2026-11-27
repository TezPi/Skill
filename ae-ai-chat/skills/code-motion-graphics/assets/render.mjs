// Render a seek(t) HTML composition to MP4 with true motion blur.
// usage:
//   node render.mjs comp.html out.mp4 [--sub 4] [--shutter 0.5] [--from 0] [--to DURATION] [--audio track.wav]
//   node render.mjs comp.html stills/ --stills 0,1.5,3   (PNG per time; default: one per beat if window.BPM else 8 evenly)
// Needs: npm i playwright (or a global install), ffmpeg on PATH.
// Chromium path override: PW_CHROMIUM=/opt/pw-browsers/chromium
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , input, output, ...rest] = process.argv;
if (!input || !output) { console.error('usage: node render.mjs comp.html out.mp4|stillsDir [--sub N] [--stills t1,t2]'); process.exit(1); }
const opt = k => { const i = rest.indexOf('--' + k); return i < 0 ? undefined : rest[i + 1]; };
const SUB = parseInt(opt('sub') ?? '4');            // 4 = smooth, 8 for fast whips
const SHUTTER = parseFloat(opt('shutter') ?? '0.5'); // 0.5 = 180-degree shutter

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || undefined,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'], // WebGL works headless
});
const page = await browser.newPage({ deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve(input)).href + '?render=1');
await page.evaluate(() => document.fonts.ready);
const { W, H, FPS, DURATION, BPM } = await page.evaluate(() => ({ W: window.W, H: window.H, FPS: window.FPS || 60, DURATION: window.DURATION, BPM: window.BPM }));
if (!W || !H || !DURATION) throw new Error('composition must expose window.W, window.H, window.DURATION and window.seek(t)');
await page.setViewportSize({ width: W, height: H });
await page.addStyleTag({ content: 'html,body{margin:0!important;display:block!important;min-height:0!important}canvas,#stage{position:fixed!important;left:0;top:0;width:' + W + 'px!important;height:' + H + 'px!important}' });
// window.CAPTURE = 'canvas' -> read pixels straight from the single canvas (faster); otherwise screenshot the page (DOM/SVG/WebGL).
const CAPTURE = await page.evaluate(() => window.CAPTURE || 'page');
const shot = async t => {
  if (CAPTURE === 'canvas') return Buffer.from(await page.evaluate(t => { window.seek(t); return document.querySelector('canvas').toDataURL('image/png').slice(22); }, t), 'base64');
  await page.evaluate(t => window.seek(t), t);
  return page.screenshot({ clip: { x: 0, y: 0, width: W, height: H }, type: 'png' });
};

if (opt('stills') !== undefined || !output.endsWith('.mp4')) {
  mkdirSync(output, { recursive: true });
  let times = opt('stills') ? opt('stills').split(',').map(Number) : [];
  if (!times.length) times = BPM ? Array.from({ length: Math.floor(DURATION * BPM / 60) }, (_, i) => i * 60 / BPM) : Array.from({ length: 8 }, (_, i) => i * DURATION / 8);
  for (const t of times) writeFileSync(join(output, `t${t.toFixed(3).padStart(8, '0')}.png`), await shot(t));
  console.log(`stills: ${times.length} -> ${output}`);
  await browser.close(); process.exit(0);
}

const from = parseFloat(opt('from') ?? '0'), to = parseFloat(opt('to') ?? String(DURATION));
const frames = Math.round((to - from) * FPS);          // [from, to): no duplicated endpoint frame on loops
const audio = opt('audio');
const args = ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-i', '-'];
if (audio) args.push('-ss', String(from), '-i', audio);
args.push('-vf', `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/(${FPS}*TB)`,
  '-r', String(FPS), '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart');
if (audio) args.push('-c:a', 'aac', '-b:a', '256k', '-shortest');
args.push(output);
const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
const write = buf => new Promise(r => ff.stdin.write(buf) ? r() : ff.stdin.once('drain', r));

const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  for (let s = 0; s < SUB; s++) {
    // subframes spread across the shutter, centred on the frame time
    const t = from + (f + (SUB > 1 ? SHUTTER * ((s + 0.5) / SUB - 0.5) : 0)) / FPS;
    await write(await shot(t));
  }
  if (f % FPS === 0) process.stdout.write(`\rframe ${f}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log(`\ndone: ${output} (${frames} frames @ ${FPS}fps, ${SUB} subframes)`);
