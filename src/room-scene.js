import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { PALETTE, physicalParams } from './theme/palette.ts';

// Metres are only a relative modelling unit. The clear room ratio is 8 : 12.4 : 5.76.
export const ROOM = Object.freeze({ depth: 8, width: 12.4, height: 5.76, backWallHeight: 3.82 });

const cache = new Map();
function surface(key) {
  if (!cache.has(key)) cache.set(key, new THREE.MeshPhysicalMaterial({ ...physicalParams(key), side: THREE.DoubleSide }));
  return cache.get(key);
}
function mesh(parent, geometry, key, xyz = [0, 0, 0], rotation = [0, 0, 0]) {
  const result = new THREE.Mesh(geometry, surface(key));
  result.position.set(...xyz);
  result.rotation.set(...rotation);
  result.userData.surfaceKey = key;
  parent.add(result);
  return result;
}
function box(parent, size, key, xyz, radius = 0) {
  const geometry = radius
    ? new RoundedBoxGeometry(...size, 3, Math.min(radius, ...size.map(value => value / 2 - 0.001)))
    : new THREE.BoxGeometry(...size);
  return mesh(parent, geometry, key, xyz);
}
function cylinder(parent, radiusTop, radiusBottom, height, key, xyz, segments = 32, openEnded = false) {
  return mesh(parent, new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments, 1, openEnded), key, xyz);
}
function sphere(parent, radius, key, xyz, scale = [1, 1, 1]) {
  const object = mesh(parent, new THREE.SphereGeometry(radius, 16, 10), key, xyz);
  object.scale.set(...scale);
  return object;
}
function ring(parent, radius, tube, key, xyz, rotation = [-Math.PI / 2, 0, 0]) {
  return mesh(parent, new THREE.TorusGeometry(radius, tube, 8, 40), key, xyz, rotation);
}
function rod(parent, from, to, radius, key) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const delta = end.clone().sub(start);
  const object = mesh(parent, new THREE.CylinderGeometry(radius, radius, delta.length(), 10), key, start.add(end).multiplyScalar(.5).toArray());
  object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
  return object;
}
function groupAt(parent, name, x, z) {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(x, 0, z);
  parent.add(group);
  return group;
}

function architecture(scene) {
  const { width, depth, height, backWallHeight } = ROOM;
  // No front wall and no ceiling. The blue band is a vertical opening behind the back wall.
  box(scene, [width, .06, depth], 'room.floor', [0, -.03, 0]);
  // Narrow strips interpolate exclusively between the two supplied floor colours.
  const near = new THREE.Color(PALETTE['room.floor'].hex);
  const far = new THREE.Color(PALETTE['room.floorFar'].hex);
  for (let index = 0; index < 20; index++) {
    const z = -depth / 2 + (index + .5) * depth / 20;
    const strip = mesh(scene, new THREE.PlaneGeometry(width, depth / 20 + .005), 'room.floor', [0, .005, z], [-Math.PI / 2, 0, 0]);
    strip.material = surface('room.floor').clone();
    strip.material.color.copy(far).lerp(near, index / 19);
  }
  box(scene, [width, backWallHeight, .06], 'room.backWall', [0, backWallHeight / 2, -depth / 2]);
  box(scene, [.06, height, depth], 'room.sideWall', [-width / 2, height / 2, 0]);
  box(scene, [.06, height, depth], 'room.sideWallR', [width / 2, height / 2, 0]);

  const top = new THREE.Color(PALETTE['room.opening.skyTop'].hex);
  const bottom = new THREE.Color(PALETTE['room.opening.skyBot'].hex);
  const openingHeight = height - backWallHeight;
  for (let index = 0; index < 20; index++) {
    const y = backWallHeight + (index + .5) * openingHeight / 20;
    const strip = box(scene, [width, openingHeight / 20 + .004, .025], 'room.opening.skyTop', [0, y, -depth / 2 - .055]);
    strip.material = surface('room.opening.skyTop').clone();
    strip.material.color.copy(bottom).lerp(top, index / 19);
  }

  // The supplied image places the orange door beyond the open front edge.
  // This apron lies outside the 8-unit clear room depth.
  box(scene, [width, .035, 2.15], 'room.floor', [0, -.03, 5.075]);
  const door = groupAt(scene, '入口门扇', .75, 4.98);
  box(door, [2.55, .045, 1.88], 'room.window.rail', [0, .02, 0], .015);
  box(door, [2.31, .018, 1.67], 'room.window.glass', [0, .054, 0], .008);
  for (const x of [-1.25, 1.25]) rod(door, [x, .08, -.91], [x, .08, .91], .028, 'room.window.casing');
  for (const z of [-.91, .91]) rod(door, [-1.25, .08, z], [1.25, .08, z], .028, 'room.window.casing');
  rod(door, [-.93, .13, .34], [-.93, .13, .58], .033, 'room.window.handle');
  rod(door, [-.93, .13, .58], [-.68, .13, .58], .033, 'room.window.handle');
  return door;
}

