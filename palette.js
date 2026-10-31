/**
 * پالت فرمان و جستجوی سراسری
 */
'use strict';

const cmd = $('#cmd');
let cs = 0,
  cl2 = [];
const pagesL = [
  ['home', 'خانه'],
  ['menu', 'غذاها و محصولات'],
  ['pick', 'چی بخورم؟'],
  ['events', 'مراسم و کیترینگ'],
  ['gallery', 'گالری'],
  ['track', 'پیگیری سفارش'],
  ['reserve', 'رزرو میز و آدرس'],
  ['cart', 'سبد خرید'],
  ['account', 'حساب کاربری'],
  ['about', 'درباره ما'],
  ['contact', 'تماس با ما']
];
const cmdDraw = () => {
  const q = $('#cq').value.trim();
  const p = pagesL.filter(x => !q || x[1].includes(q)).map(x => ({ t: x[1], s: 'صفحه', h: x[0] }));
  const m = menu
    .map((d, i) => ({
      t: d[0],
      s: cats[d[1]] + '، ' + money(d[2]),
      c: d[6],
      i,
      k: d[0] + d[3] + d[7] + cats[d[1]]
    }))
    .filter(x => (q ? x.k.includes(q) : menu[x.i][9] > 360));
  cl2 = [...m.slice(0, 7), ...p].slice(0, 10);
  cs = Math.min(cs, Math.max(cl2.length - 1, 0));
  $('#cr').innerHTML =
    cl2
      .map(
        (x, k) =>
          `<button class="cr" role="option" data-k="${k}" aria-selected="${k === cs}"><i style="--c:${x.c || 'var(--acc)'}"></i><span><b>${x.t}</b><small>${x.s}</small></span></button>`
      )
      .join('') || '<p class="muted pad">موردی پیدا نشد.</p>';
};
const openCmd = () => {
  cs = 0;
  $('#cq').value = '';
  cmdDraw();
  if (!cmd.open) cmd.showModal();
  $('#cq').focus();
};
const cmdGo = k => {
  const x = cl2[k];
  if (!x) return;
  cmd.close();
  if (x.h) location.hash = x.h;
  else navTo('p' + x.i);
};
$('#cq').oninput = () => {
  cs = 0;
  cmdDraw();
};
$('#cq').onkeydown = e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (cl2.length) cs = (cs + (e.key === 'ArrowDown' ? 1 : -1) + cl2.length) % cl2.length;
    cmdDraw();
    const s = $('.cr[aria-selected="true"]');
    if (s && s.scrollIntoView) s.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter') cmdGo(cs);
};
$('#cr').onclick = e => {
  const b = e.target.closest('.cr');
  if (b) cmdGo(+b.dataset.k);
};
$('#gs').onclick = openCmd;
cmd.addEventListener('click', e => {
  if (e.target === cmd) cmd.close();
});
