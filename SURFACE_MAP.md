---
AIGC:
    Label: "1"
    ContentProducer: 001191110102MACQD9K64018705
    ProduceID: 7629248116776141062-data_volume/files/所有对话/主对话/3d_ref/SURFACE_MAP.md
    ReservedCode1: ""
    ContentPropagator: 001191110102MACQD9K64028705
    PropagateID: 1303390657984905#1793086515778
    ReservedCode2: ""
---
# 表面映射表 · Surface Map

参考图：`reference_room.png`（1265×890，由 1520×1520 原图裁切）
色板：`palette.ts`｜色板预览：`palette_swatch.png`

---

## 0. 一句话前提（重要，别搞反了）

**参考图是「一点透视的剖切房间图」，不是正投影顶视图。**

- 图中没有可供投影的俯视平面，因此 **不要用顶视平面投影（planar top projection）把整张图贴到模型上**。
- 正确做法：**按面 / 按部件分别着色**。建筑体块用面材质，物件用低模代理体 + 分部材质。
- 图中"上方那片蓝"不是天花板，是**后墙之上的开口（天光）**；后墙米白只到开口下沿为止。

---

## 1. 建筑体块

| 体块 | 说明 | 表面键 |
|---|---|---|
| 地面 | 蓝色瓷砖，向远端略深 | `room.floor` / `room.floorFar` |
| 后墙 | 米白，位于房间深处，占墙面下 2/3 | `room.backWall` |
| 左墙 | 黄色，室内面 | `room.sideWall` |
| 右墙 | 黄色，室内面 | `room.sideWallR` |
| 顶部开口 | 后墙之上的天光背景，做一片渐变平面即可 | `room.opening.skyTop` → `room.opening.skyBot` |
| 外开窗扇 | 位于开口带内，梯形上宽下窄，橙色玻璃 + 奶白窗框 + 右侧白色把手 | `room.window.glass` / `.casing` / `.rail` / `.handle` / `.outline` |

**建模：** 一个长方体房间，**只保留 后墙 + 左右侧墙 + 地面**，去掉前墙与天花板（剖切）。
内部净尺寸比例起步用 **进深 : 宽 : 高 ≈ 1 : 1.55 : 0.72**，再按参考图中各物件贴墙关系微调。

---

## 2. 物件清单与位置

> 坐标以"地面 y=0，房间中心为原点"计；左右以参考图方向为准。

| # | 物件 | 位置关系 | 几何代理建议 | 表面键 |
|---|---|---|---|---|
| 1 | 浴缸 | 靠左墙内侧，长轴沿进深方向，占左侧 2/3 | 圆角长方体挖槽（外壳）+ 内胆 + 水面 | `bath.tub.shell` `.inner` `.water` `.spout` `.gloss` |
| 2 | 浴垫 | 浴缸右侧，与浴缸平行，纵向 | 圆角薄板 | `bath.mat` |
| 3 | 儿童椅 | 浴缸右前方地面 | 椅背（圆角板）+ 水滴贴面 + 底座 | `bath.chair.back` `.drop` `.base` |
| 4 | 粉色圆凳 | 左后角地面 | 扁圆柱 | `bath.stool` |
| 5 | 药丸 ×2 | 左中部地面（浴缸与后墙之间） | 胶囊体（旋转错开） | `pill.orange` `.yellow` `.white` |
| 6 | 洗衣篮 | 右后角地面 | 开口圆台 + 内部衣物团块 | `laundry.basket` `.clothes.red` `.clothes.blue` |
| 7 | 洗衣机 | 右侧墙，向前凸出（机身有厚度） | 圆角立方体 + 圆形舱门 + 顶部面板条 + 指示灯 | `laundry.washer.body` `.door` `.panel` |
| 8 | 台面 + 柜体 | 右侧墙中段，沿墙一字排开 | 台面板 + 柜体块 | `counter.top` `.cabinet` |
| 9 | 水槽 | 嵌在柜体内 | 内凹圆槽 + 白色圈边 | `counter.sink` `.sinkRing` |
| 10 | 水龙头底座 | 水槽中心 | 小圆柱 + 圆环 | `counter.tap.base` |
| 11 | 拖把柄 | 水槽中心向下伸出 | 细长圆柱 | `counter.tap.stem` |
| 12 | 台面小物 ×3 | 柜体面板上：左（粉刷+绿柄）、右上（绿色矩形）、右下（黄色圆形） | 小块体 | `counter.brush.pink` `.brush.green` `.item.yellow` |
| 13 | 条纹地垫 | 左前角地面 | 圆角薄板 + 条纹贴图 | `soft.mat.border` `.stripeCyan` `.stripeLilac` |
| 14 | 白色浴巾 | 地面中前 | 扁平圆角矩形 | `soft.towel` |

---

## 3. 材质参数对照

`palette.ts` 里每个色值都带 `roughness / metalness / clearcoat / transmission / sheen`，直接用 `physicalParams(key)` 取。

| 材质类别 | 关键参数 | 用在 |
|---|---|---|
| 乳胶漆 | roughness 0.95 | 墙 |
| 瓷砖 | roughness 0.16 + clearcoat 0.5 | 地面 |
| 塑料 | roughness 0.22–0.35 + clearcoat 0.4–0.7 | 浴缸、洗衣机、椅子、圆凳、小物 |
| 亚光塑料 | roughness 0.4–0.55 | 台面、柜体 |
| 陶瓷 | roughness 0.15 + clearcoat 0.6 | 水槽 |
| 玻璃 | transmission 0.55–0.70 | 窗玻璃、洗衣机门 |
| 水 | transmission 0.85 + thickness 0.18 | 浴缸水 |
| 织物 | roughness 0.9–0.95 + sheen 0.4–0.8 | 衣物、地垫、浴巾、浴垫 |
| 糖衣 | roughness 0.12 + clearcoat 1.0 | 药丸 |
| 金属 | metalness 0.6–0.9 | 把手、出水口、拖把柄 |

> 织物的 `sheenColor` 见 `palette.ts` 的 `SHEEN_COLOR`，跟随本体色提亮。

---

## 4. 光照与色彩管线

这是"看起来像不像"的最大杠杆，**优先级高于任何贴图**：

- `scene.environment` = `RoomEnvironment` + `PMREMGenerator`
- 主光带阴影 + 补光 + 轮廓光；`shadowMap.type = PCFSoftShadowMap`
- `renderer.toneMapping = ACESFilmicToneMapping`；`toneMappingExposure` 可调
- `renderer.outputColorSpace = SRGBColorSpace`
- 地面加接触阴影（否则模型会"飘"）

---

## 5. 可选叠加：暴露源编号

这张图里的物件本身就是微塑料的**暴露源**。若要在等距 3D 上叠加编号图层，可直接复用场所前缀规则：

| 编号 | 对应物件 | 暴露逻辑 |
|---|---|---|
| `Tub 1` | 浴缸 | 塑料浴缸本体 |
| `Washer 1` | 洗衣机 | 化纤织物洗涤释放纤维 |
| `Basket 1` | 洗衣篮 + 衣物 | 化纤衣物聚集 |
| `Rug 1` | 条纹地垫 / 浴垫 | 合成纤维摩擦 |
| `Towel 1` | 白色浴巾 | 棉/混纺织物，每次水洗脱落 |
| `Pill 1` | 药丸 | 干预端 |

编号以 `MeshBasicMaterial` 贴片或 CSS2D 标注呈现，**不参与写实渲染**，保持与场景的真实感分离。

---

> 本内容由 Coze AI 生成，请遵循相关法律法规及《人工智能生成合成内容标识办法》使用与传播。
