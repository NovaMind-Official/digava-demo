/**
 * بخش‌های صفحه‌ی اصلی: سفره، کریدور، سرآشپز، ست‌ها
 */
'use strict';

const corSet = () => {
  const s = $('#cor'),
    t = $('#ctrack');
  if (!s || !t || innerWidth < 800) return;
  corMax = Math.max(0, t.scrollWidth - s.clientWidth);
  s.style.height = VH() + corMax + 'px';
  corUpd();
};
const corUpd = () => {
  const s = $('#cor'),
    t = $('#ctrack');
  if (!s || !t || innerWidth < 800) return;
  const r = s.getBoundingClientRect(),
    p = Math.min(1, Math.max(0, -r.top / Math.max(1, s.offsetHeight - VH())));
  t.style.transform = `translateX(${p * corMax}px)`;
};
const sofreh = () => {
  const ids = [
    'چلوکباب کوبیده',
    'قورمه‌سبزی',
    'کوکو سبزی',
    'بستنی سنتی',
    'کشک بادمجان',
    'باقلوا',
        'زرشک‌پلو با مرغ'
  ].map(n => menu.findIndex(d => d[0] === n)).filter(i => i >= 0);
  return `<div class="sofreh"><div class="cloth"><div class="mid"><svg viewBox="0 0 100 100"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="22" y="22" width="56" height="56"/><rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="12"/></g></svg><b>سفره‌ی دیگ‌آوا</b><span>روی هر غذا بزن</span></div>${ids.map((i, k) => `<div class="pl${k >= 1 && k <= 3 ? ' sr' : k >= 5 ? ' sl2' : ''}" tabindex="0" style="--a:${k * 45}deg;--c:${menu[i][6]}">${img(i)}<div class="bub"><b>${menu[i][0]}</b><span>${money(menu[i][2])}</span><span class="bb"><button data-act="add" data-i="${i}" data-d="1">+ افزودن</button><button data-act="open" data-i="${i}">جزئیات</button></span></div></div>`).join('')}</div></div>`;
};
const corridor = () =>
  `<section class="cor" id="cor"><div class="cor-sticky"><h2>در بازار قدم بزنید</h2><div class="cor-track" id="ctrack">${cats
    .map((c, k) => {
      const its = menu
        .map((_, i) => i)
        .filter(i => menu[i][1] === k)
        .slice(0, 3);
      return `<div class="booth" style="--c:${CC[k]}"><div class="bh"><b>${c}</b><span>${fa(menu.filter(d => d[1] === k).length)} مورد</span></div><div class="bi">${its.map(i => `<button data-act="open" data-i="${i}" title="${menu[i][0]}">${img(i)}</button>`).join('')}</div><button class="btn sm" data-act="catgo" data-v="${k}">ورود به غرفه</button></div>`;
    })
    .join('')}</div></div></section>`;
const chefHtml = () => {
  const pool = menu.map((_, i) => i).filter(i => menu[i][1] === 1 || menu[i][1] === 2),
    i = pool[Math.floor(Date.now() / 864e5) % pool.length],
    d = menu[i];
  return `<section class="chef" style="--c:${d[6]}"><div class="wrap two"><div class="cimg rev">${img(i)}</div><div class="rev"><p class="kick">غذای روز شیف</p><h2>${d[0]}</h2><p class="story">${d[0]} را هر روز صبح از ساعت هشت روی حرارت ملایم آماده می‌کنیم؛ طعم اصلی‌اش از ${d[7].split('،').slice(0, 3).join('، ')} می‌آید. تعداد پرس‌ها محدود است و با تمام شدنش، تا فردا خبری نیست.</p><div class="cd" id="cdn"></div><div class="capw"><span id="cap"></span><div class="capb"><i id="capb"></i></div></div><p><button class="btn" data-act="add" data-i="${i}" data-d="1">افزودن به سبد، ${money(d[2])}</button> <button class="btn ghost" data-act="open" data-i="${i}">جزئیات</button></p></div></div></section>`;
};
const comboSec = () =>
  W(
    `<h2>ست‌های پیشنهادی</h2><div class="combos">${combos
      .map(
        (c, k) =>
          `<article class="combo rev"><span class="off">٪${fa(c[3])} تخفیف</span><h3>${c[0]}</h3><p class="muted">${c[1]}</p><ul class="ing">${comboItems(
            k
          )
            .map(([i, q]) => `<li>${menu[i][0]} × ${fa(q)}</li>`)
            .join(
              ''
            )}</ul><div class="pr"><span><s>${money(comboRaw(k))}</s><br><b>${money(comboPrice(k))}</b></span><button class="btn sm" data-act="addk" data-k="c${k}" data-d="1">افزودن ست</button></div></article>`
      )
      .join('')}</div>`
  );
