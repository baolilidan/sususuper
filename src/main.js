import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildRoomScene, ROOM } from './room-scene.js';
import { PALETTE } from './theme/palette.ts';
import './style.css';

const inventory = [
  '浴缸', '浴垫', '马桶', '粉色圆凳', '拖鞋 ×2', '洗衣篮', '洗衣机',
  '台面 + 柜体', '水槽', '水龙头底座', '水龙头细柄', '台面小物 ×3', '条纹百叶帘', '天光白色片',
];

document.querySelector('#app').innerHTML = `
  <main class="shell">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark"></span><span class="eyebrow">SURFACE / ROOM STUDY</span></div>
      <span class="eyebrow">ROOM / 001</span>
      <h1>剖切房间<br>材质实验</h1>
      <p class="intro">按上传的原图校准物件方向与位置。后墙上方是天光开口，房间前方与顶部敞开。</p>
      <div class="divider"></div>
      <div class="list-title eyebrow"><span>场景物件</span><span>14</span></div>
      <div class="object-list">${inventory.map((name, index) => `<div class="inventory-row"><span>${String(index + 1).padStart(2, '0')}</span><strong>${name}</strong></div>`).join('')}</div>
      <div class="sidebar-bottom">SURFACE_MAP.md / palette.ts<br>本轮：体块、位置、分部材质</div>
    </aside>
    <section class="stage" aria-label="剖切房间静态场景">
      <div class="stage-top"><div class="room-no">ROOM / 01<strong>14 项物件 · 静态场景</strong></div><div class="top-pill">SURFACE STUDY</div></div>
      <div class="stage-bottom"><span>拖动查看空间 · 滚轮缩放<br>双击重置视角</span><span class="coords">DEPTH : WIDTH : HEIGHT<br>1 : 1.55 : 0.72</span></div>
      <div class="view-controls" aria-label="缩放控制"><button data-action="zoom-in" aria-label="放大">＋</button><button data-action="zoom-out" aria-label="缩小">－</button><button data-action="reset" aria-label="重置视角">↺</button></div>
    </section>
  </main>
`;

const stage = document.querySelector('.stage');
function startRoom() {
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .91;
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-9, 9, 8, -8, .1, 100);
const viewTarget = new THREE.Vector3(0, ROOM.height * .37, .45);
const initialPosition = new THREE.Vector3(-1.5, 9.6, 15.2);
camera.position.copy(initialPosition);
camera.zoom = 1;
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(viewTarget);
controls.enableDamping = true;
controls.dampingFactor = .06;
controls.minZoom = .65;
controls.maxZoom = 2.7;
controls.minPolarAngle = .4;
controls.maxPolarAngle = 1.38;
controls.minAzimuthAngle = -.7;
controls.maxAzimuthAngle = .7;
controls.enablePan = false;

// Existing simple illumination is retained; lighting and shadows are outside this pass.
scene.add(new THREE.HemisphereLight(PALETTE['bath.tub.gloss'].hex, PALETTE['bath.tub.gloss'].hex, 1.9));
const light = new THREE.DirectionalLight(PALETTE['room.window.casing'].hex, 1.8);
light.position.set(-4, 12, 7);
scene.add(light);
buildRoomScene(scene);

function resetView() {
  camera.position.copy(initialPosition);
  camera.zoom = 1;
  camera.updateProjectionMatrix();
  controls.target.copy(viewTarget);
  controls.update();
}
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
  const action = button.dataset.action;
  if (action === 'reset') return resetView();
  camera.zoom = THREE.MathUtils.clamp(camera.zoom * (action === 'zoom-in' ? 1.2 : 1 / 1.2), controls.minZoom, controls.maxZoom);
  camera.updateProjectionMatrix();
}));
renderer.domElement.addEventListener('dblclick', resetView);

function resize() {
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const aspect = width / height;
  const span = aspect < .8 ? 17 : 12.7;
  camera.left = -span * aspect / 2;
  camera.right = span * aspect / 2;
  camera.top = span / 2;
  camera.bottom = -span / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
window.addEventListener('resize', resize);
resize();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
}

try {
  startRoom();
} catch (error) {
  // A downloaded page still shows the room when WebGL is unavailable.
  const fallback = document.createElement('img');
  fallback.className = 'scene-fallback';
  fallback.alt = '剖切房间静态预览';
  fallback.src = window.__ROOM_FALLBACK_IMAGE__ || '/preview.jpg';
  document.querySelector('#app').replaceChildren(fallback);
  console.error('3D 场景无法启动，已显示静态预览。', error);
}
