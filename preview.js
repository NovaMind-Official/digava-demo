/**
 * منوی دوبخشی: عکس بزرگ ثابت و فهرست غذاها؛ با اسکرول یا لمس هر غذا، عکس عوض می‌شود
 */
'use strict';

const mpv = { i: -1, hover: false, raf: 0 };
const mpvSrc = i => photos[i] || `dish-${String(i + 1).padStart(2, '0')}.jpg`;
const mpvHtml = () =>
  `<aside class="mpv" id="mpv" aria-live="polite"><div class="mpv-img"><img class="on" alt=""><img alt=""></div><div class="mpv-cap"><p class="k"></p><h3></h3><p class="d"></p><div class="r"><b class="p"></b><span data-ci="0"></span></div></div></aside>`;
const mpvSet = i => {
  const box = $('#mpv');
  if (!box || i === mpv.i || !menu[i]) return;
  mpv.i = i;
  const d = menu[i],
    imgs = box.querySelectorAll('.mpv-img img'),
    cur = box.querySelector('.mpv-img img.on'),
    next = [...imgs].find(x => x !== cur);
  next.onerror = () => {
    next.onerror = null;
    if (window.dishArtFor) next.src = window.dishArtFor(i);
  };
  next.onload = () => {
    if (mpv.i !== i) return;
    next.classList.add('on');
    cur.classList.remove('on');
  };
  next.src = mpvSrc(i);
  box.style.setProperty('--c', d[6]);
  const cap = box.querySelector('.mpv-cap');
  cap.classList.remove('in');
  void cap.offsetWidth;
  box.querySelector('.k').textContent = cats[d[1]];
  box.querySelector('h3').textContent = d[0];
  box.querySelector('.d').textContent = d[3];
  box.querySelector('.p').innerHTML = `${fa(d[2] * 1000)}<small>تومان</small>`;
  const c = box.querySelector('[data-ci]');
  c.dataset.ci = i;
  c.innerHTML = cctl(i);
  cap.classList.add('in');
  $$('.mstage .mrow').forEach(r => r.classList.toggle('on', +r.dataset.i === i));
};
// ردیفی که به خط تمرکز نزدیک‌تر است فعال می‌شود
const mpvScan = () => {
  mpv.raf = 0;
  const box = $('#mpv'),
    rows = $$('.mstage .mrow');
  if (!box || !rows.length) return;
  const pr = box.getBoundingClientRect(),
    narrow = innerWidth < 900,
    line = narrow ? pr.bottom + 70 : innerHeight * 0.42;
  let best = rows[0],
    bd = 1e9;
  rows.forEach(r => {
    const b = r.getBoundingClientRect(),
      dd = Math.abs(b.top + b.height / 2 - line);
    if (dd < bd) {
      bd = dd;
      best = r;
    }
  });
  mpvSet(+best.dataset.i);
};
const mpvInit = () => {
  mpv.i = -1;
  if (!$('#mpv')) return;
  const first = $('.mstage .mrow');
  if (first) mpvSet(+first.dataset.i);
  mpvScan();
};
addEventListener(
  'scroll',
  () => {
    if (!$('#mpv') || mpv.raf) return;
    mpv.hover = false;
    mpv.raf = requestAnimationFrame(mpvScan);
  },
  { passive: true }
);
document.addEventListener('pointerover', e => {
  if (e.pointerType !== 'mouse') return;
  const r = e.target.closest && e.target.closest('.mstage .mrow');
  if (r) mpvSet(+r.dataset.i);
});
