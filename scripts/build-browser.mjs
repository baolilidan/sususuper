import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const assets = new URL('../dist/assets/', import.meta.url);
const files = readdirSync(assets);
const cssFile = files.find(name => name.endsWith('.css'));
const jsFile = files.find(name => name.endsWith('.js'));
if (!cssFile || !jsFile) throw new Error('Run npm run build before generating the browser file.');

const css = readFileSync(new URL(cssFile, assets), 'utf8');
const bundle = readFileSync(new URL(jsFile, assets), 'utf8').replace(/<\/script/gi, '<\\/script');
const preview = readFileSync(new URL('../preview.jpg', import.meta.url)).toString('base64');
const image = `data:image/jpeg;base64,${preview}`;

// The built bundle has no module imports. A classic inline script also works from file://.
const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>剖切房间 · 可旋转 3D 空间</title>
  <style>${css}</style>
</head>
<body>
  <div id="app"><img src="${image}" alt="剖切房间静态预览，3D 场景正在加载" style="display:block;width:100%;height:100vh;object-fit:contain"></div>
  <script>window.__ROOM_FALLBACK_IMAGE__ = ${JSON.stringify(image)};</script>
  <script>${bundle}</script>
</body>
</html>`;

for (const name of ['3d-room.html', 'standalone.html']) {
  writeFileSync(new URL(name, root), html);
}
const pagesDirectory = new URL('docs/', root);
mkdirSync(pagesDirectory, { recursive: true });
writeFileSync(new URL('index.html', pagesDirectory), html);
console.log(`Created 3d-room.html (${Math.round(Buffer.byteLength(html) / 1024)} KiB), with embedded preview and 3D scene.`);
