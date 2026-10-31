/**
 * ابزارهای پایه: انتخابگر DOM، قالب‌بندی عدد فارسی، escape
 */
'use strict';

// ارتفاع ثابت صفحه (مثل 100svh در CSS)؛ با جمع‌شدن نوار سافاری تغییر نمی‌کند
const VH = (() => {
  let probe;
  return () => {
    if (!probe) {
      probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none';
      document.body.appendChild(probe);
    }
    return probe.offsetHeight || innerHeight;
  };
})();
const $ = s => document.querySelector(s),
  $$ = s => [...document.querySelectorAll(s)];
const fa = n => Number(n).toLocaleString('fa-IR'),
  money = p => fa(p * 1000) + ' تومان';
const toEn = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
const esc = s =>
  String(s).replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
