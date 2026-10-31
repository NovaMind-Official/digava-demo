/**
 * تصویرسازی برداری غذاها (SVG) برای زمانی که عکس واقعی گذاشته نشده
 */
'use strict';

/* تصویرسازی خودکار برای همه‌ی غذاها و محصولات — اگر عکس واقعی در assets/img/dishes نباشد، این طرح‌ها نمایش داده می‌شوند */
const dishArt = (() => {
  const H = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => {
    const A = H(a),
      B = H(b);
    return (
      '#' +
      A.map((v, i) =>
        Math.round(v + (B[i] - v) * t)
          .toString(16)
          .padStart(2, '0')
      ).join('')
    );
  };
  const lt = (c, t) => mix(c, '#ffffff', t),
    dk = (c, t) => mix(c, '#000000', t);
  const rng = s => {
    s = (s * 9301 + 49297) % 233280;
    return () => (s = (s * 9301 + 49297) % 233280) / 233280;
  };
  const f1 = n => Math.round(n * 10) / 10;
  const E = (x, y, rx, ry, fill, o = '') =>
    `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${fill}" ${o}/>`;
  const C = (x, y, r, fill, o = '') => E(x, y, r, r, fill, o);
  const R = (x, y, w, h, r, fill, o = '') =>
    `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${r}" fill="${fill}" ${o}/>`;
  const Pth = (d, fill, o = '') => `<path d="${d}" fill="${fill}" ${o}/>`;
  const defs = (id, a, b, cx = 0.5, cy = 0.35, r = 0.75) =>
    `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
  const lin = (id, a, b, x2 = 0, y2 = 1) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const shadow = (x, y, rx, ry, o = 0.35) => E(x, y, rx, ry, '#000', `opacity="${o}" filter="url(#bl)"`);
  const scatter = (r, n, cx, cy, rx, ry, fn) => {
    let s = '';
    for (let k = 0; k < n; k++) {
      const a = r() * 6.283,
        d = Math.sqrt(r());
      s += fn(cx + Math.cos(a) * d * rx, cy + Math.sin(a) * d * ry, r, k);
    }
    return s;
  };

  const plate = (cx = 100, cy = 102, r = 76, tone = '#F7F2E8') =>
    shadow(cx + 4, cy + 9, r, r * 0.96, 0.4) +
    C(cx, cy, r, tone, 'stroke="' + dk(tone, 0.12) + '" stroke-width="1"') +
    C(cx, cy, r * 0.8, 'url(#pl)', 'stroke="' + dk(tone, 0.08) + '" stroke-width="1"') +
    C(cx - r * 0.3, cy - r * 0.5, r * 0.5, '#fff', 'opacity=".18"');
  const PD = (tone = '#F7F2E8') => defs('pl', lt(tone, 0.5), dk(tone, 0.06), 0.4, 0.3, 0.9);
  const bowl = (cx, cy, r, tone = '#EFE6D6', liq = '#999') =>
    shadow(cx + 4, cy + 9, r, r * 0.96, 0.45) +
    C(cx, cy, r, tone, 'stroke="' + dk(tone, 0.2) + '" stroke-width="1.2"') +
    C(cx, cy, r * 0.86, dk(tone, 0.1)) +
    C(cx, cy, r * 0.8, liq) +
    C(cx - r * 0.3, cy - r * 0.4, r * 0.45, '#fff', 'opacity=".12"') +
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.8}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="3"/>`;
  const rice = (r, cx, cy, rx, ry, saf = 0.45, tint = '#FBF3DC') => {
    let s = shadow(cx + 3, cy + ry * 0.75, rx, ry * 0.5, 0.3) + E(cx, cy, rx, ry, 'url(#rc)');
    s += scatter(
      r,
      90,
      cx,
      cy,
      rx * 0.92,
      ry * 0.9,
      (x, y, r2) =>
        `<path d="M${f1(x)} ${f1(y)}l${f1(r2() * 5 - 2.5)} ${f1(r2() * 3)}" stroke="${r2() > 0.5 ? '#fff' : '#E9D9AD'}" stroke-width="1.1" stroke-linecap="round" opacity=".85"/>`
    );
    if (saf)
      s += E(
        cx - rx * 0.15,
        cy - ry * 0.15,
        rx * 0.55,
        ry * 0.5,
        '#F2A81E',
        `opacity="${saf}" filter="url(#bl2)"`
      );
    return s + E(cx - rx * 0.3, cy - ry * 0.45, rx * 0.35, ry * 0.2, '#fff', 'opacity=".4"');
  };
  const RD = (tint = '#FFF9E6') => defs('rc', '#FFFFFF', mix(tint, '#D8C48E', 0.55), 0.4, 0.3, 0.8);
  const tomato = (x, y, r = 12) =>
    C(x + 2, y + 3, r, '#000', 'opacity=".25"') +
    C(x, y, r, 'url(#tm)') +
    `<path d="M${x - 4} ${y - r + 2}l4 -3 4 3 -4 2z" fill="#4C8B3A"/>` +
    `<path d="M${x - 7} ${y - 3}q2 -4 6 -4M${x + 3} ${y + 5}q4 -1 5 -5" stroke="#3a0d0a" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/>`;
  const TD = defs('tm', '#F2574A', '#9E1B16', 0.35, 0.3, 0.8);
  const herb = (x, y, a = 0, c = '#3C8A3A') =>
    `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0q5 -8 0 -16q-5 8 0 16z" fill="${c}"/><path d="M0 0v-14" stroke="${dk(c, 0.3)}" stroke-width=".8"/></g>`;
  const lemon = (x, y, r = 11) =>
    C(x + 2, y + 3, r, '#000', 'opacity=".25"') +
    C(x, y, r, '#F2D230', 'stroke="#C9A817" stroke-width="1.2"') +
    C(x, y, r * 0.78, '#FBE98A') +
    [0, 1, 2, 3, 4, 5]
      .map(
        k =>
          `<path d="M${x} ${y}L${f1(x + Math.cos(k * 1.047) * r * 0.75)} ${f1(y + Math.sin(k * 1.047) * r * 0.75)}" stroke="#F2D230" stroke-width="1.4"/>`
      )
      .join('');
  const bread = (x, y, w, h, a, c = '#D9A860') =>
    `<g transform="rotate(${a} ${x} ${y})">${E(x + 2, y + 3, w, h, '#000', 'opacity=".25"')}${E(x, y, w, h, c, 'stroke="' + dk(c, 0.2) + '" stroke-width="1"')}${E(x - w * 0.1, y - h * 0.2, w * 0.7, h * 0.5, lt(c, 0.3), 'opacity=".5"')}<path d="M${x - w * 0.6} ${y}q${w * 0.3} ${-h * 0.5} ${w * 0.6} 0t${w * 0.6} 0" stroke="${dk(c, 0.3)}" stroke-width="1.2" fill="none" opacity=".5"/></g>`;
  const spoon = (x, y, a) =>
    `<g transform="rotate(${a} ${x} ${y})">${R(x - 2, y, 4, 52, 2, '#B9BEC4')}${E(x, y - 4, 9, 13, '#D6DADF', 'stroke="#9AA0A6" stroke-width="1"')}</g>`;
  const glass = (x, y, w, h, liq, o = {}) => {
    const top = w,
      bot = w * 0.72;
    let s = shadow(x + 6, y + h + 3, w * 0.7, 6, 0.35);
    s += Pth(
      `M${x - top / 2} ${y}L${x - bot / 2} ${y + h}L${x + bot / 2} ${y + h}L${x + top / 2} ${y}z`,
      '#fff',
      'opacity=".16" stroke="#fff" stroke-opacity=".6" stroke-width="1.4"'
    );
    const ly = y + (o.fill ? h * (1 - o.fill) : h * 0.12),
      lt2 = top - (top - bot) * ((ly - y) / h),
      lb = bot;
    s += Pth(
      `M${x - lt2 / 2} ${ly}L${x - lb / 2} ${y + h}L${x + lb / 2} ${y + h}L${x + lt2 / 2} ${ly}z`,
      liq,
      'opacity=".92"'
    );
    s += Pth(
      `M${x - top / 2 + 4} ${y + 4}L${x - bot / 2 + 4} ${y + h - 6}`,
      'none',
      'stroke="#fff" stroke-opacity=".5" stroke-width="2.5" stroke-linecap="round"'
    );
    return s;
  };

  /* ───────── طرح‌ها ───────── */
  const kebab = (d, i, r) => {
    const c = d[6],
      n = d[0];
    let s = PD() + RD() + TD + plate();
    s += rice(r, 82, 106, 40, 30, 0.5);
    if (/کوبیده/.test(n))
      s +=
        `<g transform="rotate(-22 100 98)">` +
        [88, 108]
          .map(
            y =>
              R(46, y, 116, 17, 8.5, '#B5643A', 'stroke="#7C3F20" stroke-width="1"') +
              R(50, y + 2, 108, 5, 2.5, '#E09A62', 'opacity=".55"') +
              [...Array(11)]
                .map(
                  (_, k) =>
                    `<path d="M${58 + k * 9.5} ${y + 3}q2 5 0 11" stroke="#6A3419" stroke-width="1.5" fill="none" opacity=".7"/>`
                )
                .join('')
          )
          .join('') +
        R(40, 99, 128, 3, 1.5, '#C8CDD2') +
        `</g>`;
    else if (/جوجه/.test(n))
      s += [
        [96, 84, 8],
        [114, 100, -10],
        [92, 112, 14],
        [118, 126, 4],
        [100, 134, -6]
      ]
        .map(
          ([x, y, a]) =>
            `<g transform="rotate(${a} ${x} ${y})">${R(x - 18, y - 11, 36, 22, 9, '#E9A23B', 'stroke="#A8601A" stroke-width="1"')}${R(x - 14, y - 8, 22, 6, 3, '#F8CF7A', 'opacity=".7"')}<path d="M${x - 8} ${y + 2}l5 5M${x + 3} ${y - 1}l6 6" stroke="#6E3A0E" stroke-width="2" opacity=".55" stroke-linecap="round"/></g>`
        )
        .join('');
    else if (/برگ/.test(n))
      s +=
        [
          [100, 92, -16],
          [106, 118, -10]
        ]
          .map(
            ([x, y, a]) =>
              `<g transform="rotate(${a} ${x} ${y})">${R(x - 52, y - 11, 104, 22, 11, '#B5413A', 'stroke="#6E2018" stroke-width="1"')}${[...Array(8)].map((_, k) => `<path d="M${x - 44 + k * 12} ${y - 9}l8 18" stroke="#52140E" stroke-width="2.2" opacity=".55"/>`).join('')}${R(x - 46, y - 8, 92, 5, 2.5, '#E58B7C', 'opacity=".5"')}</g>`
          )
          .join('') + R(46, 100, 118, 3, 1.5, '#C8CDD2', 'transform="rotate(-14 100 100)"');
    else if (/شیشلیک/.test(n))
      s +=
        [
          [104, 84, -14],
          [108, 110, -8],
          [104, 136, -2]
        ]
          .map(
            ([x, y, a]) =>
              `<g transform="rotate(${a} ${x} ${y})">${R(x - 46, y - 11, 88, 22, 10, '#9A4A2C', 'stroke="#5C2612" stroke-width="1"')}${R(x - 40, y - 8, 70, 5, 2.5, '#D58A62', 'opacity=".55"')}${C(x + 44, y, 7, '#F4EEDD', 'stroke="#C9BFA2"')}${C(x + 44, y, 3, '#E2D8BC')}</g>`
          )
          .join('') + herb(70, 150, 30, '#2E7A2E');
    else {
      /* تابه‌ای */ s =
        PD() +
        TD +
        shadow(104, 112, 78, 70, 0.45) +
        C(100, 104, 76, '#2A2D31', 'stroke="#111" stroke-width="2"') +
        C(100, 104, 66, '#383B40') +
        R(150, 98, 46, 12, 6, '#2A2D31') +
        [
          [84, 96],
          [112, 90],
          [100, 118],
          [126, 116],
          [76, 124]
        ]
          .map(
            ([x, y], k) =>
              `<g transform="rotate(${k * 30} ${x} ${y})">${R(x - 15, y - 10, 30, 20, 9, '#B33A2C', 'stroke="#5A130C"')}${R(x - 11, y - 7, 18, 5, 2.5, '#E58B7C', 'opacity=".5"')}</g>`
          )
          .join('') +
        [
          [96, 108],
          [132, 100],
          [74, 108],
          [112, 130]
        ]
          .map(([x, y], k) => C(x, y, 7, k % 2 ? '#C0262D' : '#4C9A2E', 'stroke="#222"'))
          .join('') +
        herb(60, 90, -30, '#4C9A2E');
      return s;
    }
    s +=
      tomato(152, 138) +
      R(52, 134, 22, 14, 4, '#FFF3B8', 'stroke="#E5D27A"') +
      scatter(r, 14, 150, 112, 18, 14, (x, y) => C(x, y, 1.4, '#8E1B24', 'opacity=".8"'));
    return s;
  };
  const pilaf = (d, i, r) => {
    const n = d[0];
    let s = PD() + RD() + plate();
    s += rice(r, 98, 104, 54, 44, /زرشک/.test(n) ? 0.6 : 0.35);
    if (/زرشک/.test(n))
      s +=
        scatter(r, 26, 98, 100, 44, 34, (x, y) =>
          C(x, y, 2.2, '#C1121F', 'stroke="#6E0A12" stroke-width=".5"')
        ) + scatter(r, 10, 98, 100, 40, 30, (x, y) => E(x, y, 2.6, 1.2, '#7FB069'));
    if (/باقالی/.test(n))
      s +=
        scatter(r, 34, 98, 104, 44, 34, (x, y) =>
          E(x, y, 3.4, 2.1, '#6FA04B', 'stroke="#3E6B26" stroke-width=".5"')
        ) + scatter(r, 12, 98, 104, 44, 34, (x, y) => herb(x, y, 20, '#2E7A2E'));
    if (/زرشک/.test(n))
      s += `<g transform="rotate(-18 138 134)">${E(136, 136, 28, 16, '#B4642A', 'stroke="#6A3410" stroke-width="1.2"')}${E(130, 132, 18, 7, '#E9A56B', 'opacity=".6"')}</g>`;
    else
      s += `<g transform="rotate(20 138 138)">${E(136, 138, 30, 17, '#8D4B26', 'stroke="#52280F" stroke-width="1.2"')}${E(130, 134, 18, 6, '#C98A5C', 'opacity=".6"')}${C(158, 150, 6, '#F4EEDD', 'stroke="#C9BFA2"')}</g>`;
    return s + herb(52, 148, -40, '#2E7A2E');
  };
  const stew = (d, i, r) => {
    const c = d[6],
      n = d[0];
    let s = PD() + RD() + plate();
    const pot = /آبگوشت/.test(n);
    if (pot) {
      s =
        PD() +
        RD() +
        shadow(106, 120, 70, 60, 0.4) +
        C(100, 100, 70, '#9A5A32', 'stroke="#5C3016" stroke-width="2"') +
        C(100, 100, 58, '#7A4424') +
        C(100, 100, 50, '#C58B50') +
        scatter(r, 22, 100, 100, 40, 40, (x, y) =>
          E(x, y, 5, 3.5, ['#E9D6A0', '#B5413A', '#F4EEDD', '#8A5A3A'][Math.floor(r() * 4)])
        ) +
        bread(160, 150, 30, 14, -25, '#C8964E') +
        lemon(42, 56, 9);
      return s;
    }
    const rich = /قورمه|فسنجان|عدسی|قلیه/.test(n);
    s += bowl(88, 100, 54, '#EFE6D6', c);
    s += E(88, 100, 44, 44, 'none', 'stroke="' + lt(c, 0.25) + '" stroke-width="3" opacity=".5"');
    if (/قورمه/.test(n))
      s +=
        scatter(r, 40, 88, 100, 42, 42, (x, y) => herb(x, y, r() * 360, '#1F5A28')) +
        scatter(r, 8, 88, 100, 36, 36, (x, y) => C(x, y, 4, '#B33A2C')) +
        C(88, 100, 6, '#4A3418', 'opacity=".8"');
    if (/فسنجان/.test(n))
      s +=
        E(86, 98, 36, 32, '#5E1F2B', 'opacity=".5"') +
        scatter(r, 14, 88, 100, 36, 34, (x, y) => C(x, y, 2.8, '#C9A36A')) +
        `<path d="M62 84q26 -16 52 6" stroke="#A33" stroke-width="3" fill="none" opacity=".55"/>`;
    if (/عدسی/.test(n))
      s +=
        scatter(r, 80, 88, 100, 42, 42, (x, y) =>
          C(x, y, 2.4, ['#C98A3C', '#9A5E24', '#DDA85A'][Math.floor(r() * 3)])
        ) + C(88, 100, 8, '#4A2A10', 'opacity=".6"');
    if (/قلیه/.test(n))
      s +=
        scatter(r, 30, 88, 100, 42, 42, (x, y) => herb(x, y, r() * 360, '#3E6B26')) +
        [
          [76, 94],
          [100, 108]
        ].map(([x, y]) => E(x, y, 14, 5, '#D98A6B', 'stroke="#8A3A22"'));
    s += rice(r, 150, 130, 30, 24, 0.3);
    return s + herb(40, 52, 30, '#2E7A2E') + (/عدسی/.test(n) ? bread(150, 64, 24, 12, 30, '#D9A860') : '');
  };
  const soup = (d, i, r) => {
    const c = d[6],
      n = d[0];
    let s = PD() + defs('sp', lt(c, 0.35), dk(c, 0.2), 0.4, 0.3, 0.9);
    s +=
      shadow(104, 114, 74, 70, 0.45) +
      C(100, 100, 74, '#F4EEE0', 'stroke="#B9AD94" stroke-width="1.5"') +
      C(100, 100, 62, '#E5DCC8') +
      C(100, 100, 56, 'url(#sp)') +
      `<circle cx="100" cy="100" r="56" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="3"/>`;
    s += `<path d="M62 100q38 -34 76 0q-38 30 -76 0" stroke="${lt(c, 0.5)}" stroke-width="2" fill="none" opacity=".55"/>`;
    if (/آش/.test(n))
      s +=
        scatter(r, 36, 100, 100, 48, 48, (x, y) => herb(x, y, r() * 360, '#2E6B26')) +
        scatter(r, 14, 100, 100, 44, 44, (x, y) =>
          C(x, y, 3.2, '#E6C77B', 'stroke="#A98A3C" stroke-width=".6"')
        ) +
        E(100, 100, 18, 10, '#FFF4D2', 'opacity=".9"') +
        `<path d="M84 100q16 8 32 0" stroke="#C98A2A" stroke-width="3" fill="none"/>`;
    else
      s +=
        scatter(r, 26, 100, 100, 46, 46, (x, y) =>
          C(x, y, 3, ['#F2A13A', '#EDE2B8', '#7FB069'][Math.floor(r() * 3)])
        ) + herb(112, 94, 40, '#3C8A3A');
    return s + spoon(160, 120, 30);
  };
  const dip = (d, i, r) => {
    const c = d[6],
      n = d[0];
    let s = PD() + RD() + plate(100, 104, 74, '#EFE3CF');
    s +=
      bowl(96, 100, 46, '#F4EBDD', c) +
      `<path d="M62 98q18 -22 36 -4t34 4" stroke="${lt(c, 0.35)}" stroke-width="3" fill="none" opacity=".7"/>`;
    if (/کشک/.test(n))
      s +=
        E(96, 100, 34, 30, lt('#EDE6D6', 0), 'opacity=".7"') +
        scatter(r, 12, 96, 100, 30, 26, (x, y) => C(x, y, 3, '#B8884A')) +
        `<path d="M70 96q26 12 52 0" stroke="#3E1F4A" stroke-width="5" fill="none" opacity=".7"/>` +
        scatter(r, 10, 96, 100, 26, 22, (x, y) => C(x, y, 2.2, '#7A4A28'));
    if (/میرزا/.test(n))
      s +=
        E(96, 100, 32, 28, '#8A2A1C', 'opacity=".55"') +
        C(96, 98, 7, '#F2C230', 'stroke="#C9941A"') +
        herb(80, 112, 20, '#3C8A3A');
    if (/ماست/.test(n))
      s +=
        E(96, 100, 36, 32, '#F4F1E8') +
        scatter(r, 18, 96, 100, 30, 26, (x, y) => herb(x, y, r() * 360, '#2E7A2E')) +
        `<path d="M70 100q26 10 52 0" stroke="#fff" stroke-width="4" fill="none" opacity=".7"/>`;
    s += bread(150, 150, 24, 13, 24) + bread(48, 150, 22, 12, -20);
    return s + herb(150, 62, 20, '#2E7A2E') + herb(140, 58, -20, '#2E7A2E');
  };
  const kuku = (d, i, r) => {
    let s = PD() + plate(100, 104, 76, '#F1E8D8');
    s +=
      C(100, 102, 54, '#2E7A38', 'stroke="#1B4A22" stroke-width="2"') +
      C(100, 102, 48, '#4A9A44') +
      scatter(r, 60, 100, 102, 46, 46, (x, y) => herb(x, y, r() * 360, r() > 0.5 ? '#2F7A2A' : '#7FC06A')) +
      scatter(r, 14, 100, 102, 44, 44, (x, y) => C(x, y, 2.2, '#C1121F')) +
      scatter(r, 6, 100, 102, 40, 40, (x, y) => C(x, y, 4, '#C9A36A'));
    s += `<path d="M100 50V154M54 102H146M68 70L132 134M132 70L68 134" stroke="#16421C" stroke-width="2.2" opacity=".6"/>`;
    return s + lemon(160, 150, 9) + herb(40, 56, -20, '#2E7A2E');
  };
  const salad = (d, i, r) => {
    let s = PD() + TD + plate(100, 104, 76, '#F1E8D8') + C(100, 102, 56, '#E8F0D8', 'stroke="#B9C99A"');
    s +=
      scatter(
        r,
        12,
        100,
        102,
        38,
        38,
        (x, y) =>
          `<g>${C(x, y, 11, '#A8D08A', 'stroke="#5E9E48" stroke-width="1.4"')}${C(x, y, 7, '#D8EBC0')}${C(x, y, 2.5, '#FBFFF0')}</g>`
      ) +
      scatter(r, 7, 100, 102, 36, 36, (x, y) => tomato(x, y, 9)) +
      scatter(
        r,
        10,
        100,
        102,
        40,
        40,
        (x, y) => `<path d="M${x - 8} ${y}q8 -9 16 0" stroke="#C0396B" stroke-width="2" fill="none"/>`
      );
    return s + lemon(158, 52, 9) + herb(48, 150, 20, '#2E7A2E');
  };
  const baklava = (d, i, r) => {
    const c = d[6];
    let s = PD() + defs('bk', '#E7B25A', '#A8651E', 0.3, 0.2, 1);
    s +=
      shadow(104, 112, 78, 62, 0.4) +
      R(26, 44, 150, 116, 14, '#C9A65A', 'stroke="#6B4A14" stroke-width="2"') +
      R(32, 50, 138, 104, 10, '#E3C57C');
    for (let a = 0; a < 4; a++)
      for (let b = 0; b < 3; b++) {
        const x = 52 + a * 32 + (b % 2) * 0,
          y = 66 + b * 30;
        s += `<g transform="translate(${x} ${y}) rotate(45)">${R(-13, -13, 26, 26, 3, 'url(#bk)', 'stroke="#7A4A14" stroke-width="1.2"')}${R(-9, -9, 18, 5, 2, '#F6D890', 'opacity=".55"')}${C(0, 2, 3.2, '#7FB069')}</g>`;
      }
    return s + scatter(r, 40, 100, 100, 70, 50, (x, y) => C(x, y, 1.2, '#7FB069'));
  };
  const faloodeh = (d, i, r) => {
    let s = PD() + defs('bgf', '#FFE3EC', '#E98AA8');
    s += glass(100, 40, 70, 112, 'url(#bgf)', { fill: 0.92 });
    s += [...Array(14)]
      .map(
        (_, k) =>
          `<path d="M${72 + ((k * 7) % 56)} ${60 + ((k * 11) % 70)}q8 10 0 20t6 20" stroke="#fff" stroke-width="2" fill="none" opacity=".75"/>`
      )
      .join('');
    s +=
      C(100, 52, 14, '#E94B6E', 'opacity=".9"') +
      scatter(r, 9, 100, 56, 26, 8, (x, y) => E(x, y, 4, 2.2, '#C0396B')) +
      `<path d="M120 28l20 -16" stroke="#0F8B8D" stroke-width="3" stroke-linecap="round"/>` +
      spoon(158, 90, 10);
    return s;
  };
  const sholeh = (d, i, r) => {
    let s =
      PD() +
      plate(100, 104, 76, '#EFE3CF') +
      bowl(100, 102, 50, '#F4EBDD', '#F2C230') +
      `<circle cx="100" cy="102" r="36" fill="none" stroke="#C98303" stroke-width="2" opacity=".7"/>`;
    s +=
      [0, 1, 2, 3, 4, 5, 6, 7]
        .map(
          k =>
            `<path d="M100 102L${f1(100 + Math.cos(k * 0.785) * 36)} ${f1(102 + Math.sin(k * 0.785) * 36)}" stroke="#8A4A12" stroke-width="1.8" opacity=".75"/>`
        )
        .join('') +
      C(100, 102, 5, '#8A4A12', 'opacity=".8"') +
      scatter(r, 18, 100, 102, 30, 30, (x, y) =>
        E(x, y, 3, 1.4, '#F7E6B8', 'stroke="#C9A36A" stroke-width=".4"')
      );
    return s + C(100, 102, 56, 'none', 'stroke="#fff" stroke-opacity=".3"');
  };
  const icecream = (d, i, r) => {
    let s =
      PD() +
      shadow(106, 150, 54, 8, 0.45) +
      Pth('M62 100L100 168L138 100z', '#D9A860', 'stroke="#9A6A28" stroke-width="1.5"') +
      `<path d="M70 110l26 50M86 106l20 56M104 106l16 40M122 108l-6 14" stroke="#9A6A28" stroke-width="1.2" opacity=".6"/>`;
    s +=
      C(100, 88, 34, '#F6E7B4', 'stroke="#D9BF72" stroke-width="1.5"') +
      C(100, 62, 27, '#F4E0C0', 'stroke="#D9BF72" stroke-width="1.5"') +
      scatter(r, 22, 100, 78, 34, 34, (x, y) => C(x, y, 2.2, '#7FB069')) +
      C(88, 54, 10, '#fff', 'opacity=".4"') +
      C(100, 36, 7, '#C0392B');
    return s;
  };
  const tea = (d, i, r) => {
    let s =
      PD() +
      shadow(106, 126, 70, 26, 0.4) +
      E(100, 118, 70, 22, '#F4EEE0', 'stroke="#B9AD94"') +
      E(100, 114, 56, 15, '#E5DCC8');
    s += `<path d="M70 66h60l-6 50q-24 10 -48 0z" fill="#fff" opacity=".2" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/><path d="M74 76h52l-5 38q-21 8 -42 0z" fill="#A5461F" opacity=".95"/><path d="M78 80l3 30" stroke="#fff" stroke-opacity=".5" stroke-width="2.5" stroke-linecap="round"/>`;
    s +=
      `<path d="M120 60q6 -10 12 -2" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>` +
      [0, 1, 2]
        .map(
          k =>
            `<g transform="rotate(${-20 + k * 14} ${150} 140)">${R(146, 118 + k * 4, 28, 4, 2, '#F0B94E', 'stroke="#B8801A" stroke-width=".8"')}</g>`
        )
        .join('') +
      `<path d="M86 50q-4 -10 4 -16M104 46q-4 -10 4 -16" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    return s;
  };
  const doogh = (d, i, r) => {
    const c = d[6];
    let s =
      PD() +
      defs('dg', lt(c, 0.5), c) +
      glass(100, 46, 62, 104, 'url(#dg)', { fill: 0.86 }) +
      scatter(r, 14, 100, 100, 18, 40, (x, y) => C(x, y, 2.2, '#fff', 'opacity=".5"'));
    s += herb(94, 44, -15, '#2E8B3A') + herb(108, 44, 25, '#2E8B3A') + herb(100, 40, 5, '#4CA64A');
    if (/سکنجبین/.test(d[0]))
      s +=
        scatter(r, 5, 100, 80, 14, 24, (x, y) =>
          R(x - 7, y - 3, 14, 7, 3, '#E3F2C8', 'stroke="#8FBF5C" opacity=".95"')
        ) + `<path d="M118 36L140 8" stroke="#E94B6E" stroke-width="4" stroke-linecap="round"/>`;
    return s + E(158, 154, 20, 6, '#000', 'opacity=".2"');
  };
  const coffee = (d, i, r) => {
    let s =
      PD() +
      shadow(106, 130, 66, 56, 0.4) +
      C(100, 100, 66, '#F4EEE0', 'stroke="#B9AD94"') +
      C(100, 100, 50, '#E5DCC8') +
      C(96, 98, 36, '#FFF', 'stroke="#C9BFA2"') +
      C(96, 98, 30, '#3A2418') +
      E(94, 94, 20, 12, '#8A5A3A', 'opacity=".6"') +
      C(92, 92, 6, '#C9985F', 'opacity=".6"');
    s +=
      `<path d="M132 98h22a8 8 0 0 1 0 16h-20" stroke="#C9BFA2" stroke-width="5" fill="none"/>` +
      [0, 1, 2]
        .map(k => R(130 + k * 8, 140 - k * 3, 8, 8, 2, '#fff', 'stroke="#C9BFA2" opacity=".95"'))
        .join('') +
      [0, 1, 2, 3]
        .map(
          k =>
            `<g transform="rotate(${k * 40} ${50 + k * 8} 150)">${E(50 + k * 8, 150, 4.5, 3, '#4A2E1F')}<path d="M${46 + k * 8} 150h8" stroke="#2A1810"/></g>`
        )
        .join('');
    return s;
  };
  const eggs = (d, i, r) => {
    const n = d[0];
    let s =
      PD() +
      shadow(104, 114, 78, 72, 0.45) +
      C(100, 102, 76, '#2A2D31', 'stroke="#111" stroke-width="2"') +
      C(100, 102, 66, '#383B40') +
      R(150, 96, 46, 12, 6, '#2A2D31');
    if (/نیمرو/.test(n))
      s += [
        [84, 94],
        [116, 112]
      ]
        .map(
          ([x, y]) =>
            E(x, y, 28, 24, '#fff', 'stroke="#E6E1D4" stroke-width="1"') +
            C(x + 2, y, 11, '#F2A81E', 'stroke="#C9780E"') +
            C(x - 2, y - 4, 4, '#FFE08A', 'opacity=".8"')
        )
        .join('');
    else
      s +=
        E(100, 102, 54, 40, '#F2C230', 'stroke="#C9941A" stroke-width="1.5"') +
        scatter(r, 14, 100, 102, 48, 34, (x, y) => C(x, y, 6, '#C0392B')) +
        scatter(r, 10, 100, 102, 48, 34, (x, y) => herb(x, y, r() * 360, '#2E7A2E'));
    return s + herb(50, 64, 20, '#4CA64A');
  };
  const board = (d, i, r) => {
    let s =
      PD() +
      shadow(104, 112, 80, 64, 0.4) +
      R(24, 42, 152, 120, 16, '#B88A58', 'stroke="#6B4A22" stroke-width="2"') +
      R(30, 48, 140, 108, 12, '#D4A872');
    s +=
      bread(70, 84, 38, 20, -14, '#E3B56E') +
      R(112, 62, 26, 26, 4, '#FFF3C8', 'stroke="#D9BF72"') +
      R(142, 74, 22, 22, 4, '#FFF3C8', 'stroke="#D9BF72"') +
      scatter(r, 8, 80, 130, 28, 14, (x, y) => C(x, y, 7, '#A87848', 'stroke="#6B4A22"')) +
      herb(120, 128, 20, '#2E7A2E') +
      herb(132, 130, -20, '#4CA64A') +
      herb(124, 136, 0, '#3C8A3A') +
      C(150, 134, 12, '#fff', 'opacity=".25"') +
      glass(150, 112, 22, 30, '#A5461F', { fill: 0.8 });
    return s;
  };
  const halim = (d, i, r) => {
    const c = d[6];
    let s = PD() + plate(100, 104, 76, '#EFE3CF') + bowl(100, 102, 52, '#F4EBDD', lt(c, 0.25));
    s +=
      scatter(
        r,
        40,
        100,
        102,
        38,
        38,
        (x, y) =>
          `<path d="M${f1(x)} ${f1(y)}q4 -3 8 0" stroke="${dk(c, 0.1)}" stroke-width="1.6" fill="none" opacity=".6"/>`
      ) +
      E(100, 102, 12, 8, '#F7D86A', 'opacity=".9"') +
      [0, 1, 2, 3]
        .map(
          k =>
            `<path d="M${68 + k * 6} ${76 + k * 6}l${46 - k * 6} 4" stroke="#8A4A12" stroke-width="2" opacity=".6"/>`
        )
        .join('') +
      `<path d="M70 100q30 -16 60 0" stroke="#fff" stroke-width="3" fill="none" opacity=".4"/>`;
    return s + spoon(160, 122, 30) + (/بادمجان/.test(d[0]) ? E(70, 120, 8, 4, '#3E1F4A') : '');
  };
  const fish = (d, i, r) => {
    const n = d[0];
    let s = PD() + plate(100, 104, 76, '#EFE3CF');
    if (/میگو/.test(n) && !/سمبوسه/.test(n)) {
      s +=
        [
          [80, 84, -20],
          [114, 90, 15],
          [92, 124, 5],
          [124, 128, -10],
          [70, 112, 30]
        ]
          .map(
            ([x, y, a]) =>
              `<g transform="rotate(${a} ${x} ${y})"><path d="M${x - 22} ${y}q22 -26 44 0q-6 12 -22 12q-12 0 -22 -12z" fill="#E8704C" stroke="#9A3416" stroke-width="1.2"/>${[0, 1, 2, 3].map(k => `<path d="M${x - 12 + k * 9} ${y - 12 + Math.abs(k - 1.5) * 2}v14" stroke="#B8421E" stroke-width="1.4" opacity=".6"/>`).join('')}<path d="M${x + 22} ${y}l9 -5l-2 10z" fill="#F2A07C"/></g>`
          )
          .join('') +
        scatter(r, 14, 100, 106, 50, 40, (x, y) => C(x, y, 2.4, '#fff', 'opacity=".9"')) +
        lemon(150, 56, 10) +
        herb(52, 54, 0, '#2E7A2E');
      return s;
    }
    if (/سمبوسه/.test(n)) {
      s +=
        [
          [80, 86, -10],
          [118, 96, 14],
          [92, 126, 4],
          [128, 130, -14]
        ]
          .map(
            ([x, y, a]) =>
              `<g transform="rotate(${a} ${x} ${y})"><path d="M${x - 20} ${y + 16}L${x} ${y - 20}L${x + 20} ${y + 16}z" fill="#D9A04A" stroke="#8A5A14" stroke-width="1.4"/><path d="M${x - 10} ${y + 8}L${x} ${y - 10}L${x + 10} ${y + 8}" stroke="#F0CC80" stroke-width="2.4" fill="none" opacity=".8"/></g>`
          )
          .join('') +
        lemon(150, 150, 10) +
        herb(52, 56, 0, '#2E7A2E');
      return s;
    }
    if (/قلیه/.test(n)) {
      s =
        PD() +
        RD() +
        plate() +
        bowl(92, 102, 52, '#EFE6D6', '#A8401A') +
        scatter(r, 30, 92, 102, 40, 40, (x, y) => herb(x, y, r() * 360, '#3E6B26')) +
        E(86, 100, 28, 9, '#E9A06B', 'stroke="#8A3A22"') +
        rice(r, 152, 134, 30, 22, 0.3) +
        lemon(150, 56, 9);
      return s;
    }
    s += `<g transform="rotate(-10 100 100)">${Pth('M30 100q36 -44 90 -14l36 -22v72l-36 -22q-54 28 -90 -14z', '#7A9AAA', 'stroke="#3A5262" stroke-width="1.6"')}${Pth('M34 100q36 -34 86 -10q-52 22 -86 10z', '#C4D6DF', 'opacity=".65"')}${[...Array(6)].map((_, k) => `<path d="M${56 + k * 10} ${84 + (k % 2) * 3}q6 14 0 28" stroke="#3A5262" stroke-width="1" fill="none" opacity=".5"/>`).join('')}${C(48, 94, 3.6, '#fff', 'stroke="#222"')}${C(48, 94, 1.6, '#111')}</g>`;
    return s + lemon(54, 150, 11) + herb(140, 56, 20, '#2E7A2E') + herb(152, 60, -10, '#2E7A2E');
  };
  /* محصولات */
  const jarBody = (x, y, w, h, c, lid = '#C9A23A') =>
    shadow(x + 6, y + h + 2, w * 0.6, 6, 0.4) +
    R(x - w / 2, y, w, h, 14, 'url(#jr)', 'stroke="#fff" stroke-opacity=".5" stroke-width="1.4"') +
    R(x - w / 2 + 5, y + 4, 7, h - 8, 3, '#fff', 'opacity=".28"') +
    R(x - w / 2 - 2, y - 14, w + 4, 18, 5, lid, 'stroke="' + dk(lid, 0.3) + '" stroke-width="1"') +
    R(x - w / 2 + 2, y - 11, w - 4, 4, 2, lt(lid, 0.45), 'opacity=".7"');
  const jar = (d, i, r) => {
    const c = d[6],
      n = d[0];
    let s = PD() + defs('jr', lt(c, 0.25), c, 0.3, 0.3, 1) + defs('lb', '#FFF8E6', '#E9D9AD');
    if (/عسل/.test(n)) {
      s +=
        jarBody(100, 52, 84, 100, c, '#B8881A') +
        R(66, 86, 68, 40, 6, 'url(#lb)', 'stroke="#B8881A"') +
        `<path d="M76 100h48M80 110h40" stroke="#8A5A14" stroke-width="2" opacity=".7"/>` +
        C(100, 78, 3, '#8A5A14') +
        E(100, 160, 6, 26, 'none') +
        `<path d="M150 70v70" stroke="#C9A23A" stroke-width="6" stroke-linecap="round"/><ellipse cx="150" cy="150" rx="12" ry="5" fill="${lt(c, 0.2)}"/>`;
      return s;
    }
    if (/شیره|ارده/.test(n)) {
      s +=
        jarBody(100, 56, 80, 94, c, '#4A2E1F') +
        R(66, 88, 68, 38, 6, 'url(#lb)') +
        `<path d="M76 102h48M82 112h36" stroke="#4A2E1F" stroke-width="2" opacity=".6"/>` +
        herb(150, 130, 20, '#4CA64A');
      if (/ارده/.test(n)) s += scatter(r, 20, 150, 150, 18, 8, (x, y) => E(x, y, 2.6, 1.4, '#F4E6C0'));
      return s;
    }
    if (/ترشی/.test(n)) {
      s +=
        jarBody(100, 52, 84, 104, '#9CB76A', '#6E7A2A') +
        scatter(
          r,
          14,
          100,
          110,
          28,
          36,
          (x, y) =>
            `<g transform="rotate(${r() * 180} ${x} ${y})">${E(x, y, 9, 4.5, ['#3E6B26', '#7FB069', '#C0392B', '#6B4A8A'][Math.floor(r() * 4)])}</g>`
        ) +
        R(66, 84, 68, 34, 6, 'url(#lb)', 'opacity=".95"') +
        `<path d="M76 98h48" stroke="#4A6A1A" stroke-width="2"/>`;
      return s;
    }
    if (/مربا/.test(n)) {
      s +=
        jarBody(100, 54, 84, 98, '#F08A24', '#B8433A') +
        scatter(r, 14, 100, 110, 28, 34, (x, y) => C(x, y, 4, '#F6B25A', 'opacity=".9"')) +
        scatter(r, 12, 100, 110, 28, 34, (x, y) => C(x, y, 2, '#7FB069')) +
        R(66, 84, 68, 34, 6, 'url(#lb)') +
        `<path d="M76 98h48" stroke="#B8433A" stroke-width="2"/>`;
      return s;
    }
    /* بطری: گلاب، شربت، عرق */
    const bottle = (x, h, col, lb) =>
      shadow(x + 5, 168, 22, 5, 0.4) +
      R(x - 7, 36 + (150 - h), 14, 24, 4, 'url(#jr)') +
      R(
        x - 21,
        56 + (150 - h),
        42,
        h - 24,
        14,
        'url(#jr)',
        'stroke="#fff" stroke-opacity=".55" stroke-width="1.4"'
      ) +
      R(x - 10, 28 + (150 - h), 20, 12, 3, lb, 'stroke="' + dk(lb, 0.3) + '"') +
      R(x - 15, 52 + (150 - h), 7, h - 32, 3, '#fff', 'opacity=".3"') +
      R(x - 19, 84 + (150 - h), 38, 34, 4, 'url(#lb)', 'opacity=".95"') +
      `<path d="M${x - 12} ${98 + (150 - h)}h24" stroke="${col}" stroke-width="2.4"/><path d="M${x - 9} ${106 + (150 - h)}h18" stroke="${col}" stroke-width="1.6" opacity=".6"/>`;
    if (/عرق|بهار|گلاب/.test(n) && /عرق/.test(n))
      return (
        s +
        bottle(56, 110, c, '#4A8A5A') +
        bottle(100, 128, c, '#4A8A5A') +
        bottle(146, 110, c, '#4A8A5A') +
        herb(34, 156, 10, c) +
        herb(168, 156, -10, c)
      );
    if (/گلاب/.test(n))
      return (
        s +
        bottle(100, 132, c, '#C0396B') +
        scatter(r, 6, 100, 160, 56, 6, (x, y) => C(x, y, 7, '#E9759A', 'stroke="#B8416B"')) +
        herb(50, 150, -30, '#3C8A3A')
      );
    return (
      s +
      bottle(100, 130, c, '#C98A2A') +
      scatter(r, 5, 100, 160, 54, 6, (x, y) => C(x, y, 6, '#F6B25A', 'stroke="#D9892A"')) +
      herb(48, 150, -30, '#3C8A3A')
    );
  };
  const spice = (d, i, r) => {
    const c = d[6],
      n = d[0];
    let s = PD() + defs('kf', '#D9B48A', '#9A7648');
    if (/زعفران/.test(n)) {
      s +=
        shadow(100, 150, 70, 14, 0.35) +
        E(100, 140, 66, 20, '#E8DCC4', 'stroke="#B9AD94"') +
        E(100, 136, 54, 13, '#F4EEE0') +
        scatter(
          r,
          70,
          100,
          134,
          40,
          8,
          (x, y, r2) =>
            `<path d="M${f1(x)} ${f1(y)}q${f1(r2() * 10 - 5)} ${f1(-r2() * 6)} ${f1(r2() * 16 - 8)} ${f1(r2() * 4 - 2)}" stroke="#C1121F" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
        ) +
        `<rect x="78" y="34" width="44" height="72" rx="6" fill="#fff" opacity=".2" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>` +
        R(80, 36, 40, 12, 3, '#B8881A') +
        scatter(
          r,
          40,
          100,
          82,
          14,
          26,
          (x, y, r2) =>
            `<path d="M${f1(x)} ${f1(y)}l${f1(r2() * 6 - 3)} ${f1(r2() * 8)}" stroke="#C1121F" stroke-width="2" stroke-linecap="round"/>`
        ) +
        R(84, 56, 32, 22, 3, '#FFF8E6', 'opacity=".95"') +
        `<path d="M88 64h24M88 70h16" stroke="#B8881A" stroke-width="1.6"/>`;
      return s;
    }
    if (/سماق|زرشک|نمک/.test(n)) {
      const col = /نمک/.test(n) ? '#EDEFF2' : c;
      s += bowl(100, 102, 58, '#EFE6D6', dk(col, 0.1));
      s += /زرشک/.test(n)
        ? scatter(r, 90, 100, 102, 44, 44, (x, y) =>
            E(x, y, 3.2, 1.8, '#D0182C', 'stroke="#7A0A18" stroke-width=".4"')
          )
        : scatter(r, 120, 100, 102, 46, 46, (x, y) =>
            C(
              x,
              y,
              /نمک/.test(n) ? 2.4 : 1.4,
              /نمک/.test(n) ? '#fff' : r() > 0.5 ? '#A33' : '#7A1A2A',
              /نمک/.test(n) ? 'stroke="#B8C0CC" stroke-width=".5"' : ''
            )
          );
      if (/سماق/.test(n))
        s += scatter(r, 8, 100, 102, 34, 34, (x, y) => C(x, y, 5, '#C0396B', 'opacity=".8"'));
      s +=
        `<path d="M60 90q40 -26 80 0" stroke="#fff" stroke-width="3" fill="none" opacity=".3"/>` +
        R(140, 142, 36, 4, 2, '#B9BEC4') +
        E(176, 144, 8, 6, '#D6DADF');
      return s;
    }
    /* مخلوط ادویه: پاکت */
    s +=
      shadow(104, 168, 56, 8, 0.4) +
      Pth('M56 54h88l6 112H50z', 'url(#kf)', 'stroke="#6B4A22" stroke-width="1.6"') +
      R(52, 44, 96, 14, 3, '#B8946A', 'stroke="#6B4A22"') +
      `<path d="M56 54h88" stroke="#fff" stroke-opacity=".4"/>` +
      R(64, 82, 72, 56, 6, '#FFF8E6', 'stroke="#B8946A"') +
      C(100, 100, 12, c) +
      `<path d="M76 122h48M82 130h36" stroke="${dk(c, 0.1)}" stroke-width="2.2"/>`;
    return s + scatter(r, 40, 100, 160, 36, 8, (x, y) => C(x, y, 2, c)) + herb(152, 150, 30, '#3C8A3A');
  };
  const sweets = (d, i, r) => {
    const c = d[6],
      n = d[0];
    let s = PD();
    if (/نبات/.test(n)) {
      s += shadow(104, 150, 66, 10, 0.35);
      s +=
        [0, 1, 2, 3, 4]
          .map(
            k =>
              `<g transform="rotate(${-30 + k * 12} 100 150)">${R(96, 28 + k * 4, 8, 118, 4, '#E5C98A', 'stroke="#B8944A" stroke-width=".8"')}${[...Array(5)].map((_, j) => R(88, 34 + k * 4 + j * 10, 24, 9, 3, '#F6C94A', 'stroke="#C9941A" opacity=".95"')).join('')}</g>`
          )
          .join('') +
        scatter(r, 12, 100, 156, 52, 6, (x, y) => R(x - 6, y - 4, 12, 8, 3, '#F6C94A', 'stroke="#C9941A"'));
      return s;
    }
    if (/حلوا/.test(n)) {
      s +=
        plate(100, 104, 76, '#EFE3CF') +
        C(100, 102, 46, '#8A5A2A', 'stroke="#52330F" stroke-width="2"') +
        C(100, 102, 40, 'url(#hl)') +
        defs('hl', '#D9A860', '#9A6A32') +
        [0, 1, 2, 3, 4, 5]
          .map(
            k =>
              `<path d="M100 102L${f1(100 + Math.cos(k * 1.047) * 38)} ${f1(102 + Math.sin(k * 1.047) * 38)}" stroke="#6A4020" stroke-width="2" opacity=".5"/>`
          )
          .join('') +
        scatter(r, 20, 100, 102, 30, 30, (x, y) => E(x, y, 3, 1.6, '#7FB069')) +
        C(100, 102, 6, '#52330F');
      return s;
    }
    if (/باقلوا/.test(n)) {
      s +=
        defs('bk', '#E7B25A', '#A8651E', 0.3, 0.2, 1) +
        shadow(104, 112, 76, 60, 0.4) +
        R(30, 48, 142, 108, 14, '#7A4A2A', 'stroke="#3E2410" stroke-width="2"') +
        R(36, 54, 130, 96, 10, '#E3C57C') +
        [0, 1, 2, 3]
          .flatMap(a =>
            [0, 1, 2].map(
              b =>
                `<g transform="translate(${56 + a * 30} ${72 + b * 28}) rotate(45)">${R(-12, -12, 24, 24, 3, 'url(#bk)', 'stroke="#7A4A14" stroke-width="1.2"')}${C(0, 1, 3, '#7FB069')}</g>`
            )
          )
          .join('') +
        R(22, 138, 156, 20, 6, '#0F8B8D', 'stroke="#0A5A5C"') +
        `<path d="M34 148h132" stroke="#F2B134" stroke-width="2" stroke-dasharray="6 5"/>`;
      return s;
    }
    if (/سوهان/.test(n)) {
      s +=
        plate(100, 104, 76, '#EFE3CF') +
        [
          [78, 86],
          [122, 86],
          [100, 122],
          [58, 122],
          [142, 122]
        ]
          .map(
            ([x, y]) =>
              C(x + 1, y + 3, 19, '#000', 'opacity=".25"') +
              C(x, y, 19, '#D9A860', 'stroke="#9A6A28" stroke-width="1.2"') +
              C(x, y, 14, '#E8BE78') +
              scatter(r, 5, x, y, 11, 11, (px, py) => C(px, py, 2.2, '#7FB069')) +
              C(x - 4, y - 5, 5, '#fff', 'opacity=".3"')
          )
          .join('');
      return s;
    }
    /* گز */
    s +=
      plate(100, 104, 76, '#EFE3CF') +
      [
        [72, 76, -12],
        [118, 70, 8],
        [76, 112, 6],
        [120, 108, -8],
        [98, 144, 3]
      ]
        .map(
          ([x, y, a]) =>
            `<g transform="rotate(${a} ${x} ${y})">${R(x - 24, y - 12, 48, 24, 7, '#F4E4C4', 'stroke="#C9A36A" stroke-width="1.2"')}${scatter(r, 6, x, y, 18, 8, (px, py) => E(px, py, 4, 2.4, '#8DA64F', 'stroke="#4A5E1A" stroke-width=".5"'))}${R(x - 22, y - 10, 30, 5, 2.5, '#fff', 'opacity=".5"')}</g>`
        )
        .join('');
    return s;
  };
  const tea2 = (d, i, r) => {
    const c = d[6],
      n = d[0];
    let s = PD() + defs('tn', lt(c, 0.3), dk(c, 0.3), 0.3, 0.3, 1);
    if (/قهوه/.test(n)) {
      s +=
        shadow(104, 166, 54, 8, 0.4) +
        Pth('M58 60h84l8 104H50z', '#3A2418', 'stroke="#1C100A" stroke-width="1.6"') +
        R(54, 50, 92, 14, 4, '#5E3A22') +
        R(66, 90, 68, 50, 6, '#F1E3C8') +
        C(100, 110, 11, '#4A2E1F') +
        `<path d="M76 128h48" stroke="#4A2E1F" stroke-width="2"/>` +
        scatter(
          r,
          26,
          100,
          160,
          56,
          8,
          (x, y) =>
            `<g transform="rotate(${r() * 180} ${x} ${y})">${E(x, y, 4.5, 3, '#4A2E1F')}<path d="M${x - 3} ${y}h6" stroke="#1C100A" stroke-width=".8"/></g>`
        );
      return s;
    }
    if (/چای ممتاز/.test(n)) {
      s +=
        shadow(104, 166, 54, 8, 0.4) +
        R(54, 54, 92, 110, 12, 'url(#tn)', 'stroke="' + dk(c, 0.5) + '" stroke-width="1.6"') +
        R(50, 44, 100, 16, 5, '#C9A23A', 'stroke="#8A6A14"') +
        R(62, 84, 76, 52, 6, '#FFF8E6', 'stroke="#C9A23A"') +
        `<path d="M74 100q26 -14 52 0M78 112h44M84 122h32" stroke="#2F6B3B" stroke-width="2.4" fill="none"/>` +
        [0, 1, 2, 3].map(k => herb(76 + k * 16, 156, -20 + k * 14, '#4CA64A')).join('');
      return s;
    }
    /* دمنوش: گل خشک */
    s +=
      plate(100, 104, 76, '#EFE3CF') +
      scatter(r, /محمدی/.test(n) ? 18 : 40, 100, 102, 50, 46, (x, y, r2) =>
        /محمدی/.test(n)
          ? `<g transform="rotate(${r2() * 360} ${x} ${y})">${C(x, y, 8, '#B8325F')}${C(x, y, 5, '#D9588A')}${C(x, y, 2.4, '#8A1E44')}</g>`
          : `<g transform="rotate(${r2() * 360} ${x} ${y})">${E(x, y, 7, 3, c, 'opacity=".9"')}${E(x, y, 2.4, 2.4, '#F2C230')}</g>`
      );
    return s + glass(150, 42, 28, 44, '#C98A3A', { fill: 0.8 }) + herb(52, 54, -30, '#3C8A3A');
  };
  const nuts = (d, i, r) => {
    const c = d[6],
      n = d[0];
    let s = PD() + bowl(100, 102, 62, '#EFE6D6', dk('#6B4A22', 0.1));
    if (/پسته/.test(n))
      s += scatter(
        r,
        46,
        100,
        102,
        46,
        46,
        (x, y, r2) =>
          `<g transform="rotate(${r2() * 360} ${x} ${y})">${E(x, y, 7, 4.6, '#E7D7A8', 'stroke="#A8944A" stroke-width=".8"')}${E(x + 1, y, 3.8, 2.6, '#8DA64F')}<path d="M${x - 5} ${y}h10" stroke="#A8944A" stroke-width=".6"/></g>`
      );
    if (/بادام/.test(n))
      s += scatter(
        r,
        36,
        100,
        102,
        46,
        46,
        (x, y, r2) =>
          `<g transform="rotate(${r2() * 360} ${x} ${y})">${Pth(`M${x - 8} ${y}q8 -9 16 0q-8 9 -16 0z`, '#C49A6C', 'stroke="#7A5428" stroke-width=".9"')}<path d="M${x - 5} ${y}h10" stroke="#7A5428" stroke-width=".6" opacity=".7"/></g>`
      );
    if (/خرما/.test(n))
      s += scatter(
        r,
        22,
        100,
        102,
        44,
        44,
        (x, y, r2) =>
          `<g transform="rotate(${r2() * 360} ${x} ${y})">${E(x, y, 10, 6.4, '#6B3A2A', 'stroke="#3A1A10" stroke-width="1"')}${E(x - 2, y - 2, 5, 2, '#B87A5A', 'opacity=".7"')}</g>`
      );
    if (/گردو/.test(n))
      s += scatter(
        r,
        20,
        100,
        102,
        44,
        44,
        (x, y, r2) =>
          `<g transform="rotate(${r2() * 360} ${x} ${y})">${C(x - 4, y, 7, '#C79A62', 'stroke="#7A5428" stroke-width=".9"')}${C(x + 4, y + 1, 7, '#D9B07A', 'stroke="#7A5428" stroke-width=".9"')}<path d="M${x - 5} ${y - 3}q5 6 0 8M${x + 3} ${y - 3}q5 6 0 8" stroke="#7A5428" stroke-width=".8" fill="none"/></g>`
      );
    return s + `<path d="M56 90q44 -34 88 0" stroke="#fff" stroke-width="3" fill="none" opacity=".25"/>`;
  };
  const grain = (d, i, r) => {
    const c = d[6],
      n = d[0];
    let s = PD() + defs('bg2', '#F1E3C8', '#C9B48A');
    if (/برنج/.test(n)) {
      s +=
        shadow(104, 166, 54, 8, 0.4) +
        Pth('M56 52h88l6 114H50z', 'url(#bg2)', 'stroke="#8A7440" stroke-width="1.6"') +
        R(52, 44, 96, 14, 3, '#C9B48A', 'stroke="#8A7440"') +
        R(64, 76, 72, 56, 6, '#fff', 'stroke="#C9B48A"') +
        `<path d="M76 92h48M76 102h36" stroke="${c === '#CFC18A' ? '#5A7A2A' : '#3A3A2A'}" stroke-width="3" stroke-linecap="round"/>` +
        `<path d="M74 118q26 -10 52 0" stroke="#C9B48A" stroke-width="2" fill="none"/>` +
        scatter(
          r,
          60,
          100,
          160,
          42,
          8,
          (x, y, r2) =>
            `<path d="M${f1(x)} ${f1(y)}l${f1(r2() * 6 - 3)} ${f1(r2() * 2)}" stroke="${/سیاه/.test(n) ? '#6A5A38' : '#fff'}" stroke-width="1.6" stroke-linecap="round"/>`
        );
      return s;
    }
    s += bowl(100, 102, 62, '#EFE6D6', dk(c, 0.35));
    const shape = /نخود/.test(n)
      ? (x, y) => C(x, y, 3.4, lt(c, 0.2), 'stroke="' + dk(c, 0.3) + '" stroke-width=".6"')
      : /لوبیا/.test(n)
        ? (x, y, r2) =>
            `<g transform="rotate(${r2() * 180} ${x} ${y})">${E(x, y, 4.4, 2.6, '#E3C7A0', 'stroke="#8A4A24" stroke-width=".7"')}${E(x + 1, y, 2.2, 1.4, '#B5541C', 'opacity=".8"')}</g>`
        : (x, y) => C(x, y, 2.8, lt(c, 0.1), 'stroke="' + dk(c, 0.3) + '" stroke-width=".5"');
    s += scatter(r, /لوبیا/.test(n) ? 80 : 130, 100, 102, 50, 50, shape);
    return s + `<path d="M56 88q44 -34 88 0" stroke="#fff" stroke-width="3" fill="none" opacity=".25"/>`;
  };
  const gearWare = (d, i, r) => {
    const c = d[6],
      n = d[0];
    let s = PD();
    if (/دیگ سنگی/.test(n)) {
      s +=
        shadow(104, 120, 70, 60, 0.45) +
        C(100, 100, 66, '#4A4C50', 'stroke="#222" stroke-width="2"') +
        C(100, 100, 56, '#2C2E32') +
        C(100, 100, 46, '#5C5E63') +
        E(86, 82, 30, 14, '#fff', 'opacity=".12"') +
        R(160, 92, 34, 12, 6, '#B87333', 'stroke="#7A4A18"') +
        R(8, 92, 34, 12, 6, '#B87333', 'stroke="#7A4A18"') +
        C(100, 100, 8, '#B87333', 'stroke="#7A4A18"');
      return s;
    }
    if (/سینی/.test(n)) {
      s +=
        shadow(104, 120, 74, 66, 0.45) +
        C(100, 100, 72, '#B87333', 'stroke="#6A3E12" stroke-width="2"') +
        C(100, 100, 64, 'url(#cu)') +
        defs('cu', '#E6A25E', '#A8602A', 0.35, 0.3, 0.9) +
        [58, 46, 32, 18]
          .map((rr, k) =>
            C(100, 100, rr, 'none', `stroke="#6A3E12" stroke-width="${k % 2 ? 1 : 2}" opacity=".6"`)
          )
          .join('') +
        [...Array(12)]
          .map(
            (_, k) =>
              `<path d="M100 100L${f1(100 + Math.cos(k * 0.5236) * 60)} ${f1(100 + Math.sin(k * 0.5236) * 60)}" stroke="#6A3E12" stroke-width="1" opacity=".4"/>`
          )
          .join('') +
        C(100, 100, 7, '#E6A25E', 'stroke="#6A3E12"') +
        E(76, 72, 30, 14, '#fff', 'opacity=".2"');
      return s;
    }
    if (/ترمه/.test(n)) {
      s +=
        shadow(104, 116, 80, 66, 0.4) +
        R(26, 40, 150, 120, 6, '#8E2F3A', 'stroke="#52141C" stroke-width="2"') +
        R(36, 50, 130, 100, 3, '#B8434F', 'stroke="#F2B134" stroke-width="2"') +
        [
          [70, 80],
          [130, 80],
          [70, 122],
          [130, 122],
          [100, 101]
        ]
          .map(
            ([x, y]) =>
              `<g transform="translate(${x} ${y})">${Pth('M0 -16q16 4 12 18q-4 12 -14 14q-10 -12 -6 -22q2 -6 8 -10z', '#F2B134', 'stroke="#8A5A14" stroke-width="1"')}${Pth('M0 -8q8 2 6 10q-2 6 -7 7q-5 -6 -3 -11q1 -3 4 -6z', '#2F8A8A')}</g>`
          )
          .join('') +
        [...Array(10)].map((_, k) => R(32 + k * 14.4, 154, 6, 14, 2, '#F2B134')).join('');
      return s;
    }
    if (/پک/.test(n)) {
      s +=
        shadow(104, 168, 66, 8, 0.4) +
        R(40, 70, 120, 88, 6, '#1F4E5F', 'stroke="#0B2A35" stroke-width="2"') +
        R(34, 54, 132, 24, 5, '#2A6A80', 'stroke="#0B2A35"') +
        R(94, 54, 14, 104, 0, '#F2B134') +
        `<path d="M100 54q-30 -26 -34 -4q-2 14 34 4zM100 54q30 -26 34 -4q2 14 -34 4z" fill="#F2B134" stroke="#8A5A14" stroke-width="1.2"/>` +
        C(100, 54, 5, '#C98303') +
        `<path d="M50 98h36M114 98h36M50 110h26" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>`;
      return s;
    }
    /* کارت هدیه */
    s +=
      shadow(104, 130, 76, 10, 0.4) +
      `<g transform="rotate(-8 100 100)">${R(28, 56, 144, 92, 12, 'url(#gc)', 'stroke="#000" stroke-opacity=".5"')}${defs('gc', '#3A3D45', '#1A1B20')}${R(28, 76, 144, 14, 0, '#F2B134')}${R(42, 100, 28, 22, 4, '#E8C468', 'stroke="#8A5A14"')}<path d="M42 111h28M56 100v22" stroke="#8A5A14" stroke-width="1"/>${C(138, 118, 12, '#F2B134', 'opacity=".9"')}${C(150, 118, 12, '#0E8F8B', 'opacity=".9"')}<path d="M82 112h24M82 122h40" stroke="#fff" stroke-opacity=".5" stroke-width="2.4" stroke-linecap="round"/></g>`;
    return s;
  };

  const pick = (d, i) => {
    const n = d[0],
      k = d[1]; // k = دسته (شماره بعد از بازچینی)
    if (/کباب|برگ مخصوص|شیشلیک|جوجه/.test(n) && k === 1) return kebab;
    if (/پلو/.test(n)) return pilaf;
    if (/آبگوشت|قورمه|فسنجان|عدسی/.test(n) && !/عدس درجه/.test(n)) return stew;
    if (/آش|سوپ|شوربا/.test(n)) return soup;
    if (/کوکو/.test(n)) return kuku;
    if (/سالاد/.test(n)) return salad;
    if (/کشک|میرزا|ماست/.test(n)) return dip;
    if (/باقلوا/.test(n) && k === 3) return baklava;
    if (/فالوده/.test(n)) return faloodeh;
    if (/شله/.test(n)) return sholeh;
    if (/بستنی/.test(n)) return icecream;
    if (/^چای و نبات/.test(n)) return tea;
    if (/دوغ|شربت سکنجبین/.test(n)) return doogh;
    if (/^قهوه ترک$/.test(n)) return coffee;
    if (/نیمرو|املت/.test(n)) return eggs;
    if (/نان و پنیر|کله/.test(n)) return board;
    if (/حلیم/.test(n)) return halim;
    if (/قزل|میگو|قلیه|سمبوسه/.test(n)) return fish;
    if (/عسل|شیره|ارده|ترشی|مربا|گلاب|سکنجبین خانگی|بهارنارنج|عرق/.test(n) && !/بهارنارنج خشک/.test(n))
      return jar;
    if (/زعفران|ادویه|سماق|زرشک پفکی|نمک/.test(n)) return spice;
    if (/نبات|حلوا|باقلوا|سوهان|گز/.test(n)) return sweets;
    if (/چای ممتاز|دمنوش|گل محمدی|قهوه ترک دست|بهارنارنج خشک/.test(n)) return tea2;
    if (/پسته|بادام|خرما|گردو/.test(n)) return nuts;
    if (/برنج|عدس|لوبیا|نخود/.test(n)) return grain;
    if (/دیگ سنگی|سینی|ترمه|پک|کارت/.test(n)) return gearWare;
    return k >= 8 ? spice : stew;
  };
  const cache = {};
  return (menu, i) => {
    if (cache[i]) return cache[i];
    const d = menu[i],
      c = d[6],
      r = rng(i * 7 + 13),
      fn = pick(d, i);
    const bg = `<defs><filter id="bl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter><filter id="bl2"><feGaussianBlur stdDeviation="7"/></filter>${defs('bgd', lt(c, 0.34), dk(c, 0.62), 0.35, 0.25, 0.95)}</defs><rect width="200" height="200" fill="url(#bgd)"/><circle cx="40" cy="30" r="90" fill="#fff" opacity=".07"/>`;
    let body;
    try {
      body = fn(d, i, r);
    } catch (e) {
      body = '';
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${bg}${body}</svg>`;
    return (cache[i] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
  };
})();
