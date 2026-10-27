# 剖切房间 · 静态材质场景

依据用户提供的 `reference_room.png`、`SURFACE_MAP.md` 和 `src/theme/palette.ts` 制作。参考图是一点透视的剖切房间图，因此场景按面和部件着色，没有把整张图投影到模型上。上传原图后，已按用户确认的优先级校准左右和前后摆位；原图与映射表的差异记录在 `NOTES.md`。

房间内净尺寸按进深、宽、高 `8 : 12.4 : 5.76` 起步，仅有地面、后墙和左右侧墙；后墙之上留天光开口。14 项物件由低模代理体与分部材质搭建，材质颜色和参数统一取自色板。

## 运行

需要 Node.js 20.19+ 或 22.12+。

```bash
npm ci
npm run dev
```

浏览器打开终端显示的本地地址。用鼠标拖动检查空间、滚轮缩放、双击重置。生产构建：`npm run build`。

## 直接用浏览器打开

下载 `3d-room-browser.zip` 并解压，双击其中的 `3d-room.html`。页面已内嵌 Three.js、场景代码和静态封面，不需要安装依赖或联网。鼠标左键拖动旋转，滚轮缩放；触屏可拖动和双指缩放。右上角也有放大、缩小、重置按钮。

聊天内的 HTML 文件预览器可能禁用脚本或 WebGL，此时只会显示静态封面。请将 ZIP 下载到电脑，用 Chrome、Edge、Safari 或 Firefox 打开 HTML 文件。

开发者可运行 `npm run build:browser` 重新生成 `3d-room.html`、`standalone.html` 和用于 GitHub Pages 的 `docs/index.html`。若要公开在线预览，在仓库 Settings → Pages 中选择从 `main` 分支的 `/docs` 目录发布。`preview.png` 是当前场景截图，`preview.jpg` 是较小副本；源码更新后，应重新制作截图和下载包。

## 文件

- `src/room-scene.js`：房间与 14 项可见元素的几何、位置和表面键，以原图构图为主。
- `src/theme/palette.ts`：用户提供的唯一材质色源，以及 `physicalParams(key)`。
- `SURFACE_MAP.md`：用户提供的物件清单和表面映射。
- `reference_room.png`：用户上传的原始参考图，2482 × 1755 像素。
- `src/main.js`：页面入口、相机与基础场景显示。灯光和阴影尚未按映射表精调。
- `NOTES.md`：动手前的仓库核对记录。

本轮聚焦静态建模和分部上色。物件点击、消散动效与详情界面留待后续阶段。
