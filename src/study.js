import { PALETTE } from './theme/palette.ts';
import './study.css';

const colors = {
  paper: PALETTE['room.backWall'].hex,
  line: PALETTE['room.window.outline'].hex,
  muted: PALETTE['room.window.edge'].hex,
  pink: PALETTE['counter.cabinet'].hex,
  green: PALETTE['laundry.washer.body'].hex,
  orange: PALETTE['laundry.basket'].hex,
  blue: PALETTE['room.floorFar'].hex,
  wall: PALETTE['room.sideWall'].hex,
};
for (const [name, value] of Object.entries(colors)) {
  document.documentElement.style.setProperty(`--${name}`, value);
}

const items = [
  { id: 'washer', number: '01', title: '洗衣机', en: 'WASHING MACHINE', note: '靠近入口的左侧', color: colors.green },
  { id: 'basket', number: '02', title: '脏衣篓的衣服', en: 'LAUNDRY BASKET', note: '与洗衣机相邻', color: colors.orange },
  { id: 'slippers', number: '03', title: '拖鞋', en: 'SLIPPERS', note: '散落在右侧地面', color: colors.pink },
];

document.querySelector('#app').innerHTML = `
  <main class="study-page">
    <header class="study-header">
      <a class="study-brand" href="#" aria-label="回到房间初始视图">层间 <span>·</span> LAYERED ROOM</a>
      <div class="study-header-right">
        <div class="study-view-switch" role="group" aria-label="切换视觉草图">
          <button data-view="hybrid" class="is-current">局部透叠</button>
          <button data-view="flat">原图对照</button>
        </div>
        <span class="study-edition">ROOM STUDY / 01</span>
      </div>
    </header>
    <div class="study-content">
      <aside class="study-copy">
        <p class="study-kicker">空间视觉样稿</p>
        <h1>一间房间，<br>三个入口。</h1>
        <p class="study-intro">从你提供的画面出发，让颜色、线条和物件先留在原来的关系里。</p>
        <div class="study-rule"></div>
        <p class="study-section-label">可探索的物件 <span>03</span></p>
        <div class="study-list">
          ${items.map(item => `<button class="study-list-item" data-select="${item.id}"><span>${item.number}</span><strong>${item.title}</strong><i aria-hidden="true">↗</i></button>`).join('')}
        </div>
        <p class="study-footnote">拖动画面平移 · 滚轮缩放<br>点选物件查看局部</p>
      </aside>
      <section class="study-stage" data-view="hybrid" aria-label="可缩放的房间图">
        <div class="study-viewport">
          <div class="study-frame"><div class="study-artwork">
            <img class="study-image" src="${window.__ROOM_REFERENCE_IMAGE__ || '/reference_room.png'}" alt="浅色剖切房间：黄色侧墙、蓝色天光与地面、卫浴和洗衣物件" draggable="false" />
            <svg class="study-room-layers" viewBox="0 0 2482 1755" aria-hidden="true">
              <path class="study-wall-left" d="M8 4 526 400 526 1299 8 1750Z" />
              <path class="study-wall-right" d="M2474 4 1966 400 1966 1299 2474 1750Z" />
              <path class="study-floor-layer" d="M526 1299 1966 1299 2474 1750 8 1750Z" />
            </svg>
            <svg class="study-hotspots" viewBox="0 0 2482 1755" role="group" aria-label="可点击物件">
              <g class="study-hotspot" data-id="washer" tabindex="0" role="button" aria-label="洗衣机" style="--outline:var(--green)">
                <rect class="study-echo" x="582" y="988" width="312" height="334" rx="22" />
                <rect class="study-target" x="563" y="975" width="312" height="334" rx="22" />
                <circle class="study-pin" cx="550" cy="1004" r="25" /><text class="study-pin-text" x="550" y="1005">01</text>
              </g>
              <g class="study-hotspot" data-id="basket" tabindex="0" role="button" aria-label="脏衣篓的衣服" style="--outline:var(--orange)">
                <ellipse class="study-echo" cx="1032" cy="1198" rx="103" ry="96" />
                <ellipse class="study-target" cx="1014" cy="1186" rx="103" ry="96" />
                <circle class="study-pin" cx="1120" cy="1114" r="25" /><text class="study-pin-text" x="1120" y="1115">02</text>
              </g>
              <g class="study-hotspot" data-id="slippers" tabindex="0" role="button" aria-label="拖鞋" style="--outline:var(--pink)">
                <rect class="study-echo" x="1524" y="1140" width="131" height="49" rx="25" transform="rotate(-23 1590 1165)" />
                <rect class="study-echo" x="1570" y="1184" width="131" height="49" rx="25" transform="rotate(-23 1636 1209)" />
                <rect class="study-target" x="1510" y="1128" width="131" height="49" rx="25" transform="rotate(-23 1576 1153)" />
                <rect class="study-target" x="1556" y="1172" width="131" height="49" rx="25" transform="rotate(-23 1622 1197)" />
                <circle class="study-pin" cx="1700" cy="1166" r="25" /><text class="study-pin-text" x="1700" y="1167">03</text>
              </g>
            </svg>
          </div></div>
        </div>
        <div class="study-stage-top">01 / 房间 <span>局部透叠实验</span></div>
        <div class="study-controls" aria-label="画面缩放控制">
          <button data-action="zoom-out" aria-label="缩小">−</button>
          <span class="study-zoom">100%</span>
          <button data-action="zoom-in" aria-label="放大">＋</button>
          <button data-action="reset" aria-label="重置视图">↺</button>
        </div>
        <div class="study-tooltip" role="status"></div>
      </section>
    </div>
    <div class="study-card" aria-live="polite" hidden>
      <button class="study-close" aria-label="关闭物件卡片">×</button>
      <span class="study-card-index"></span>
      <h2></h2>
      <p></p>
      <div class="study-card-line"></div>
      <span class="study-card-caption">ROOM / 01</span>
    </div>
  </main>
`;

