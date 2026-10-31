/**
 * مراسم و کیترینگ
 */
'use strict';

const EVC = SITE.events || {
  deposit: 0.3,
  packages: [
    [
      'دورهمی',
      480,
      ['پیش‌غذا: کشک بادمجان و سالاد شیرازی', 'چلوکباب کوبیده یا جوجه‌کباب', 'نوشیدنی و چای'],
      0
    ],
    [
      'ویژه',
      750,
      ['۳ پیش‌غذا', 'کباب برگ یا شیشلیک و خورشت', 'دسر: فالوده یا شله‌زرد', 'چای و نبات، سرو با دوغ'],
      1
    ],
    [
      'سلطنتی',
      1150,
      ['بوفه‌ی کامل پیش‌غذا', 'سه نوع غذای اصلی', 'باقلوا و بستنی سنتی', 'نوشیدنی نامحدود و پذیرایی ورودی'],
      0
    ]
  ],
  extras: [
    ['دکوراسیون و گل‌آرایی', 6000, 0],
    ['موسیقی زنده (۳ ساعت)', 8000, 0],
    ['کیک و دسر اختصاصی', 0, 60],
    ['سرویس در مکان شما', 0, 70]
  ],
  occasions: ['تولد', 'عقد و جشن', 'همایش و شرکتی', 'دورهمی خانوادگی', 'شب یلدا']
};
const EV = { occ: 0, pk: 1, g: 40, x: [], date: '' };
const evTot = () => {
  const P = EVC.packages[EV.pk],
    base = P[1] * EV.g,
    ex = EV.x.reduce((t, k) => t + EVC.extras[k][1] + EVC.extras[k][2] * EV.g, 0);
  return { base, ex, total: base + ex, dep: Math.round((base + ex) * EVC.deposit) };
};
const evSum = () => {
  const t = evTot(),
    P = EVC.packages[EV.pk];
  return (
    `<div class="row"><span>بسته‌ی «${P[0]}» برای ${fa(EV.g)} نفر</span><b>${money(t.base)}</b></div>` +
    EV.x
      .map(
        k =>
          `<div class="row"><span>${EVC.extras[k][0]}</span><span>${money(EVC.extras[k][1] + EVC.extras[k][2] * EV.g)}</span></div>`
      )
      .join('') +
    `<div class="row t"><span>برآورد کل</span><b>${money(t.total)}</b></div><div class="row"><span>پیش‌پرداخت (${fa(Math.round(EVC.deposit * 100))}٪)</span><span>${money(t.dep)}</span></div>` +
    (EV.g > 120
      ? '<p class="warn">برای بیش از ۱۲۰ نفر، سالن اختصاصی لازم است؛ پس از ارسال درخواست با شما تماس می‌گیریم.</p>'
      : '') +
    '<p class="muted" style="font-size:.78rem;margin:0">این عدد برآورد اولیه است و بعد از هماهنگی نهایی می‌شود.</p>'
  );
};
const evChips = () =>
  `<div class="chs" id="evocc">${EVC.occasions.map((o, k) => `<button type="button" data-act="evo" data-k="${k}" aria-pressed="${EV.occ === k}">${o}</button>`).join('')}</div>`;
const evPk = () =>
  `<div class="evg" id="evpk">${EVC.packages.map((P, k) => `<button type="button" class="evp${P[3] ? ' pop' : ''}" data-act="evp" data-k="${k}" aria-pressed="${EV.pk === k}"><small>بسته‌ی ${fa(k + 1)}</small><h3>${P[0]}</h3><div class="pp3">${fa(P[1] * 1000)}<small>تومان برای هر نفر</small></div><ul>${P[2].map(x => `<li>${x}</li>`).join('')}</ul></button>`).join('')}</div>`;
const evX = () =>
  `<div class="chs" id="evx">${EVC.extras.map((x, k) => `<button type="button" data-act="evx" data-k="${k}" aria-pressed="${EV.x.includes(k)}">${x[0]}</button>`).join('')}</div>`;
const evRefresh = () => {
  const a = $('#evs');
  if (a) a.innerHTML = evSum();
  const n = $('#evn');
  if (n) n.textContent = fa(EV.g);
  $$('#evocc button').forEach((b, k) => b.setAttribute('aria-pressed', EV.occ === k));
  $$('#evpk .evp').forEach((b, k) => b.setAttribute('aria-pressed', EV.pk === k));
  $$('#evx button').forEach((b, k) => b.setAttribute('aria-pressed', EV.x.includes(k)));
};
document.addEventListener('input', e => {
  if (e.target.id === 'evg') {
    EV.g = +e.target.value;
    evRefresh();
  } else if (e.target.id === 'evd') EV.date = e.target.value;
});
