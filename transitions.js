/**
 * انتقال بین صفحه‌ها
 */
'use strict';

let vtEl = null;
document.addEventListener(
  'pointerdown',
  e => {
    const o = e.target.closest('.card .open, .card h3 a, .ri .im');
    vtEl = o ? o.querySelector('img') || o : null;
  },
  true
);
document.addEventListener(
  'pointermove',
  e => {
    if (e.pointerType !== 'mouse') return;
    const c = e.target.closest('.card');
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 7 + 'deg');
    c.style.setProperty('--rx', (0.5 - (e.clientY - r.top) / r.height) * 7 + 'deg');
  },
  { passive: true }
);
document.addEventListener('pointerout', e => {
  const c = e.target.closest && e.target.closest('.card');
  if (c && !c.contains(e.relatedTarget)) {
    c.style.removeProperty('--rx');
    c.style.removeProperty('--ry');
  }
});
const navRender = () => {
  if (RM()) return render();
  const S = srcRect(null),
    D = 620;
  const src = vtEl && document.contains(vtEl) ? vtEl : null;
  if (src) src.style.viewTransitionName = 'dishimg';
  vtEl = null;
  if (document.startViewTransition) {
    try {
      const vt = document.startViewTransition(() => {
        render();
        if (view === 'product') {
          const t = document.querySelector('.pv .pimg');
          if (t && src) {
            src.style.viewTransitionName = '';
            t.style.viewTransitionName = 'dishimg';
          }
        }
      });
      vt.ready
        .then(() => {
          const k = morph(S),
            de = document.documentElement;
          de.animate(
            {
              clipPath: k.clipPath,
              transform: k.transform,
              filter: k.filter,
              transformOrigin: [k.transformOrigin, k.transformOrigin]
            },
            { duration: D, easing: EASE, pseudoElement: '::view-transition-new(root)', fill: 'both' }
          );
          de.animate(
            {
              transform: ['scale(1)', 'scale(.94)'],
              filter: ['brightness(1)', 'brightness(.55)'],
              transformOrigin: [k.transformOrigin, k.transformOrigin]
            },
            { duration: D, easing: EASE, pseudoElement: '::view-transition-old(root)', fill: 'both' }
          );
        })
        .catch(() => {});
      return;
    } catch (_) {}
  }
  render();
  const a = $('#app');
  if (a && a.animate) {
    const k = morph(S, 0.9);
    a.animate(
      {
        clipPath: k.clipPath.map((c, n) =>
          n ? c : insetOf({ ...S.r, t: S.r.t + scrollY }, innerWidth, document.documentElement.scrollHeight)
        ),
        opacity: [0, 1]
      },
      { duration: D, easing: EASE }
    );
  }
};
addEventListener('hashchange', () => {
  if (skip) {
    skip = false;
    return;
  }
  navRender();
});
