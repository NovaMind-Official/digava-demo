/**
 * باشگاه مشتریان و وضعیت سفارش
 */
'use strict';

const tierOf = p =>
  p >= 1500 ? ['طلایی', 1500, 1500] : p >= 500 ? ['نقره‌ای', 500, 1500] : ['برنزی', 0, 500];
const ptsOf = u => Math.floor(u.orders.reduce((s, o) => s + o.total, 0) / 10);
const SN = ['ثبت شد', 'در حال آماده‌سازی', 'آماده تحویل', 'تحویل شد'];
const stOf = o => {
  const m = (Date.now() - o.date) / 6e4;
  return m < 1 ? 0 : m < 15 ? 1 : m < 40 ? 2 : 3;
};
const orderCard = (o, k) =>
  `<div class="oc"><div class="oh"><b>${o.id}</b><span class="muted">${new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(o.date)}</span><span class="tag">${SN[stOf(o)]}</span></div><div class="stp">${SN.map((s, j) => `<i class="${j <= stOf(o) ? 'on' : ''}" title="${s}"></i>`).join('')}</div><p>${o.items.map(x => esc(x[0]) + ' × ' + fa(x[1])).join('، ')}</p><div class="oh"><b>${money(o.total)}</b>${o.ks ? `<button class="btn sm" data-act="reorder" data-k="${k}">سفارش مجدد</button>` : ''}</div></div>`;
