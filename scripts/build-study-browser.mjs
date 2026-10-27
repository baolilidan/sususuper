import { build } from 'esbuild';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const output = await build({
  entryPoints: [new URL('../src/study.js', import.meta.url).pathname],
  outdir: '/tmp/sususuper-study-bundle',
  bundle: true,
  format: 'iife',
  platform: 'browser',
  write: false,
  minify: true,
});
const javascript = output.outputFiles.find(file => file.path.endsWith('.js'))?.text;
const stylesheet = output.outputFiles.find(file => file.path.endsWith('.css'))?.text;
if (!javascript || !stylesheet) throw new Error('Study JavaScript or stylesheet could not be bundled.');

const roomImage = readFileSync(new URL('../reference_room.png', import.meta.url)).toString('base64');
const coverImage = readFileSync(new URL('../study-a.png', import.meta.url)).toString('base64');
const roomData = `data:image/png;base64,${roomImage}`;
const coverData = `data:image/png;base64,${coverImage}`;
const html = `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>层间 · 两种空间视觉草图</title><style>${stylesheet}</style></head><body><div id="app"><img src="${coverData}" alt="房间视觉样稿静态封面" style="display:block;width:100%;height:100vh;object-fit:contain"></div><script>window.__ROOM_REFERENCE_IMAGE__=${JSON.stringify(roomData)};</script><script>${javascript.replace(/<\/script/gi, '<\\/script')}</script></body></html>`;
writeFileSync(new URL('../study-browser.html', import.meta.url), html);
const docs = new URL('../docs/', import.meta.url);
mkdirSync(docs, { recursive: true });
writeFileSync(new URL('study.html', docs), html);
console.log(`Created study-browser.html (${Math.round(Buffer.byteLength(html) / 1024)} KiB).`);
