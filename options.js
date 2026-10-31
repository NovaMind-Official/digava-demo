/**
 * اندازه و افزودنی‌ها، ست‌ها، مقایسه و وعده‌ی روز
 */
'use strict';

const SZ = g =>
  g === 'f'
    ? [
        ['نیم‌پرس', 0.7],
        ['یک‌پرس', 1],
        ['ویژه', 1.35]
      ]
    : [
        ['استاندارد', 1],
        ['دوبرابر', 1.9]
      ];
const AO = g =>
  g === 'f'
    ? [
        ['پیاز داغ', 15],
        ['ماست و خیار', 30],
        ['سالاد شیرازی', 40],
        ['نان تازه', 10]
      ]
    : [
        ['بسته‌بندی هدیه', 25],
        ['کارت تبریک', 10]
      ];
const grpOf = i => {
  const c = menu[i][1];
  return [0, 1, 2, 6, 7].includes(c) ? 'f' : c >= NF && c !== 13 ? 'p' : '';
};
const defSel = i => ({ s: grpOf(i) === 'f' ? 1 : 0, a: [] });
const sel = {};
const keyOf = i => {
  const sl = sel[i] || defSel(i),
    g = grpOf(i);
  return g && (sl.s !== defSel(i).s || sl.a.length)
    ? `${i}~${sl.s}~${sl.a.slice().sort().join('.')}`
    : String(i);
};
const parseK = k => {
  if (k[0] === 'c') return { c: +k.slice(1) };
  const [i, s, a] = k.split('~');
  return { i: +i, s: s === undefined ? null : +s, a: a ? a.split('.').map(Number) : [] };
};
const combos = [
  [
    'ست ناهار',
    'کباب و خورشت با دسر',
    [
      ['چلوکباب کوبیده', 1],
      ['قورمه‌سبزی', 1],
      ['بستنی سنتی', 2]
    ],
    10
  ],
  [
    'ست هدیه',
    'زعفران و باقلوا',
    [
      ['زعفران نگین، ۱ مثقال', 1],
      ['باقلوا', 1]
    ],
    12
  ]
];
const comboItems = c => combos[c][2].map(([n, q]) => [menu.findIndex(d => d[0] === n), q]);
const comboRaw = c => comboItems(c).reduce((s, [i, q]) => s + menu[i][2] * q, 0);
const comboPrice = c => Math.round(comboRaw(c) * (1 - combos[c][3] / 100));
const unit = k => {
  const p = parseK(k);
  if (p.c !== undefined) return comboPrice(p.c);
  const g = grpOf(p.i),
    z = g ? SZ(g)[p.s === null ? defSel(p.i).s : p.s][1] : 1;
  return Math.round(menu[p.i][2] * z + (g ? p.a.reduce((s, x) => s + AO(g)[x][1], 0) : 0));
};
const label = k => {
  const p = parseK(k);
  if (p.c !== undefined) return combos[p.c][0];
  const g = grpOf(p.i),
    t = [];
  if (g) {
    if (p.s !== null && p.s !== defSel(p.i).s) t.push(SZ(g)[p.s][0]);
    p.a.forEach(x => t.push(AO(g)[x][0]));
  }
  return menu[p.i][0] + (t.length ? ' (' + t.join('، ') + ')' : '');
};
const stepK = k =>
  `<span class="step"><button data-act="addk" data-k="${k}" data-d="-1" aria-label="کم کردن">−</button><b>${fa(cart[k])}</b><button data-act="addk" data-k="${k}" data-d="1" aria-label="زیاد کردن">+</button></span>`;
