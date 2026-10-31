/**
 * پیگیری سفارش
 */
'use strict';

const TRK = SITE.trackMinutes || [0, 2, 8, 25, 40];
const TRN = [
  ['ثبت شد', 'سفارش شما دریافت شد.'],
  ['تأیید شد', 'رستوران سفارش را پذیرفت.'],
  ['در حال پخت', 'آشپزخانه مشغول آماده‌سازی است.'],
  ['آماده و در مسیر', 'سفارش از آشپزخانه خارج شد.'],
  ['تحویل شد', 'نوش جان!']
];
const trkFind = c => {
  c = (c || '').trim().toUpperCase();
  return ((me && me.orders) || []).concat(ls.get('gorders') || []).find(o => o.id === c);
};
const trkStage = o => {
  const m = (Date.now() - o.date) / 6e4;
  let k = 0;
  TRK.forEach((t, j) => {
    if (m >= t) k = j;
  });
  return k;
};
const trkView = o => {
  const k = trkStage(o),
    m = (Date.now() - o.date) / 6e4,
    left = Math.max(0, Math.ceil(TRK[TRK.length - 1] - m));
  return `<div class="box"><div class="eta"><span class="pl4" aria-hidden="true"></span><div><b>${k >= TRN.length - 1 ? 'سفارش تحویل شد' : TRN[k][0]}</b><small>${k >= TRN.length - 1 ? TRN[k][1] : `حدود ${fa(left)} دقیقه‌ی دیگر · کد ${o.id}`}</small></div></div><ol class="trs" style="padding:0;margin:0">${TRN.map((t, j) => `<li class="${j < k ? 'done' : j === k ? 'now' : ''}"><i>${j < k ? '✓' : fa(j + 1)}</i><div><b>${t[0]}</b><small>${j <= k ? t[1] : ''}</small></div></li>`).join('')}</ol><p class="muted" style="margin:0">${o.items.map(x => esc(x[0]) + ' × ' + fa(x[1])).join('، ')}</p><b>${money(o.total)}</b></div>`;
};
const trkRender = () => {
  const w = $('#trkw');
  if (!w) return;
  const c = ls.get('trk') || '';
  const o = c && trkFind(c);
  const all = ((me && me.orders) || []).concat(ls.get('gorders') || []).slice(0, 6);
  w.innerHTML =
    (o
      ? trkView(o)
      : c
        ? '<p class="muted">سفارشی با این کد در این مرورگر پیدا نشد. کد را مثل S-AB12 وارد کنید.</p>'
        : '') +
    (all.length
      ? `<div class="box"><b>سفارش‌های اخیر شما</b><div class="recent">${all.map(x => `<button type="button" data-act="trko" data-c="${x.id}">${x.id}</button>`).join('')}</div></div>`
      : '');
};
setInterval(() => {
  if ($('#trkw') && !document.hidden) trkRender();
}, 20000);
