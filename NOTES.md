# 场景改造前核对

- 项目：Vite 7.3.7 + 原生 JavaScript；Three.js 0.180.0，使用 `OrbitControls` 和 `RoundedBoxGeometry`。
- 入口：`index.html` 加载 `src/main.js`；页面样式在 `src/style.css`。
- 模型：没有 GLB、GLTF 或 OBJ 文件；房间和物件均由 `src/main.js` 中的 Three.js 几何体生成。旧场景的材质由同文件的 `material()`、`box()`、`roundBox()` 等函数与分散的颜色字面量定义。
- 现有相机：`OrthographicCamera`；渲染器使用 sRGB 输出和 ACES 色调映射。
- 启动：`npm ci` 后 `npm run dev`；构建：`npm run build`。
- 本轮素材：用户提供的 `SURFACE_MAP.md` 与 `palette.ts` 可作为本地附件读取。首次建模时，`reference_room.png` 仅在聊天中可查看；当时未从图像取色或贴图，按用户给定的物件映射和色板建模。
- 参考图应按一点透视的剖切房间理解，不能当作正投影顶视图。新要求明确允许用低模代理体替换旧的示意几何；不做整图投影。

## 原图补充核对

- 随后从用户上传的 ZIP 中提取了 `reference_room.png`，原文件为 2482 × 1755 像素 RGBA PNG，SHA-256：`c50165a55693131f60ed550c1086c59a5863ae569325a78410cc3f05bd538b6b`。
- 原图与 `SURFACE_MAP.md` 的方向和前后位置都不同：原图是洗衣机与洗衣篮靠左前、粉色台面靠左后、浴缸靠右；映射表另记 1265 × 890 像素，与上传的原图尺寸也不符。

## 原图优先的布局校准

用户确认以实际上传的 `reference_room.png` 为准。现在的场景采用原图方向：洗衣机与洗衣篮靠入口左侧，粉色台面沿左后侧，浴缸在右侧，入口门扇位于前方。图中可明确辨认的马桶、拖鞋、粉色百叶帘与白色天光片，已取代映射表中对应的误识别名称与代理形状。

`SURFACE_MAP.md` 与 `palette.ts` 保留上传原件。由于色板没有为上述重新识别的物件提供新键，模型仍调用色板中原有的材质键，没有在模型代码中另写色值。未根据透视图臆测真实尺寸；物件坐标仍是供下一轮核对的相对值。
