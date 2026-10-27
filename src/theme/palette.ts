/**
 * 塑料花粉 · 场景色板 / Scene Palette
 * 取自参考图（1520×1520）的像素级采样，5×5 中位数去纸纹噪点。
 * 每个色值都是唯一色源：渲染时一律从此处取值，禁止在模型代码里另写 hex。
 * 表面键名与几何体的对应关系见 SURFACE_MAP.md。
 */

export type MaterialKind =
  | '乳胶漆' | '瓷砖' | '塑料' | '亚光塑料' | '玻璃' | '陶瓷' | '水'
  | '织物' | '糖衣' | '金属' | '烤漆' | '背景' | '高光' | '描边';

export interface SurfaceDef {
  /** 十六进制色值，sRGB */
  hex: string;
  /** 中文语义名 */
  label: string;
  /** 材质类别 */
  kind: MaterialKind;
  /** 粗糙度 0–1 */
  roughness: number;
  /** 金属度 0–1 */
  metalness: number;
  /** 清漆层强度 0–1 */
  clearcoat: number;
  /** 透射率 0–1，仅玻璃/水/陶瓷有效 */
  transmission?: number;
  /** 透射厚度，仅玻璃/水有效 */
  thickness?: number;
  /** 织物绒感 0–1，仅织物有效 */
  sheen?: number;
}

const D = (
  hex: string, label: string, kind: MaterialKind,
  roughness: number, metalness: number, clearcoat: number,
  extra: Partial<SurfaceDef> = {},
): SurfaceDef => ({ hex, label, kind, roughness, metalness, clearcoat, ...extra });

