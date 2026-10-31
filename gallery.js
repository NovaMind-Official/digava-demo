/**
 * گالری و نمایش بزرگ عکس
 */
'use strict';

const GAL = (() => {
  const top = menu
    .map((d, i) => [d[8] * Math.log(2 + d[9]), i])
    .filter(x => menu[x[1]][1] < NF)
    .sort((a, b) => b[0] - a[0])
    .slice(0, 10)
    .map(x => x[1]);
  const sp = SITE.gallery || [
    ['فضای سالن اصلی', 'space'],
    ['تراس', 'space'],
    ['آشپزخانه‌ی باز', 'space'],
    ['مراسم و جشن', 'event'],
    ['شب‌های رستوران', 'space'],
    ['میز خانوادگی', 'event']
  ];
  const o = [];
  top.forEach((i, k) => {
    o.push({ t: 'food', i, c: menu[i][0], cl: menu[i][6] });
    if (k % 2 === 1 && sp[(k - 1) / 2])
      o.push({
        t: sp[(k - 1) / 2][1],
        n: (k - 1) / 2 + 1,
        c: sp[(k - 1) / 2][0],
        cl: ['#2E8F8B', '#C98303', '#6C4A9E', '#A23A4A', '#2F7A55', '#33527A'][((k - 1) / 2) % 6]
      });
  });
  return o;
})();
const gTile = (g, k) => {
  const sz = k % 7 === 0 ? 'w2 t2' : k % 5 === 3 ? 't2' : k % 6 === 4 ? 'w2' : '';
  const inner =
    g.t === 'food'
      ? sImg(g.i)
      : `<img alt="" src="assets/img/gallery/${g.t}-${g.n}.jpg" onerror="this.onerror=null;this.outerHTML='<span class=\\'ph3\\' style=\\'--c:${g.cl}\\'>${g.c}</span>'">`;
  return `<button type="button" class="gt ${sz}" data-act="gal" data-k="${k}" data-t="${g.t}" data-cap="${g.c}" aria-label="${g.c}">${inner}</button>`;
};
const galView = f => {
  const L = GAL.map((g, k) => [g, k]).filter(([g]) => !f || g.t === f);
  return `<div class="gal">${L.map(([g, k]) => gTile(g, k)).join('')}</div>`;
};
let lbK = 0;
const lbShow = k => {
  lbK = (k + GAL.length) % GAL.length;
  const g = GAL[lbK],
    d = $('#lb');
  d.querySelector('.st').innerHTML =
    (g.t === 'food'
      ? sImg(g.i)
      : `<img alt="" src="assets/img/gallery/${g.t}-${g.n}.jpg" onerror="this.onerror=null;this.outerHTML='<span class=\\'ph3\\' style=\\'--c:${g.cl}\\'>${g.c}</span>'">`) +
    `<div class="cap">${g.c}</div>`;
};
(() => {
  const d = document.createElement('dialog');
  d.id = 'lb';
  d.setAttribute('aria-label', 'نمایش عکس');
  d.innerHTML =
    '<button class="x" data-act="lbx" aria-label="بستن">×</button><button class="pv2" data-act="lbp" aria-label="قبلی">›</button><button class="nx" data-act="lbn" aria-label="بعدی">‹</button><div class="st"></div>';
  document.body.appendChild(d);
  let x0 = null;
  d.addEventListener('pointerdown', e => {
    x0 = e.clientX;
  });
  d.addEventListener('pointerup', e => {
    if (x0 !== null && Math.abs(e.clientX - x0) > 60) lbShow(lbK + (e.clientX < x0 ? 1 : -1));
    x0 = null;
  });
  d.addEventListener('click', e => {
    if (e.target === d || e.target.classList.contains('st')) d.close();
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') lbShow(lbK + 1);
    if (e.key === 'ArrowRight') lbShow(lbK - 1);
  });
})();
