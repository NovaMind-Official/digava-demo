/**
 * نقشه‌ی سه‌بعدی سالن و انتخاب میز
 */
'use strict';

const FPW = 520,
  FPH = 380;
const FPZ = [
  ['سالن اصلی', 0, 0, 300, 200, 'zh', '#2E8F8B'],
  ['تراس', 300, 0, 220, 200, 'zt', '#6BB05F'],
  ['فضای خانوادگی', 0, 200, 300, 180, 'zf', '#E0A436'],
  ['اتاق VIP', 300, 200, 220, 180, 'zv', '#9A6CE0']
];
// [شماره، منطقه، x، y، عرض، طول، ظرفیت، گرد؟]
const FPT = [
  [1, 0, 60, 55, 44, 44, 2, 1],
  [2, 0, 60, 145, 44, 44, 2, 1],
  [3, 0, 150, 55, 62, 62, 4, 1],
  [4, 0, 150, 148, 62, 62, 4, 1],
  [5, 0, 245, 100, 46, 76, 4, 0],
  [6, 1, 370, 55, 62, 62, 4, 1],
  [7, 1, 470, 55, 62, 62, 4, 1],
  [8, 1, 420, 150, 104, 46, 6, 0],
  [9, 2, 80, 250, 104, 46, 6, 0],
  [10, 2, 200, 250, 104, 46, 6, 0],
  [11, 2, 62, 328, 56, 56, 4, 1],
  [12, 2, 140, 328, 56, 56, 4, 1],
  [13, 3, 420, 258, 176, 50, 10, 0],
  [14, 3, 420, 326, 56, 56, 4, 1]
];
const fpBusy = id => rsv.t && (rsv.day * 7 + rsv.t * 3 + id * 5 + id * id) % 10 < 3;
const fpTb = t => FPT.find(x => x[0] === +t);
const fpChairs = ([id, z, x, y, w, h, n, rd]) => {
  const c = FPZ[z][6],
    o = [];
  const add = (cx, cy, a) =>
    o.push(
      `<span class="ch" style="--cx:${cx.toFixed(1)}px;--cy:${cy.toFixed(1)}px;--ca:${a.toFixed(0)}deg;--cc:${c}"><b class="a"></b><b class="b"></b><s class="a"></s><s class="b"></s><s class="c"></s></span>`
    );
  if (rd) {
    const R = w / 2 + 12;
    for (let k = 0; k < n; k++) {
      const a = (k * 360) / n + 45;
      add(R * Math.cos((a * Math.PI) / 180), R * Math.sin((a * Math.PI) / 180), a);
    }
  } else if (w >= h) {
    const a = Math.ceil(n / 2),
      b = n - a;
    for (let k = 0; k < a; k++) add(-w / 2 + ((k + 0.5) * w) / a, -h / 2 - 12, -90);
    for (let k = 0; k < b; k++) add(-w / 2 + ((k + 0.5) * w) / b, h / 2 + 12, 90);
  } else {
    const a = Math.ceil(n / 2),
      b = n - a;
    for (let k = 0; k < a; k++) add(w / 2 + 12, -h / 2 + ((k + 0.5) * h) / a, 0);
    for (let k = 0; k < b; k++) add(-w / 2 - 12, -h / 2 + ((k + 0.5) * h) / b, 180);
  }
  return o.join('');
};
const fpHtml = () => {
  const wall = (cls, x, y, len, ax) =>
    `<i class="pw ${ax}" style="left:${x}px;top:${y}px;${ax === 'h' ? `width:${len}px` : `height:${len}px`}"></i>`;
  const plant = (x, y) =>
    `<span class="pl3" style="--x:${x}px;--y:${y}px"><i class="p0"></i><i class="p1" style="--r:12px"></i><i class="p2" style="--r:12px"></i><i class="p3" style="--r:12px"></i><i class="p4" style="--r:12px"></i></span>`;
  return (
    `<div class="fpc"><div class="hd"><h3>میز خود را روی نقشه انتخاب کنید</h3><div class="seg2" role="group" aria-label="زاویه‌ی دید"><button type="button" data-act="fpv" data-v="3d" aria-pressed="true">سه‌بعدی</button><button type="button" data-act="fpv" data-v="top" aria-pressed="false">از بالا</button></div></div>` +
    `<div class="fps" id="fps"><div class="fpw" id="fpw"><i class="gnd"></i>${FPZ.map(z => `<i class="zn ${z[5]}" style="--x:${z[1]}px;--y:${z[2]}px;--w:${z[3]}px;--h:${z[4]}px"><em>${z[0]}</em></i>`).join('')}<i class="sl f"></i><i class="sl b"></i><i class="sl l"></i><i class="sl r"></i><i class="wl b"></i><i class="wl l"></i><i class="wl f"></i><i class="wl r"></i>` +
    wall('', 300, 0, 200, 'v').replace('class="pw v"', 'class="pw v" style="display:none"') +
    wall('', 300, 200, 90, 'v') +
    wall('', 300, 330, 50, 'v') +
    wall('', 300, 200, 220, 'h') +
    `<i class="mat" style="left:120px;top:362px;width:60px;height:18px"></i>` +
    [
      [18, 18],
      [18, 182],
      [506, 18],
      [506, 182],
      [312, 186],
      [276, 218],
      [316, 366],
      [506, 366]
    ]
      .map(a => plant(a[0], a[1]))
      .join('') +
    `<span class="fo" style="--x:248px;--y:332px"><i class="a"></i><i class="b"></i><i class="c"></i><i class="d"></i><i class="e"></i></span>` +
    FPT.map(t => {
      const [id, z, x, y, w, h, n, rd] = t;
      return `<div class="tb" data-act="fp" data-id="${id}" role="button" tabindex="0" aria-label="میز ${fa(id)}، ${fa(n)} نفره، ${FPZ[z][0]}" style="--x:${x}px;--y:${y}px;--w:${w}px;--h:${h}px;--rd:${rd ? '50%' : '10px'}"><i class="shd"></i><i class="lg a"></i><i class="lg b"></i><i class="lg c"></i><i class="e a"></i><i class="e b"></i><i class="e c"></i><i class="top"></i><i class="cd"></i><i class="ring"></i>${fpChairs(t)}<span class="tg">${fa(n)}</span></div>`;
    }).join('') +
    '' +
    `</div><p class="hint">برای چرخاندن سالن، انگشت را روی نقشه بکشید</p></div>` +
    `<div class="fpf"><div class="lgd"><span><i style="background:#f4dcae"></i>آزاد</span><span><i style="background:var(--acc)"></i>انتخاب شما</span><span><i style="background:#555"></i>رزرو شده</span><span><i style="background:#f4dcae;opacity:.4"></i>ظرفیت کم</span></div><span class="muted" id="fpnote" style="color:#cfe0dc;font-size:.78rem"></span></div></div>`
  );
};
const fpSel = () => {
  const t = rsv.table && fpTb(rsv.table);
  return t
    ? `<div class="fpsel on"><span><b>میز ${fa(t[0])}</b> · ${fa(t[6])} نفره · ${FPZ[t[1]][0]}</span><button type="button" data-act="fpclr" aria-label="حذف انتخاب">×</button></div>`
    : '<div class="fpsel"><span class="muted">هنوز میزی انتخاب نشده؛ روی نقشه‌ی بالا یک میز را لمس کنید.</span></div>';
};
const fpUpdate = () => {
  const w = $('#fpw');
  if (!w) return;
  if (rsv.table) {
    const t = fpTb(rsv.table);
    if (fpBusy(t[0]) || t[6] < rsv.n) rsv.table = 0;
  }
  w.querySelectorAll('.tb').forEach(e => {
    const t = fpTb(e.dataset.id),
      off = fpBusy(t[0]),
      sm = t[6] < rsv.n;
    e.classList.toggle('off', !!off);
    e.classList.toggle('sm', !off && sm);
    e.classList.toggle('sel', rsv.table === t[0]);
    e.querySelector('.tg').textContent = off ? '×' : fa(t[6]);
  });
  const f = $('#fpsel');
  if (f) f.innerHTML = fpSel();
  rsv.area = rsv.table ? FPZ[fpTb(rsv.table)[1]][0] : rsv.area;
  const n = $('#fpnote');
  if (n)
    n.textContent = rsv.t
      ? `میزهای رزرو شده برای ${dayL(rsv.day)} ساعت ${fa(rsv.t)}:۰۰`
      : 'اول روز و ساعت را انتخاب کنید';
};
const fpS = top => {
  const st = $('#fps');
  return top
    ? Math.min(st.clientWidth / 560, st.clientHeight / 420)
    : Math.min(st.clientWidth / 650, st.clientHeight / 520);
};
const fpFit = () => {
  const st = $('#fps'),
    w = $('#fpw');
  if (!st || !w) return;
  w.style.setProperty(
    '--s',
    fpS(st.querySelector('.fpw').style.getPropertyValue('--rx') === '0deg').toFixed(3)
  );
  fpUpdate();
};
addEventListener('resize', () => fpFit());
(() => {
  let d = null;
  document.addEventListener('pointerdown', e => {
    const st = e.target.closest && e.target.closest('#fps');
    if (!st || (e.pointerType === 'mouse' && e.button)) return;
    const w = $('#fpw');
    d = { x: e.clientX, rz: parseFloat(getComputedStyle(w).getPropertyValue('--rz')) || -32, m: 0, st };
  });
  document.addEventListener('pointermove', e => {
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 6) {
      d.m = 1;
      d.st.classList.add('drag');
    }
    if (d.m) $('#fpw').style.setProperty('--rz', d.rz + dx * 0.45 + 'deg');
  });
  const end = () => {
    if (d && d.m) {
      fpDragged = Date.now();
      d.st.classList.remove('drag');
    }
    d = null;
  };
  document.addEventListener('pointerup', end);
  document.addEventListener('pointercancel', end);
})();
let fpDragged = 0;
