/**
 * تم روشن و تیره و پوسته‌های سایت
 */
'use strict';

const setTheme = t => {
  const r = document.documentElement;
  if (t) r.dataset.theme = t;
  else delete r.dataset.theme;
  ls.set('theme', t || '');
};
const SKINS = [
  ['atelier', 'آتلیه (پیش‌فرض)', '#D9A23F'],
  ['sofreh', 'سفره', '#0E8F8B'],
  ['noir', 'نوآر شب', '#D9B26B'],
  ['cafe', 'کافه‌ی گرم', '#B5532B'],
  ['street', 'استریت', '#FFD60A']
];
const setSkin = (k, keep) => {
  const r = document.documentElement;
  if (!k || k === 'sofreh') delete r.dataset.skin;
  else r.dataset.skin = k;
  if (keep) ls.set('skinPick', k || 'sofreh');
  const mc = document.querySelector('meta[name=theme-color]');
  if (mc) mc.content = getComputedStyle(r).getPropertyValue('--paper').trim() || mc.content;
  document
    .querySelectorAll('.skp button')
    .forEach(b => b.setAttribute('aria-pressed', b.dataset.skin === (k || 'sofreh')));
};
setSkin(ls.get('skinPick') || SITE.theme || 'sofreh');
const skinHtml = () =>
  SITE.themeSwitcher === false
    ? ''
    : `<p class="sh">تم سایت</p><div class="skp">${SKINS.map(s => `<button data-skin="${s[0]}" aria-pressed="${(ls.get('skinPick') || SITE.theme || 'sofreh') === s[0]}"><i style="background:${s[2]}"></i>${s[1]}</button>`).join('')}</div>`;
document.addEventListener('click', e => {
  const k = e.target.closest('[data-skin]');
  if (!k) return;
  setSkin(k.dataset.skin, true);
  renderSb();
});
{
  const th = ls.get('theme');
  if (th) document.documentElement.dataset.theme = th;
}