export const PALETTE = {
  // ── 建筑体块 ────────────────────────────────────────────
  'room.floor':           D('#8FD1EF', '地面蓝', '瓷砖', 0.16, 0.0, 0.50),
  'room.floorFar':        D('#80CCED', '地面蓝（远端）', '瓷砖', 0.16, 0.0, 0.50),
  'room.backWall':        D('#F3F1ED', '后墙米白', '乳胶漆', 0.95, 0.0, 0.0),
  'room.sideWall':        D('#F5E9A9', '侧墙黄', '乳胶漆', 0.95, 0.0, 0.0),
  'room.sideWallR':       D('#F5E8A5', '侧墙黄（右）', '乳胶漆', 0.95, 0.0, 0.0),
  'room.opening.skyTop':  D('#C9E2EF', '顶部开口天光·上', '背景', 1.0, 0.0, 0.0),
  'room.opening.skyBot':  D('#92CBEA', '顶部开口天光·下', '背景', 1.0, 0.0, 0.0),
  'room.window.outline':  D('#BEA295', '窗描边', '描边', 0.70, 0.0, 0.0),
  'room.window.edge':     D('#F4D8C3', '窗框过渡桃', '烤漆', 0.40, 0.0, 0.30),
  'room.window.casing':   D('#F3F2EE', '窗框奶白', '烤漆', 0.45, 0.0, 0.30),
  'room.window.glass':    D('#F2B958', '窗玻璃橙', '玻璃', 0.06, 0.0, 0.0, { transmission: 0.55, thickness: 0.02 }),
  'room.window.rail':     D('#F4E07A', '窗横档黄', '烤漆', 0.40, 0.0, 0.30),
  'room.window.handle':   D('#F4F3EF', '窗把手白', '金属', 0.25, 0.90, 0.0),

  // ── 卫浴 ────────────────────────────────────────────────
  'bath.tub.shell':       D('#F7F6F2', '浴缸外壳奶白', '塑料', 0.22, 0.0, 0.70),
  'bath.tub.inner':       D('#F5F1B5', '浴缸内壁淡黄', '塑料', 0.25, 0.0, 0.60),
  'bath.tub.water':       D('#6DBBF0', '浴缸水蓝', '水', 0.05, 0.0, 0.0, { transmission: 0.85, thickness: 0.18 }),
  'bath.tub.spout':       D('#F5CC01', '浴缸出水口黄', '金属', 0.30, 0.70, 0.0),
  'bath.tub.gloss':       D('#F5F4F0', '浴缸高光白', '高光', 0.05, 0.0, 0.0),
  'bath.mat':             D('#F5F4B2', '浴垫淡黄', '织物', 0.92, 0.0, 0.0, { sheen: 0.5 }),
  'bath.stool':           D('#F67098', '粉色圆凳', '塑料', 0.30, 0.0, 0.50),
  'bath.chair.back':      D('#D6EBAE', '儿童椅背浅绿', '塑料', 0.30, 0.0, 0.50),
  'bath.chair.drop':      D('#72BBBF', '儿童椅水滴青', '塑料', 0.30, 0.0, 0.50),
  'bath.chair.base':      D('#E6F182', '儿童椅底座黄绿', '塑料', 0.35, 0.0, 0.40),

  // ── 洗衣 ────────────────────────────────────────────────
  'laundry.washer.body':  D('#67B955', '洗衣机机身绿', '塑料', 0.30, 0.0, 0.40),
  'laundry.washer.door':  D('#6EC4AD', '洗衣机门青', '玻璃', 0.08, 0.0, 0.0, { transmission: 0.70, thickness: 0.01 }),
  'laundry.washer.panel': D('#AADDBB', '洗衣机面板浅绿', '塑料', 0.35, 0.0, 0.35),
  'laundry.basket':       D('#F4C898', '洗衣篮橙', '塑料', 0.35, 0.0, 0.30),
  'laundry.clothes.red':  D('#F55B68', '衣物红', '织物', 0.92, 0.0, 0.0, { sheen: 0.6 }),
  'laundry.clothes.blue': D('#62BCD9', '衣物蓝', '织物', 0.92, 0.0, 0.0, { sheen: 0.6 }),

  // ── 台面区 ──────────────────────────────────────────────
  'counter.top':          D('#F5B1CF', '台面浅粉', '亚光塑料', 0.55, 0.0, 0.15),
  'counter.cabinet':      D('#F5457B', '柜体深粉', '亚光塑料', 0.40, 0.0, 0.30),
  'counter.sink':         D('#319FF0', '水槽蓝', '陶瓷', 0.15, 0.0, 0.60),
  'counter.sinkRing':     D('#F5F4F0', '水槽白圈', '陶瓷', 0.15, 0.0, 0.60),
  'counter.tap.base':     D('#EFC8DE', '龙头底座粉', '塑料', 0.25, 0.0, 0.50),
  'counter.tap.stem':     D('#D9AE45', '拖把柄金黄', '金属', 0.35, 0.60, 0.0),
  'counter.brush.pink':   D('#F44377', '粉色小刷', '塑料', 0.30, 0.0, 0.40),
  'counter.brush.green':  D('#72C78E', '绿色小物', '塑料', 0.30, 0.0, 0.40),
  'counter.item.yellow':  D('#E4CA7B', '黄色小物', '塑料', 0.35, 0.0, 0.35),

  // ── 软装 ────────────────────────────────────────────────
  'soft.mat.border':      D('#F364A0', '条纹垫粉边', '织物', 0.90, 0.0, 0.0, { sheen: 0.4 }),
  'soft.mat.stripeCyan':  D('#BCE0EF', '条纹垫浅青条', '织物', 0.90, 0.0, 0.0, { sheen: 0.4 }),
  'soft.mat.stripeLilac': D('#D0B5D7', '条纹垫淡紫粉条', '织物', 0.90, 0.0, 0.0, { sheen: 0.4 }),
  'soft.towel':           D('#F5F4F0', '白色浴巾', '织物', 0.95, 0.0, 0.0, { sheen: 0.8 }),

  // ── 药 ──────────────────────────────────────────────────
  'pill.orange':          D('#F08820', '药丸橙', '糖衣', 0.12, 0.0, 1.0),
  'pill.yellow':          D('#F0D848', '药丸黄', '糖衣', 0.12, 0.0, 1.0),
  'pill.white':           D('#F5F4F0', '药丸白', '糖衣', 0.12, 0.0, 1.0),
} as const satisfies Record<string, SurfaceDef>;

export type SurfaceKey = keyof typeof PALETTE;

/** 织物的绒感高光色，跟随本体色提亮 */
export const SHEEN_COLOR: Partial<Record<SurfaceKey, string>> = {
  'bath.mat':             '#FFFDF0',
  'laundry.clothes.red':  '#FFB8C2',
  'laundry.clothes.blue': '#BEE9F8',
  'soft.mat.border':      '#FFB3D2',
  'soft.mat.stripeCyan':  '#E4F7FF',
  'soft.mat.stripeLilac': '#EFDDF6',
  'soft.towel':           '#FFFFFF',
};

/** 由 SurfaceDef 生成 three.js MeshPhysicalMaterial 参数 */
export function physicalParams(key: SurfaceKey) {
  const d = PALETTE[key] as SurfaceDef;
  return {
    color: d.hex,
    roughness: d.roughness,
    metalness: d.metalness,
    clearcoat: d.clearcoat,
    ...(d.transmission != null ? { transmission: d.transmission, thickness: d.thickness ?? 0.1 } : {}),
    ...(d.sheen != null ? { sheen: d.sheen, sheenColor: SHEEN_COLOR[key] ?? d.hex } : {}),
  };
}
