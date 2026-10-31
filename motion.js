/**
 * حرکت و ظاهر شدن بخش‌ها با اسکرول
 */
'use strict';

const io = new IntersectionObserver(
  es =>
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }),
  { threshold: 0, rootMargin: '0px 0px -4% 0px' }
);
const RM = () => matchMedia('(prefers-reduced-motion:reduce)').matches;
const EASE = 'cubic-bezier(.32,.72,0,1)';
let lastP = { x: innerWidth / 2, y: 80, t: 0, r: null, rad: 24 };
document.addEventListener(
  'pointerdown',
  e => {
    const el =
      e.target.closest &&
      e.target.closest(
        '.card,.ct,.arch,.combo,.rvc,.btn,.bn a,.sb a,.icon,.mini,.cmd li,a[href^="#"],button'
      );
    let r = null,
      rad = 24;
    if (el) {
      const q = el.getBoundingClientRect();
      if (q.width > 20 && q.height > 20 && q.width < innerWidth * 0.98) {
        r = { l: q.left, t: q.top, w: q.width, h: q.height };
        rad = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 16;
      }
    }
    lastP = { x: e.clientX, y: e.clientY, t: Date.now(), r, rad };
  },
  true
);
const srcRect = el => {
  if (Date.now() - lastP.t < 1800 && lastP.r) return { r: lastP.r, rad: lastP.rad, x: lastP.x, y: lastP.y };
  if (el) {
    const q = el.getBoundingClientRect();
    return {
      r: { l: q.left, t: q.top, w: q.width, h: q.height },
      rad: 99,
      x: q.left + q.width / 2,
      y: q.top + q.height / 2
    };
  }
  const w = 120,
    h = 48;
  return {
    r: { l: innerWidth / 2 - w / 2, t: innerHeight * 0.45, w, h },
    rad: 24,
    x: innerWidth / 2,
    y: innerHeight * 0.45
  };
};
const insetOf = (r, W, H) =>
  `inset(${Math.max(0, r.t)}px ${Math.max(0, W - r.l - r.w)}px ${Math.max(0, H - r.t - r.h)}px ${Math.max(0, r.l)}px round ${r.rad}px)`;
const morph = (S, from) => ({
  clipPath: [insetOf(S.r, innerWidth, innerHeight), `inset(0px 0px 0px 0px round 0px)`],
  transform: [`scale(${from || 0.82})`, 'scale(1)'],
  filter: ['blur(10px) brightness(1.15)', 'blur(0) brightness(1)'],
  transformOrigin: `${S.x}px ${S.y}px`
});
const tIO =
  'IntersectionObserver' in window
    ? new IntersectionObserver(
        es => {
          let n = 0;
          es.filter(e => e.isIntersecting)
            .sort(
              (a, b) =>
                a.boundingClientRect.top - b.boundingClientRect.top ||
                b.boundingClientRect.left - a.boundingClientRect.left
            )
            .forEach(e => {
              const el = e.target;
              el.style.setProperty('--sd', (n++ % 8) * 80 + 'ms');
              el.classList.add('set');
              tIO.unobserve(el);
              el.addEventListener('animationend', () => el.classList.remove('tbl', 'set'), { once: true });
            });
        },
        { threshold: 0, rootMargin: '0px 0px -6% 0px' }
      )
    : null;
const tableSet = () => {
  if (!tIO || RM()) return;
  $$('.grid .card:not([data-st])').forEach(c => {
    c.dataset.st = 1;
    c.classList.add('tbl');
    c.style.setProperty('--r', (Math.random() * 7 - 3.5).toFixed(1) + 'deg');
    tIO.observe(c);
  });
};
const reveal = () =>
  $$('.rev:not(.in)').forEach((n, k) => {
    n.style.setProperty('--d', (k % 6) * 70 + 'ms');
    io.observe(n);
    tableSet();
  });
