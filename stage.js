/**
 * صحنه‌ی سینمایی صفحه‌ی اصلی
 */
'use strict';

const stgPick = () => {
  const by = {};
  menu.forEach((d, i) => {
    if (d[1] < NF) {
      const v = d[8] * Math.log(2 + d[9]);
      if (!by[d[1]] || v > by[d[1]][0]) by[d[1]] = [v, i];
    }
  });
  return Object.values(by)
    .sort((a, b) => b[0] - a[0])
    .slice(0, 5)
    .map(x => x[1]);
};
let STG = [],
  stgF = -1;
const sImg = i =>
  `<img alt="" src="${photos[i] || `dish-${String(i + 1).padStart(2, '0')}.jpg`}" onerror="this.onerror=null;window.dishArtFor?this.src=window.dishArtFor(${i}):this.remove()">`;
const stage = M2 => {
  STG = stgPick();
  const n = STG.length + 1;
  stgF = -1;
  return (
    `<section class="stg" id="stg" style="--n:${n}" aria-label="پیشنهادهای ویژه"><div class="stg-in">` +
    ['', ...STG]
      .map((x, k) => `<div class="bgl" data-k="${k}" style="--t:${k ? menu[x][6] : menu[STG[0]][6]}"></div>`)
      .join('') +
    `<div class="gn" aria-hidden="true">${STG.map((x, k) => `<span data-k="${k + 1}">${menu[x][0]}</span>`).join('')}</div>` +
    STG.map(
      (x, k) => `<div class="pl" data-k="${k + 1}" aria-hidden="true">${sImg(x)}<i class="sh"></i></div>`
    ).join('') +
    `<div class="ct2"><b id="stn">${fa(1)}</b><span>/ ${fa(n)}</span></div>` +
    `<div class="tx on" data-k="0"><p class="k">الان وقت ${M2[0]} است</p><h1>${SITE.hero.map((w, k) => (k === SITE.heroAccent ? `<span class="acc">${w}</span>` : w)).join(' ')}</h1><p>${M2[1]}</p><div class="row"><a class="btn" href="#menu">غذاها و محصولات</a><a class="btn ghost" href="#pick">چی بخورم؟</a></div></div>` +
    STG.map((x, k) => {
      const d = menu[x];
      return `<div class="tx" data-k="${k + 1}"><p class="k">${cats[d[1]]} · ${d[10]}</p><h2>${d[0]}</h2><p>${d[3]}</p><div class="row"><span class="pp2">${fa(d[2] * 1000)}<small>تومان</small></span><span data-ci="${x}">${ctl(x)}</span><a class="btn ghost sm" href="#p${x}">جزئیات</a></div></div>`;
    }).join('') +
    `<div class="rl">${['', ...STG].map((x, k) => `<button data-k="${k}" aria-label="مرحله ${fa(k + 1)}"></button>`).join('')}</div><i class="sc" aria-hidden="true"></i></div></section>`
  );
};
document.addEventListener('click', e => {
  const b = e.target.closest('.stg .rl button');
  if (!b) return;
  const s = $('#stg'),
    n = STG.length + 1;
  scrollTo({
    top: s.offsetTop + (s.offsetHeight - VH()) * (+b.dataset.k / (n - 1)),
    behavior: 'smooth'
  });
});
const stgUpd = () => {
  const s = $('#stg');
  if (!s) return;
  const r = s.getBoundingClientRect(),
    n = STG.length + 1;
  const p = Math.min(1, Math.max(0, -r.top / Math.max(1, s.offsetHeight - VH()))),
    f = p * (n - 1),
    a = Math.round(f);
  const fd = Math.max(0, f - 1),
    w = Math.min(innerWidth, 900) < 900 ? innerWidth : innerWidth * 0.6;
  s.querySelectorAll('.pl').forEach(e => {
    const k = +e.dataset.k,
      o = k - 1 - fd,
      ab = Math.abs(o),
      fr = f < 1 ? 0 : 1;
    e.style.opacity = f < 0.2 && k === 1 ? 1 : Math.max(0, 1 - ab * 1.1);
    e.style.transform = `translate(${o * -w * 0.8}px,${ab * 20}px) scale(${1 - Math.min(ab, 1) * 0.28}) rotate(${((f * 55 + k * 30) % 360) * (k % 2 ? 1 : -1)}deg)`;
  });
  s.querySelectorAll('.gn span').forEach(e => {
    const k = +e.dataset.k,
      o = k - 1 - fd;
    e.style.transform = `translateX(${o * -innerWidth * 0.55}px)`;
    e.classList.toggle('on', Math.abs(o) < 0.7 && f > 0.35);
  });
  s.querySelectorAll('.tx').forEach(e => e.classList.toggle('on', +e.dataset.k === a));
  s.querySelectorAll('.bgl').forEach(e =>
    e.classList.toggle('on', +e.dataset.k === Math.max(a, 1) || (a === 0 && +e.dataset.k === 1))
  );
  s.querySelectorAll('.rl button').forEach(e => e.classList.toggle('on', +e.dataset.k === a));
  const c = s.querySelector('.sc');
  if (c) c.style.opacity = p > 0.04 ? 0 : 1;
  if (a !== stgF) {
    stgF = a;
    const t = $('#stn');
    if (t) t.textContent = fa(a + 1);
  }
};