const optsInner = i => {
  const g = grpOf(i);
  if (!g) return '<p class="muted">این مورد گزینه‌ی اضافه ندارد.</p>';
  const sl = sel[i] || (sel[i] = defSel(i));
  return `<div class="og"><small>اندازه</small><div class="chs">${SZ(g)
    .map(
      (z, k) =>
        `<button type="button" data-act="osz" data-i="${i}" data-k="${k}" aria-pressed="${sl.s === k}">${z[0]}</button>`
    )
    .join('')}</div></div><div class="og"><small>افزودنی‌ها</small><div class="chs">${AO(g)
    .map(
      (a, k) =>
        `<button type="button" data-act="oad" data-i="${i}" data-k="${k}" aria-pressed="${sl.a.includes(k)}">${a[0]} <i>+${fa(a[1])}</i></button>`
    )
    .join(
      ''
    )}</div></div>${view === 'product' && cur === i ? '' : `<button class="btn sm" data-act="oadd" data-i="${i}">افزودن به سبد، ${money(unit(keyOf(i)))}</button>`}`;
};
const refreshOpts = i => {
  $$(`[data-opt="${i}"]`).forEach(n => {
    if (n.parentNode.classList.contains('open') || n.id === 'optp') n.innerHTML = optsInner(i);
  });
  const pp = $('#ppr');
  if (pp && cur === i) {
    pp.textContent = money(unit(keyOf(i)));
    const c = $('#dctl');
    if (c) c.innerHTML = pctl(i);
  }
};
const cmpSet = [];
const renderCmp = () => {
  const b = $('#cmpbar');
  b.hidden = !cmpSet.length;
  b.innerHTML =
    cmpSet.map(i => `<span class="ci">${menu[i][0]}</span>`).join('') +
    `<button class="btn sm" data-act="cmpgo">مقایسه (${fa(cmpSet.length)})</button><button class="ic" data-act="cmpclr">پاک کردن</button>`;
  $$('[data-act="cmp"]').forEach(n => n.setAttribute('aria-pressed', cmpSet.includes(+n.dataset.i)));
};
const rowsC = [
  ['قیمت', d => money(d[2])],
  ['امتیاز', d => '★ ' + fa(d[8]) + ' (' + fa(d[9]) + ' نظر)'],
  ['دسته', d => cats[d[1]]],
  ['منطقه', d => d[10]],
  ['زمان', d => (d[12] ? fa(d[12]) + ' دقیقه' : '—')],
  ['انرژی', d => (d[12] ? fa(d[14]) + ' کالری' : '—')],
  [
    'رژیم',
    d =>
      [d[13] ? 'بدون گلوتن' : '', d[4].includes('v') ? 'گیاهی' : '', d[4].includes('s') ? 'تند' : '']
        .filter(Boolean)
        .join('، ') || '—'
  ],
  ['مواد', d => d[7]]
];
const openCmp = () => {
  $('#cp').innerHTML =
    `<button class="x" data-act="close" aria-label="بستن">×</button><h3>مقایسه</h3><div class="cmpt" style="--n:${cmpSet.length}"><div></div>${cmpSet.map(i => `<div class="ch"><span>${img(i)}</span><b>${menu[i][0]}</b></div>`).join('')}${rowsC.map(([t, f]) => `<div class="rl">${t}</div>${cmpSet.map(i => `<div>${f(menu[i])}</div>`).join('')}`).join('')}</div>`;
  $('#cp').showModal();
};
const T = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tehran' }));
const mealOf = hh =>
  hh < 6
    ? 'late'
    : hh < 11
      ? 'morning'
      : hh < 16
        ? 'lunch'
        : hh < 19
          ? 'evening'
          : hh < 23
            ? 'dinner'
            : 'late';
const MEALS = {
  morning: ['صبحانه', 'صبح بخیر؛ شروعی گرم و سنتی.', ['کوکو سبزی', 'کشک بادمجان', 'بستنی سنتی']],
  lunch: ['ناهار', 'ظهر است؛ کباب و خورشت تازه.', ['چلوکباب کوبیده', 'قورمه‌سبزی', 'زرشک‌پلو با مرغ']],
  evening: ['عصرانه', 'عصر است؛ وقت شیرینی.', ['باقلوا', 'بستنی سنتی', 'کوکو سبزی']],
  dinner: ['شام', 'شب است؛ سفره‌ی شام را بچینیم.', ['چلوکباب کوبیده', 'زرشک‌پلو با مرغ', 'کشک بادمجان']],
  late: ['شب‌نشینی', 'دیروقت است؛ چیزی برای شب‌نشینی.', ['قورمه‌سبزی', 'بستنی سنتی', 'باقلوا']]
};
const tick = () => {
  const n = T(),
    e = new Date(n);
  e.setHours(23, 0, 0, 0);
  const s = Math.max(0, Math.floor((e - n) / 1000)),
    p = x => x.toLocaleString('fa-IR', { minimumIntegerDigits: 2 });
  const left = 24 - Math.min(21, Math.max(0, Math.round((n.getHours() + n.getMinutes() / 60 - 12) * 1.8)));
  $('#cdn').innerHTML = s
    ? `<span><b>${p(Math.floor(s / 3600))}</b>ساعت</span><span><b>${p(Math.floor((s % 3600) / 60))}</b>دقیقه</span><span><b>${p(s % 60)}</b>ثانیه</span>`
    : '<span>سرو امروز تمام شد</span>';
  $('#cap').textContent = `${fa(left)} پرس مانده از ${fa(24)}`;
  $('#capb').style.setProperty('--w', (left / 24) * 100 + '%');
};
