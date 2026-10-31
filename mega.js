/**
 * منوی بزرگ و ناوبری
 */
'use strict';

const navTo = (hh, el) => {
  if (location.hash === '#' + hh) return;
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion:reduce)').matches) {
    location.hash = hh;
    return;
  }
  if (el) el.style.viewTransitionName = 'pimg';
  document.startViewTransition(() => {
    skip = true;
    location.hash = hh;
    render();
  });
};
const mega = $('#mega');
const renderMega = g => {
  const r = g ? [NF, cats.length] : [0, NF],
    top = menu
      .map((_, i) => i)
      .filter(i => menu[i][1] >= r[0] && menu[i][1] < r[1])
      .sort(sorts.pop)
      .slice(0, 3);
  mega.innerHTML =
    `<div class="mg"><div class="mgc"><h4>${g ? 'فروشگاه' : 'غذاها'}</h4>${cats
      .slice(r[0], r[1])
      .map(
        (c, j) =>
          `<button data-act="catgo" data-v="${r[0] + j}"><i style="--c:${CC[r[0] + j]}"></i>${c}<small>${fa(menu.filter(d => d[1] === r[0] + j).length)}</small></button>`
      )
      .join('')}</div>` +
    `<div class="mgt"><h4>پرطرفدار این بخش</h4>${top.map(i => card(i).replace(' rev"', '"')).join('')}</div><div class="mgp" style="--c:${g ? '#C2410C' : '#2F6B3B'}"><b>${g ? 'پک هدیه دیگ‌آوا' : 'منوی امشب'}</b><span>${g ? 'زعفران، نبات، گلاب و باقلوا در یک جعبه' : 'از کباب ذغالی تا دم‌پخت ساعت‌ها'}</span><button class="btn sm" data-act="catgo" data-v="${g ? 13 : 1}">مشاهده</button></div></div>`;
};
const openMega = g => {
  if (mg === g) return;
  mg = g;
  renderMega(g);
  mega.hidden = false;
  $$('.mt').forEach(b => b.setAttribute('aria-expanded', +b.dataset.g === g));
};
const closeMega = () => {
  mg = -1;
  mega.hidden = true;
  $$('.mt').forEach(b => b.setAttribute('aria-expanded', false));
};
document.addEventListener('pointerover', e => {
  if (e.pointerType !== 'mouse') return;
  const t = e.target.closest && e.target.closest('.mt');
  if (t) openMega(+t.dataset.g);
  else if (mg >= 0 && !(e.target.closest && e.target.closest('#mega'))) closeMega();
});
document.addEventListener('click', e => {
  if (mg >= 0 && !e.target.closest('.mt,#mega')) closeMega();
});
