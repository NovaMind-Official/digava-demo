/**
 * فیلتر، مرتب‌سازی و نمایش منو
 */
'use strict';

const hasDiet = (d, k) => (k === 'gf' ? !!d[13] : d[4].includes(k));
const bucket = d => (d[12] ? (d[12] <= 15 ? 1 : d[12] <= 30 ? 2 : 3) : 0);
const match = d =>
  (f.cat < 0 || d[1] === f.cat) &&
  (!f.reg.length || f.reg.includes(d[10])) &&
  (!f.meth.length || f.meth.includes(d[11])) &&
  f.diet.every(k => hasDiet(d, k)) &&
  (!f.time || bucket(d) === f.time) &&
  d[2] <= f.pmax &&
  (!f.q || (d[0] + d[3] + d[7]).includes(f.q));
const sorts = {
  pop: (a, b) => menu[b][9] - menu[a][9],
  rate: (a, b) => menu[b][8] - menu[a][8],
  pa: (a, b) => menu[a][2] - menu[b][2],
  pd: (a, b) => menu[b][2] - menu[a][2],
  time: (a, b) => menu[a][12] - menu[b][12]
};
const sortNames = {
  pop: 'پرفروش‌ترین',
  rate: 'بیشترین امتیاز',
  pa: 'ارزان‌ترین',
  pd: 'گران‌ترین',
  time: 'سریع‌ترین'
};
const opt = (a, v, t, n) =>
  !n
    ? ''
    : `<button class="opt" data-act="${a}" data-v="${v}" aria-pressed="false"><span>${t}</span><small>${fa(n)}</small></button>`;
const grp = (t, b) => `<details open><summary>${t}</summary>${b}</details>`;
const side = () =>
  grp(
    'غذاها',
    opt('cat', -1, 'همه', menu.length) +
      cats
        .slice(0, NF)
        .map((c, k) => opt('cat', k, c, menu.filter(d => d[1] === k).length))
        .join('')
  ) +
  grp(
    'محصولات',
    cats
      .slice(NF)
      .map((c, k) => opt('cat', k + NF, c, menu.filter(d => d[1] === k + NF).length))
      .join('')
  ) +
  grp('منطقه آشپزی', regs.map(r => opt('reg', r, r, menu.filter(d => d[10] === r).length)).join('')) +
  grp(
    'رژیم و حساسیت',
    [
      ['v', 'گیاهی'],
      ['gf', 'بدون گلوتن'],
      ['s', 'تند'],
      ['l', 'سبک']
    ]
      .map(([k, t]) => opt('diet', k, t, menu.filter(d => hasDiet(d, k)).length))
      .join('')
  ) +
  grp('روش پخت', meths.map(m => opt('meth', m, m, menu.filter(d => d[11] === m).length)).join('')) +
  grp(
    'زمان آماده‌سازی',
    [
      [1, 'تا ۱۵ دقیقه'],
      [2, '۱۵ تا ۳۰ دقیقه'],
      [3, 'بیش از ۳۰ دقیقه']
    ]
      .map(([k, t]) => opt('time', k, t, menu.filter(d => bucket(d) === k).length))
      .join('')
  ) +
  `<label class="rng">حداکثر قیمت: <b id="pv">${money(f.pmax)}</b><input type="range" id="pmax" min="50" max="1000" step="10" value="${f.pmax}"></label>`;
const syncSide = () =>
  $$('.opt').forEach(b => {
    const a = b.dataset.act,
      v = b.dataset.v;
    b.setAttribute(
      'aria-pressed',
      a === 'cat' ? f.cat === +v : a === 'time' ? f.time === +v : f[a].includes(v)
    );
  });
