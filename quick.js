/**
 * برگه‌ی جزئیات سریع: با لمس هر غذا یا محصول از پایین باز می‌شود
 */
'use strict';

let qsOpen = null;
const qsBox = (() => {
  const s = document.createElement('div');
  s.className = 'qsb';
  s.id = 'qsb';
  const q = document.createElement('aside');
  q.className = 'qs';
  q.id = 'qs';
  q.setAttribute('role', 'dialog');
  q.setAttribute('aria-modal', 'true');
  q.setAttribute('aria-hidden', 'true');
  document.body.append(s, q);
  return q;
})();
const qsHtml = i => {
  const d = menu[i],
    on = me && me.fav.includes(i),
    g = grpOf(i),
    food = d[1] < NF,
    meta = [
      `★ ${fa(d[8])}`,
      d[12] ? `${fa(d[12])} دقیقه` : d[10],
      food && d[14] ? `${fa(d[14])} کالری` : ''
    ].filter(Boolean);
  return `<div class="qs-grip" aria-hidden="true"></div>
<button class="qs-x" data-act="qsx" aria-label="بستن">✕</button>
<div class="qs-img">${img(i)}</div>
<div class="qs-body">
<p class="qs-k">${cats[d[1]]}</p>
<h2>${d[0]}</h2>
<p class="qs-d">${d[3]}</p>
<p class="qs-m">${meta.map(m => `<span>${m}</span>`).join('')}</p>
${g ? `<div class="opts open"><div data-opt="${i}">${optsInner(i)}</div></div>` : ''}
<div class="qs-f">${g ? '' : `<b class="qs-p">${fa(d[2] * 1000)}<small>تومان</small></b><span class="qs-c" data-ci="${i}">${ctl(i)}</span>`}</div>
<div class="qs-a"><button class="qs-fav" data-act="fav" data-i="${i}" aria-pressed="${!!on}">${on ? '♥' : '♡'} علاقه‌مندی</button><button data-act="cmp" data-i="${i}">مقایسه</button><button data-act="qsfull" data-i="${i}">صفحه‌ی کامل</button></div>
</div>`;
};
const setQs = i => {
  qsOpen = i;
  if (i !== null) qsBox.innerHTML = qsHtml(i);
  qsBox.setAttribute('aria-hidden', i === null);
  document.body.classList.toggle('qso', i !== null);
};
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (a && a.dataset.act === 'quick') setQs(+a.dataset.i);
  else if (a && a.dataset.act === 'qsx') setQs(null);
  else if (a && a.dataset.act === 'qsfull') {
    const i = +a.dataset.i,
      src = qsBox.querySelector('.ph');
    setQs(null);
    navTo('p' + i, src);
  } else if (e.target.id === 'qsb') setQs(null);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && qsOpen !== null) setQs(null);
});
document.addEventListener('click', e => {
  const a = e.target.closest('.qs-fav');
  if (!a || !me) return;
  const on = me.fav.includes(+a.dataset.i);
  a.setAttribute('aria-pressed', on);
  a.textContent = (on ? '♥' : '♡') + ' علاقه‌مندی';
});
addEventListener('hashchange', () => qsOpen !== null && setQs(null));
// کشیدن برگه به پایین برای بستن
{
  let y0 = null;
  qsBox.addEventListener(
    'touchstart',
    e => {
      if (qsBox.scrollTop <= 0) y0 = e.touches[0].clientY;
    },
    { passive: true }
  );
  qsBox.addEventListener(
    'touchmove',
    e => {
      if (y0 === null) return;
      const dy = e.touches[0].clientY - y0;
      if (dy > 0) qsBox.style.transform = `translateY(${dy}px)`;
    },
    { passive: true }
  );
  qsBox.addEventListener('touchend', e => {
    if (y0 === null) return;
    const dy = e.changedTouches[0].clientY - y0;
    y0 = null;
    qsBox.style.transform = '';
    if (dy > 90) setQs(null);
  });
}