const viewport = document.querySelector('.study-viewport');
const artwork = document.querySelector('.study-artwork');
const tooltip = document.querySelector('.study-tooltip');
const card = document.querySelector('.study-card');
const zoomText = document.querySelector('.study-zoom');
const state = { scale: 1, x: 0, y: 0, down: null, view: 'hybrid' };

function draw() {
  artwork.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
  zoomText.textContent = `${Math.round(state.scale * 100)}%`;
}
function zoom(next, clientX, clientY) {
  const target = Math.min(2.8, Math.max(1, next));
  const rect = viewport.getBoundingClientRect();
  const x = clientX - rect.left - rect.width / 2;
  const y = clientY - rect.top - rect.height / 2;
  const ratio = target / state.scale;
  state.x = x - (x - state.x) * ratio;
  state.y = y - (y - state.y) * ratio;
  state.scale = target;
  draw();
}
function reset() {
  state.scale = 1;
  state.x = 0;
  state.y = 0;
  draw();
}
function select(id) {
  const item = items.find(candidate => candidate.id === id);
  if (!item) return;
  card.querySelector('.study-card-index').textContent = `${item.number} / ${item.en}`;
  card.querySelector('h2').textContent = item.title;
  card.querySelector('p').textContent = item.note;
  card.style.setProperty('--object-color', item.color);
  card.hidden = false;
  document.querySelectorAll('[data-select]').forEach(button => button.classList.toggle('is-active', button.dataset.select === id));
  document.querySelectorAll('.study-hotspot').forEach(hotspot => hotspot.classList.toggle('is-selected', hotspot.dataset.id === id));
}

viewport.addEventListener('wheel', event => {
  event.preventDefault();
  zoom(state.scale * Math.exp(-event.deltaY * .001), event.clientX, event.clientY);
}, { passive: false });
viewport.addEventListener('pointerdown', event => {
  state.down = { x: event.clientX, y: event.clientY, startX: state.x, startY: state.y, moved: false, target: event.target.closest('.study-hotspot') };
  viewport.setPointerCapture(event.pointerId);
});
viewport.addEventListener('pointermove', event => {
  if (!state.down) return;
  const dx = event.clientX - state.down.x;
  const dy = event.clientY - state.down.y;
  if (Math.hypot(dx, dy) > 5) state.down.moved = true;
  if (state.down.moved) {
    state.x = state.down.startX + dx;
    state.y = state.down.startY + dy;
    draw();
  }
});
viewport.addEventListener('pointerup', () => {
  if (state.down && !state.down.moved && state.down.target) select(state.down.target.dataset.id);
  state.down = null;
});
viewport.addEventListener('pointercancel', () => { state.down = null; });
viewport.addEventListener('dblclick', reset);

for (const hotspot of document.querySelectorAll('.study-hotspot')) {
  hotspot.addEventListener('pointerenter', event => {
    const item = items.find(candidate => candidate.id === hotspot.dataset.id);
    tooltip.textContent = `${item.number}  ${item.title}`;
    const stageRect = document.querySelector('.study-stage').getBoundingClientRect();
    tooltip.style.left = `${event.clientX - stageRect.left + 18}px`;
    tooltip.style.top = `${event.clientY - stageRect.top + 18}px`;
    tooltip.classList.add('is-visible');
  });
  hotspot.addEventListener('pointerleave', () => tooltip.classList.remove('is-visible'));
  hotspot.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(hotspot.dataset.id); }
  });
}
document.querySelectorAll('[data-select]').forEach(button => button.addEventListener('click', () => select(button.dataset.select)));
document.querySelectorAll('.study-view-switch [data-view]').forEach(button => button.addEventListener('click', () => {
  state.view = button.dataset.view;
  document.querySelector('.study-stage').dataset.view = state.view;
  document.querySelector('.study-stage-top span').textContent = state.view === 'hybrid' ? '局部透叠实验' : '原图构图对照';
  document.querySelectorAll('.study-view-switch [data-view]').forEach(choice => choice.classList.toggle('is-current', choice === button));
  reset();
}));
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.action === 'reset') return reset();
  const rect = viewport.getBoundingClientRect();
  zoom(state.scale * (button.dataset.action === 'zoom-in' ? 1.2 : 1 / 1.2), rect.left + rect.width / 2, rect.top + rect.height / 2);
}));
document.querySelector('.study-close').addEventListener('click', () => {
  card.hidden = true;
  document.querySelectorAll('.is-selected,.is-active').forEach(element => element.classList.remove('is-selected', 'is-active'));
});
document.querySelector('.study-brand').addEventListener('click', event => { event.preventDefault(); reset(); card.hidden = true; });
draw();
