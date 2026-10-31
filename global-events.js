/**
 * رویدادهای سراسری صفحه
 */
'use strict';

document.addEventListener('pointermove', e => {
  const c = e.target.closest && e.target.closest('[data-tilt]');
  if (!c || e.pointerType !== 'mouse') return;
  const r = c.getBoundingClientRect(),
    x = (e.clientX - r.left) / r.width,
    y = (e.clientY - r.top) / r.height;
  c.style.setProperty('--rx', (0.5 - y) * 8 + 'deg');
  c.style.setProperty('--ry', (x - 0.5) * 8 + 'deg');
  c.style.setProperty('--mx', x * 100 + '%');
  c.style.setProperty('--my', y * 100 + '%');
});
document.addEventListener('pointerout', e => {
  const c = e.target.closest && e.target.closest('[data-tilt]');
  if (c && !c.contains(e.relatedTarget)) {
    c.style.setProperty('--rx', '0deg');
    c.style.setProperty('--ry', '0deg');
  }
});
addEventListener(
  'scroll',
  () => {
    const t = $('.top'),
      h = document.documentElement.scrollHeight - innerHeight;
    t.classList.toggle('sc', scrollY > 20);
    t.style.setProperty('--p', h > 0 ? scrollY / h : 0);
    corUpd();
    stgUpd();
    maniUpd();
  },
  { passive: true }
);
document.addEventListener('pointermove', e => {
  const b = e.target.closest && e.target.closest('.btn');
  if (!b || e.pointerType !== 'mouse') return;
  const r = b.getBoundingClientRect();
  b.style.setProperty('--tx', (e.clientX - r.left - r.width / 2) * 0.15 + 'px');
  b.style.setProperty('--ty', (e.clientY - r.top - r.height / 2) * 0.25 + 'px');
});
document.addEventListener('pointerout', e => {
  const b = e.target.closest && e.target.closest('.btn');
  if (b) {
    b.style.setProperty('--tx', '0px');
    b.style.setProperty('--ty', '0px');
  }
});
addEventListener('resize', corSet);
document.addEventListener('pointermove', e => {
  const c = e.target.closest && e.target.closest('[data-foil]');
  if (!c || e.pointerType !== 'mouse') return;
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
  c.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
});
document.addEventListener('change', e => {
  const ph = e.target.dataset && e.target.dataset.ph;
  if (ph && e.target.files) {
    addPhotos(e.target.files, ph);
    e.target.value = '';
    return;
  }
  const k = e.target.dataset && e.target.dataset.pref;
  if (k && me) {
    me.prefs[k] = e.target.checked;
    save();
    toast('ذخیره شد.');
  }
});
document.addEventListener('dragover', e => {
  const d = e.target.closest && e.target.closest('#drop');
  if (d) {
    e.preventDefault();
    d.classList.add('on');
  }
});
document.addEventListener('dragleave', e => {
  const d = e.target.closest && e.target.closest('#drop');
  if (d) d.classList.remove('on');
});
document.addEventListener('drop', e => {
  const d = e.target.closest && e.target.closest('#drop');
  if (d) {
    e.preventDefault();
    d.classList.remove('on');
    addPhotos(e.dataTransfer.files, 'bulk');
  }
});
