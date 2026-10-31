/**
 * سبد خرید: کشوی سبد، پرواز به سبد، افزودن و کم کردن
 */
'use strict';

let drOpen = false;
const drThumb = k => {
  const p = parseK(k);
  return p.c !== undefined ? '<span class="im"></span>' : `<span class="im">${sImg(p.i)}</span>`;
};
const renderDr = () => {
  const d = $('#dr');
  if (!d) return;
  const ks = Object.keys(cart),
    R = SITE.reward,
    from = R ? R.from : 0,
    left = from - sub(),
    ok = R && left <= 0;
  d.innerHTML =
    `<header><h2>سبد خرید</h2><button data-act="drc" aria-label="بستن">×</button></header>` +
    (R && ks.length
      ? `<div class="rw${ok ? ' ok' : ''}">${ok ? `<b>${R.text} فعال شد</b>` : `${money(Math.ceil(left))} دیگر تا <b>${R.text}</b>`}<div class="bar"><i style="--w:${Math.min(100, Math.round((sub() / from) * 100))}"></i></div></div>`
      : '') +
    `<div class="ls">${ks.length ? ks.map((k, n) => `<div class="dl" style="animation-delay:${n * 40}ms">${drThumb(k)}<div><b>${label(k)}</b><small>${money(unit(k))}</small>${stepK(k)}</div><button class="x" data-act="rmk" data-k="${k}" aria-label="حذف">×</button></div>`).join('') : '<p class="em">سبد شما خالی است.<br>یک غذای خوب انتخاب کنید.</p>'}</div>` +
    (ks.length
      ? `<footer><div class="t"><span>مبلغ نهایی</span><b>${money(payable())}</b></div><a class="btn" href="#cart" data-act="drgo">تسویه و ثبت سفارش</a><button class="btn ghost" data-act="drc">ادامه‌ی انتخاب غذا</button></footer>`
      : `<footer><a class="btn" href="#menu" data-act="drgo">دیدن منو</a></footer>`);
};
const setDr = o => {
  drOpen = o;
  const b = document.body;
  if (o && !RM()) {
    const d = $('#dr'),
      S = srcRect($('.top .icon[href="#cart"]') || $('#mini'));
    b.classList.add('gen');
    renderDr();
    b.classList.add('dro');
    const q = d.getBoundingClientRect(),
      r = { l: S.r.l - q.left, t: S.r.t - q.top, w: S.r.w, h: S.r.h, rad: 99 };
    const rr = { ...r, rad: Math.min(S.rad, 99) };
    if (d.animate) {
      d.animate(
        {
          clipPath: [insetOf(rr, q.width, q.height), 'inset(0px 0px 0px 0px round 28px)'],
          transform: ['scale(.9)', 'scale(1)'],
          transformOrigin: [`${S.x - q.left}px ${S.y - q.top}px`, `${S.x - q.left}px ${S.y - q.top}px`]
        },
        { duration: 620, easing: EASE }
      ).onfinish = () => b.classList.remove('gen');
      d.querySelectorAll('.dl,.rw,footer').forEach((e, n) =>
        e.animate(
          { opacity: [0, 1], transform: ['translateY(14px)', 'none'] },
          { duration: 420, delay: 160 + n * 45, easing: EASE, fill: 'backwards' }
        )
      );
    } else b.classList.remove('gen');
    return;
  }
  b.classList.remove('gen');
  b.classList.toggle('dro', o);
  if (o) renderDr();
};
(() => {
  const b = document.createElement('div');
  b.className = 'drb';
  b.setAttribute('data-act', 'drc');
  const d = document.createElement('aside');
  d.id = 'dr';
  d.className = 'dr';
  d.setAttribute('aria-label', 'سبد خرید');
  document.body.append(b, d);
})();
document.addEventListener(
  'click',
  e => {
    const a = e.target.closest('a[href="#cart"]');
    if (a && !a.closest('#dr') && view !== 'cart' && count()) {
      e.preventDefault();
      e.stopImmediatePropagation();
      setDr(true);
    }
  },
  true
);
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act=drc],[data-act=drgo]');
  if (a) setDr(false);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drOpen) setDr(false);
});
const fly = (i, from) => {
  try {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const tgt = $('.top .icon[href="#cart"]') || $('#mini');
    const img =
      from &&
      from.closest('.card,.tx,.pv,.ri,.stg-in,.pg') &&
      from.closest('.card,.tx,.pv,.ri,.stg-in,.pg').querySelector('img');
    if (!tgt || !img) return;
    const a = from.getBoundingClientRect(),
      t = tgt.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'fly';
    f.innerHTML = `<img src="${img.currentSrc || img.src}" alt="">`;
    f.style.left = a.left + a.width / 2 - 27 + 'px';
    f.style.top = a.top + a.height / 2 - 27 + 'px';
    document.body.appendChild(f);
    const dx = t.left + t.width / 2 - (a.left + a.width / 2),
      dy = t.top + t.height / 2 - (a.top + a.height / 2);
    f.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx * 0.5}px,${dy * 0.5 - 80}px) scale(.8)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${dx}px,${dy}px) scale(.2)`, opacity: 0.4 }
      ],
      { duration: 750, easing: 'cubic-bezier(.4,.1,.3,1)' }
    ).onfinish = () => {
      f.remove();
      tgt.classList.remove('bump');
      void tgt.offsetWidth;
      tgt.classList.add('bump');
    };
  } catch (_) {}
};
const head = () => {
  $('#count').textContent = fa(count());
  if (me) $('#accBtn').dataset.in = '1';
  else delete $('#accBtn').dataset.in;
  $('#av').textContent = me ? [...me.name.trim()][0] : '';
  const m = $('#mini');
  m.hidden = !count() || view === 'cart' || view === 'product';
  m.innerHTML = `<span>${fa(count())} مورد در سبد</span><b>${money(payable())}</b><span>مشاهده سبد</span>`;
  renderPop();
  renderSb();
  renderBn();
  if (drOpen) renderDr();
};
const addK = (k, d) => {
  cart[k] = (cart[k] || 0) + d;
  if (cart[k] <= 0) delete cart[k];
  save();
  head();
  refresh();
};
const add = (i, d) => addK(String(i), d);
