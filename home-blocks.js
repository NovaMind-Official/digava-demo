/**
 * متن بزرگ صفحه‌ی اصلی و دیوار نظرها
 */
'use strict';

const mani = () => {
  if (!SITE.manifesto) return '';
  const ws = SITE.manifesto.split(/\s+/);
  return `<section class="mani" id="mani" aria-label="${esc(SITE.name)}"><p>${ws.map(w => (/^\[.*\]$/.test(w) ? `<span class="w ac">${w.slice(1, -1)}</span>` : `<span class="w">${w}</span>`)).join(' ')}</p><small>${esc(SITE.name)} · ${esc(SITE.city)}</small></section>`;
};
const maniUpd = () => {
  const m = $('#mani');
  if (!m) return;
  const r = m.getBoundingClientRect(),
    p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35))),
    W = m.querySelectorAll('.w'),
    n = W.length;
  W.forEach((e, k) => {
    const t = Math.min(1, Math.max(0, p * (n + 6) - k) / 3);
    e.style.setProperty('--o', (0.14 + 0.86 * t).toFixed(2));
  });
};
const wall = () => {
  const all = revs,
    n = all.length || 1,
    avg = all.reduce((a, r) => a + r.s, 0) / n,
    dist = [5, 4, 3, 2, 1].map(k => Math.round((all.filter(r => Math.round(r.s) === k).length / n) * 100));
  return (
    `<div class="rwall"><div class="rsum"><div class="big">${fa(avg.toFixed(1)).replace('٫', '.')}<span class="stars">★★★★★</span><small>از ${fa(n)} نظر</small></div><div class="bars">${dist.map((v, k) => `<div><span>${fa(5 - k)} ★</span><i style="--w:${v}"></i><small>${fa(v)}٪</small></div>`).join('')}</div></div>` +
    `<div class="rrow">${all
      .slice(0, 8)
      .map(
        r =>
          `<article class="rvc" style="--c:${menu[r.d][6]}"><div class="tp"><i></i><i></i><i></i></div><p>${esc(r.t)}</p><div><div class="by"><span class="av">${[...String(r.n).trim()][0] || ''}</span><div><b>${esc(r.n)}</b><span class="stars">${stars(r.s)}</span></div></div><a class="dsh" href="#p${r.d}"><span>${sImg(r.d)}</span>${menu[r.d][0]}</a></div></article>`
      )
      .join('')}</div></div>`
  );
};
