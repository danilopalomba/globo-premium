// Globo premium — registra i fotogrammi di index.html e monta l'MP4.
//   node render.mjs esempi/derinkuyu.json out.mp4 [--scala 0.5] [--fps 15] [--da 0 --a 99] [--foglio foglio.jpg]
// Prima una bozza bassa (--scala 0.5 --fps 15), poi il definitivo a 1 e 30 fps.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const [cfgPath, outPath] = argv;
if (!cfgPath || !outPath) { console.error('uso: node render.mjs <viaggio.json> <out.mp4> [--scala 0.5] [--fps 15]'); process.exit(1); }
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const scala = parseFloat(opt('--scala', '1'));
const fps = parseInt(opt('--fps', String(cfg.fps || 30)));
cfg.w = Math.round((cfg.w || 1920) * scala / 2) * 2; cfg.h = Math.round((cfg.h || 1080) * scala / 2) * 2;
// 18/11: la bozza deve inquadrare come il definitivo: scritte e zoom scalati con la risoluzione
if (cfg.u) cfg.u *= scala;
cfg.zoom_off = Math.log2(scala);
const durata = cfg.durata || cfg.camera[cfg.camera.length - 1].t;
const t0 = parseFloat(opt('--da', '0')), t1 = Math.min(durata, parseFloat(opt('--a', String(durata))));

// server locale solo su 127.0.0.1 per la pagina e i font (le tessere arrivano da EOX/AWS)
const tipi = { '.html': 'text/html', '.ttf': 'font/ttf', '.js': 'text/javascript' };
const srv = http.createServer((q, r) => {
  const f = path.join(dir, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': tipi[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
}).listen(0, '127.0.0.1');
await new Promise(r => srv.once('listening', r));
const url = `http://127.0.0.1:${srv.address().port}/index.html`;

// Chromium di Playwright (npx playwright install chromium) oppure un altro Chrome/Chromium con CHROMIUM_PATH=/percorso/chrome
const args = ['--ignore-gpu-blocklist', '--enable-gpu-rasterization'];
if (process.platform === 'darwin') args.push('--use-angle=metal');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, headless: true, args });
const page = await browser.newPage({ viewport: { width: cfg.w, height: cfg.h }, deviceScaleFactor: 1 });
page.on('console', m => { if (m.type() === 'error') console.log('[pagina]', m.text().slice(0, 200)); });
await page.goto(url);
await page.evaluate(c => window.avvia(c), cfg);

const tmp = path.join(path.dirname(path.resolve(outPath)), '_fotogrammi_' + path.basename(outPath, '.mp4'));
fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
const n = Math.round((t1 - t0) * fps);
const inizio = Date.now();
for (let i = 0; i <= n; i++) {
  const t = t0 + i / fps;
  const ms = await page.evaluate(t => window.fotogramma(t), t);
  await page.screenshot({ path: path.join(tmp, String(i).padStart(5, '0') + '.png'), clip: { x: 0, y: 0, width: cfg.w, height: cfg.h } });
  if (i % Math.max(1, Math.round(fps)) === 0) console.log(`t=${t.toFixed(1)} s  attesa tessere ${Math.round(ms)} ms  (${i}/${n})`);
}
await browser.close(); srv.close();

execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(fps), '-i', path.join(tmp, '%05d.png'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', scala < 1 ? '23' : '16', '-preset', 'medium', '-movflags', '+faststart', outPath]);
const foglio = opt('--foglio');
if (foglio) execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', outPath, '-vf', `fps=${(16 / (t1 - t0)).toFixed(4)},scale=480:-1,tile=4x4`, '-frames:v', '1', foglio]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`fatto: ${outPath}  (${n + 1} fotogrammi, ${((Date.now() - inizio) / 1000).toFixed(0)} s)`);