const row = i => {
  const d = menu[i];
  return `<div class="tr"><button class="nm" data-act="open" data-i="${i}">${img(i)}<span><b>${d[0]}</b><small>${cats[d[1]]}</small></span></button><span class="c lg">${d[10]}</span><span class="c lg">${d[11]}</span><span class="c">${d[12] ? fa(d[12]) + ' دقیقه' : 'آماده تحویل'}</span><span class="c lg">${d[12] ? fa(d[14]) + ' کالری' : ''}</span><span class="c rate">${fa(d[8])}<i style="--w:${Math.round(((d[8] - 3.5) / 1.5) * 100)}%"></i></span><b class="c">${money(d[2])}</b><span class="c" data-ci="${i}">${ctl(i)}</span></div>`;
};
// ردیف منو برای غذاها: شماره، نام، نقطه‌چین و قیمت، شبیه منوی چاپی
const mrow = (i, n) => {
  const d = menu[i];
  return `<article class="mrow rev" data-act="quick" data-i="${i}"><span class="mr-th">${img(i)}</span><span class="mr-n">${n < 9 ? '۰' : ''}${fa(n + 1)}</span><span class="mr-b"><span class="mr-t"><b>${d[0]}</b><i></i><em>${fa(d[2] * 1000)}</em></span><small>${d[3]}</small></span><span class="mr-add" data-ci="${i}">${cctl(i)}</span></article>`;
};
const grid = () => {
  const g = $('#grid');
  if (!g) return;
  const ids = menu
    .map((_, i) => i)
    .filter(i => match(menu[i]))
    .sort(sorts[f.sort]);
  $('#rc').textContent = fa(ids.length) + ' مورد از ' + fa(menu.length);
  g.innerHTML = !ids.length
    ? '<p class="muted">موردی پیدا نشد. فیلترها را کم کنید.</p>'
    : f.mode === 'table'
      ? '<div class="th"><span>غذا</span><span class="lg">منطقه</span><span class="lg">روش</span><span>زمان</span><span class="lg">انرژی</span><span>امتیاز</span><span>قیمت</span><span></span></div>' +
        ids.map(row).join('')
      : menuSections(ids);
  reveal();
  mpvInit();
};
const menuSections = ids => {
  const foods = ids.filter(i => menu[i][1] < NF),
    prods = ids.filter(i => menu[i][1] >= NF),
    both = foods.length && prods.length;
  return (
    (foods.length
      ? (both ? '<p class="msec">غذاها</p>' : '') +
        `<div class="mstage">${mpvHtml()}<div class="mlist">${foods.map(mrow).join('')}</div></div>`
      : '') +
    (prods.length
      ? (both ? '<p class="msec">محصولات</p>' : '') + `<div class="grid">${prods.map(card).join('')}</div>`
      : '')
  );
};
const presets = [
  ['کباب‌های ذغالی', 'از کوبیده تا برگ', '#9A3F2B', () => (f.cat = 1)],
  ['خورشت و پلو', 'دم‌پخت چند ساعته', '#2F5D3A', () => (f.cat = 2)],
  ['گیاهی', 'سبک و پر از سبزی', '#2A6F6B', () => (f.diet = ['v'])],
  ['زیر ۱۵ دقیقه', 'سریع و داغ', '#2B2D33', () => (f.time = 1)],
  ['بدون گلوتن', 'مناسب حساسیت‌ها', '#5B3A78', () => (f.diet = ['gf'])],
  ['دسرهای سنتی', 'پایان شیرین شب', '#A23A5A', () => (f.cat = 3)]
];
const reset = () => {
  f = {
    cat: -1,
    reg: [],
    meth: [],
    diet: [],
    time: 0,
    pmax: 1000,
    q: '',
    sort: 'pop',
    mode: f.mode
  };
};
const go = () => (location.hash === '#menu' ? render() : (location.hash = 'menu'));
const info = `<dl class="contact"><div><dt>آدرس</dt><dd>${esc(SITE.address)}</dd></div><div><dt>تلفن</dt><dd><a href="tel:${esc(SITE.phone)}" dir="ltr">${esc(SITE.phoneLabel)}</a></dd></div><div><dt>ایمیل</dt><dd dir="ltr">${esc(SITE.email)}</dd></div><div><dt>ساعت کاری</dt><dd>${esc(SITE.hours)}</dd></div>${SITE.instagram ? `<div><dt>اینستاگرام</dt><dd dir="ltr"><a href="https://instagram.com/${esc(SITE.instagram)}" target="_blank" rel="noopener">@${esc(SITE.instagram)}</a></dd></div>` : ''}</dl>`;
