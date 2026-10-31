/**
 * افکت‌های اسکرول صفحه‌ی محصول (سبک اپل): پارالاکس نرم و نوار خرید شیشه‌ای
 */
'use strict';
(() => {
  let tick = 0;
  const vh = () => (typeof VH === 'function' ? VH() : innerHeight);
  const run = () => {
    tick = 0;
    const h = vh();
    document.querySelectorAll('.ap [data-par]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > h + 100) return;
      const p = Math.max(0, Math.min(1, (h - r.top) / (h + r.height)));
      el.style.setProperty('--p', p.toFixed(3));
    });
  };
  addEventListener(
    'scroll',
    () => {
      if (!tick) tick = requestAnimationFrame(run);
    },
    { passive: true }
  );
  addEventListener('hashchange', () => setTimeout(run, 60));
  new MutationObserver(() => setTimeout(run, 30)).observe(document.body, { childList: true, subtree: true });
})();
