/**
 * کارت غذا و اجزای تکرارشونده
 */
'use strict';

// عکس غذا: dish-01.jpg تا dish-25.jpg (اگر فایل نباشد، جای‌نگهدار نمایش داده می‌شود)
const img = i =>
  `<span class="ph" style="--c:${menu[i][6]}"><img loading="lazy" src="${photos[i] || `dish-${String(i + 1).padStart(2, '0')}.jpg`}" alt="${menu[i][0]}" onerror="this.onerror=null;window.dishArtFor?this.src=window.dishArtFor(${i}):this.remove()"></span>`;
const ctl = i =>
  cart[i]
    ? `<span class="step"><button data-act="add" data-i="${i}" data-d="-1" aria-label="کم کردن">−</button><b>${fa(cart[i])}</b><button data-act="add" data-i="${i}" data-d="1" aria-label="زیاد کردن">+</button></span>`
    : `<button class="btn sm" data-act="add" data-i="${i}" data-d="1">افزودن</button>`;
const badge = d =>
  d[1] >= NF
    ? 'محصول'
    : d[9] > 300
      ? 'پرفروش'
      : d[4].includes('s')
        ? 'تند'
        : d[4].includes('v')
          ? 'گیاهی'
          : '';
const meters = d =>
  d[1] >= NF
    ? [
        ['امتیاز', (d[8] - 4) * 100],
        ['محبوبیت', Math.min(100, d[9] / 5.4)]
      ]
    : [
        ['تندی', d[4].includes('s') ? 85 : 15],
        ['زمان', Math.min(100, d[12] / 0.6)],
        ['انرژی', Math.min(100, d[14] / 9)]
      ];
// کنترل افزودن: موردهای دارای گزینه (اندازه و افزودنی) به‌جای افزودن مستقیم، برگه‌ی انتخاب را باز می‌کنند
const cctl = i =>
  grpOf(i) ? `<button class="btn sm" data-act="quick" data-i="${i}">افزودن</button>` : ctl(i);
const card = i => {
  const d = menu[i],
    b = badge(d);
  return `<article class="card rev" data-foil><div class="cm"><button class="open" data-act="quick" data-i="${i}" aria-label="جزئیات ${d[0]}">${img(i)}</button>${b ? `<span class="bdg">${b}</span>` : ''}</div><div class="cb"><h3>${d[0]}</h3><div class="pr"><b>${fa(d[2] * 1000)}<small>تومان</small></b><span data-ci="${i}">${cctl(i)}</span></div></div></article>`;
};
const quote = r =>
  `<blockquote><p>${esc(r.t)}</p><footer><b>${esc(r.n)}</b><span>${menu[r.d][0]}</span><span class="stars">${stars(r.s)}</span></footer></blockquote>`;