function bathtub(parent) {
  const g = groupAt(parent, '01 浴缸', 4.64, -.28);
  box(g, [1.9, .22, 3.65], 'bath.tub.shell', [0, .11, 0], .12);
  box(g, [1.57, .09, 3.3], 'bath.tub.inner', [0, .235, 0], .04);
  box(g, [1.34, .035, 3.04], 'bath.tub.water', [0, .29, 0], .017);
  for (const x of [-.86, .86]) box(g, [.17, .38, 3.65], 'bath.tub.shell', [x, .39, 0], .06);
  for (const z of [-1.75, 1.75]) box(g, [1.58, .38, .16], 'bath.tub.shell', [0, .39, z], .06);
  for (const x of [-.86, .86]) box(g, [.21, .055, 3.65], 'bath.tub.gloss', [x, .61, 0], .02);
  for (const z of [-1.75, 1.75]) box(g, [1.8, .055, .2], 'bath.tub.gloss', [0, .61, z], .02);
  cylinder(g, .07, .07, .13, 'bath.tub.spout', [0, .7, -1.48]);
  rod(g, [0, .75, -1.49], [0, .75, -1.18], .035, 'bath.tub.spout');
  return g;
}
function bathMat(parent) {
  const g = groupAt(parent, '02 浴垫', 2.86, .15);
  box(g, [.72, .035, 2.25], 'bath.mat', [0, .025, 0], .12);
  return g;
}
function toilet(parent) {
  const g = groupAt(parent, '03 马桶', 2.58, -2.48);
  box(g, [.86, .55, .36], 'bath.chair.back', [0, .85, -.38], .11);
  box(g, [.75, .21, .67], 'bath.chair.base', [0, .29, .16], .14);
  cylinder(g, .36, .31, .26, 'bath.chair.base', [0, .54, .19], 24);
  ring(g, .29, .065, 'bath.chair.back', [0, .72, .19]);
  cylinder(g, .2, .2, .015, 'bath.chair.drop', [0, .715, .19], 24);
  return g;
}
function stool(parent) {
  const g = groupAt(parent, '04 粉色圆凳', 5.07, 2.8);
  cylinder(g, .38, .38, .28, 'bath.stool', [0, .19, 0]);
  cylinder(g, .42, .42, .1, 'bath.stool', [0, .37, 0]);
  return g;
}
function slippers(parent) {
  const g = groupAt(parent, '05 拖鞋 ×2', 3.17, 2.68);
  [[-.3, .2, .28], [.25, -.14, -.35]].forEach(([x, z, angle]) => {
    const slipper = groupAt(g, '拖鞋', x, z);
    slipper.rotation.y = angle;
    box(slipper, [.34, .09, .7], 'pill.orange', [0, .07, 0], .045);
    box(slipper, [.29, .025, .58], 'pill.yellow', [0, .13, 0], .012);
    rod(slipper, [-.14, .21, -.08], [.14, .21, -.08], .035, 'counter.brush.pink');
    rod(slipper, [-.14, .17, -.19], [-.14, .21, -.08], .026, 'pill.white');
    rod(slipper, [.14, .17, -.19], [.14, .21, -.08], .026, 'pill.white');
  });
  return g;
}
function laundryBasket(parent) {
  const g = groupAt(parent, '06 洗衣篮', -2.18, 2.7);
  cylinder(g, .54, .44, .6, 'laundry.basket', [0, .32, 0], 20, true);
  cylinder(g, .44, .44, .035, 'laundry.basket', [0, .045, 0], 20);
  ring(g, .54, .035, 'laundry.basket', [0, .63, 0]);
  [
    [-.22, .68, -.08, 'laundry.clothes.blue'],
    [.19, .72, -.16, 'laundry.clothes.red'],
    [-.04, .79, .19, 'laundry.clothes.red'],
    [.27, .68, .19, 'laundry.clothes.blue'],
  ].forEach(([x, y, z, key], index) => {
    const cloth = sphere(g, .29, key, [x, y, z], [1.05, .46, .8]);
    cloth.rotation.y = index * .84;
  });
  return g;
}
function washer(parent) {
  const g = groupAt(parent, '07 洗衣机', -5.02, 2.68);
  box(g, [1.82, 1.78, 1.43], 'laundry.washer.body', [0, .89, 0], .09);
  box(g, [1.63, .23, .055], 'laundry.washer.panel', [0, 1.57, .73], .035);
  cylinder(g, .58, .58, .055, 'laundry.washer.panel', [0, .83, .747], 40).rotation.x = Math.PI / 2;
  cylinder(g, .49, .49, .06, 'laundry.washer.door', [0, .83, .79], 40).rotation.x = Math.PI / 2;
  ring(g, .53, .035, 'laundry.washer.panel', [0, .83, .83], [0, 0, 0]);
  cylinder(g, .07, .07, .06, 'laundry.washer.door', [-.56, 1.56, .77], 20).rotation.x = Math.PI / 2;
  box(g, [.27, .105, .05], 'laundry.washer.panel', [.06, 1.56, .77], .02);
  for (const x of [.5, .63, .76]) sphere(g, .033, 'laundry.washer.panel', [x, 1.56, .77]);
  return g;
}
function counter(parent) {
  const g = groupAt(parent, '08 台面 + 柜体', -3.16, -2.58);
  box(g, [4.88, 1.02, 1.38], 'counter.cabinet', [0, .51, 0], .07);
  box(g, [4.96, .11, 1.5], 'counter.top', [0, 1.08, 0], .055);
  return g;
}
function sink(parent) {
  const g = groupAt(parent, '09 水槽', -2.48, -2.58);
  cylinder(g, .59, .59, .035, 'counter.sink', [0, 1.16, 0], 40);
  ring(g, .61, .047, 'counter.sinkRing', [0, 1.2, 0]);
  cylinder(g, .09, .09, .017, 'counter.tap.base', [0, 1.19, 0]);
  return g;
}
function tapBase(parent) {
  const g = groupAt(parent, '10 水龙头底座', -2.48, -2.58);
  cylinder(g, .105, .105, .09, 'counter.tap.base', [0, 1.24, 0]);
  ring(g, .11, .018, 'counter.tap.base', [0, 1.3, 0]);
  return g;
}
function tapStem(parent) {
  const g = groupAt(parent, '11 水龙头细柄', -2.48, -2.58);
  rod(g, [0, 1.29, 0], [0, 1.97, 0], .027, 'counter.tap.stem');
  rod(g, [0, 1.95, 0], [0, 1.95, -.15], .028, 'counter.tap.stem');
  return g;
}
function counterItems(parent) {
  const g = groupAt(parent, '12 台面小物 ×3', -3.16, -2.58);
  const brush = box(g, [.32, .065, .2], 'counter.brush.pink', [-1.72, 1.18, .12], .045);
  brush.rotation.y = -.26;
  rod(g, [-1.7, 1.23, .12], [-1.4, 1.23, .34], .025, 'counter.brush.green');
  box(g, [.28, .09, .34], 'counter.brush.green', [1.88, 1.19, -.24], .035);
  cylinder(g, .105, .105, .075, 'counter.item.yellow', [1.88, 1.2, .33]);
  return g;
}
function blind(parent) {
  const g = groupAt(parent, '13 条纹百叶帘', 4.27, -3.84);
  g.position.y = 4.72;
  box(g, [1.78, .96, .035], 'soft.mat.stripeCyan', [0, 0, 0], .009);
  box(g, [1.9, .055, .065], 'soft.mat.border', [0, .49, .03], .012);
  for (let index = 0; index < 5; index++) {
    const key = index % 2 ? 'soft.mat.stripeLilac' : 'soft.mat.stripeCyan';
    box(g, [1.7, .075, .055], key, [0, .36 - index * .17, .04], .009);
  }
  for (const x of [-.9, .9]) box(g, [.055, 1.02, .065], 'soft.mat.border', [x, 0, .03], .012);
  return g;
}
function skylightPanel(parent) {
  const g = groupAt(parent, '14 天光白色片', -2.48, -3.82);
  g.position.y = 4.96;
  const vertices = new Float32Array([
    -2.05, .17, 0, 2.05, .17, 0, -1.8, -.28, 0,
    2.05, .17, 0, 1.8, -.28, 0, -1.8, -.28, 0,
  ]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  mesh(g, geometry, 'soft.towel');
  return g;
}

export function buildRoomScene(scene) {
  architecture(scene);
  const items = [
    bathtub(scene), bathMat(scene), toilet(scene), stool(scene), slippers(scene),
    laundryBasket(scene), washer(scene), counter(scene), sink(scene), tapBase(scene),
    tapStem(scene), counterItems(scene), blind(scene), skylightPanel(scene),
  ];
  scene.userData.surfaceMapItems = items;
  return items;
}
