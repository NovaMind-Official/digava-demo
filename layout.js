/**
 * سایدبار، ناوبری پایین، منوی کاربر و کمک‌های رزرو
 */
'use strict';

const CC = [
  '#0E8F8B',
  '#C98303',
  '#1F3A6E',
  '#A23A4A',
  '#2F7A55',
  '#C2652D',
  '#6C4A9E',
  '#0A6B73',
  '#9A6A0A',
  '#8A3B3B',
  '#33527A',
  '#2E7D6B',
  '#B5541C',
  '#5B3A78',
  '#D9A21B',
  '#8A7A3A',
  '#4C8A5B'
];
let rsv = { day: 0, t: 0, n: 2, area: 'سالن اصلی', table: 0 };
const dayD = k => new Date(Date.now() + k * 864e5);
const dayL = k =>
  new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }).format(dayD(k));
const slots = () =>
  [12, 13, 14, 15, 19, 20, 21, 22]
    .map(h => {
      const x = (rsv.day * 3 + h) % 4 === 0;
      return `<button type="button" data-act="rslot" data-t="${h}" aria-pressed="${rsv.t === h}"${x ? ' disabled' : ''}><b>${fa(h)}:۰۰</b>${x ? '<small>پر</small>' : ''}</button>`;
    })
    .join('');
const orderRows = L =>
  L.map(
    o =>
      `<div class="rowc"><div><b>${o.id}</b><span class="muted">${new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(o.date)}</span></div><p>${o.items.map(x => x[0] + ' × ' + fa(x[1])).join('، ')}</p><div><b>${money(o.total)}</b><span class="tag">${o.st}</span></div></div>`
  ).join('') || '<p class="muted">هنوز سفارشی ثبت نکرده‌اید.</p>';
const closeSb = () => document.body.classList.remove('sb-open');
const P = {
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  cart: '<path d="M3 4h2l2.4 11h10l2-8H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'
};
const ic = k =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k]}</svg>`;
const cur2 = k => (view === k || (k === 'menu' && view === 'product') ? ' aria-current="page"' : '');
const sbh = () => {
  const h = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tehran' })).getHours(),
    o = h >= 12 && h < 23;
  return `<div class="sbh"><span class="mono">د</span><div class="lb"><b>دیگ‌آوا</b><span class="st${o ? '' : ' off'}"><i></i>${o ? 'باز است، تا ساعت ۲۳' : 'بسته است، از ۱۲ ظهر'}</span></div></div>`;
};
const renderSb = () => {
  const cl = (a, b) =>
    cats
      .slice(a, b)
      .map(
        (c, j) =>
          `<button class="sl" data-act="catgo" data-v="${a + j}" title="${c}"><span class="ico"><i style="--c:${CC[a + j]}"></i></span><span class="lb">${c}</span><small>${fa(menu.filter(d => d[1] === a + j).length)}</small></button>`
      )
      .join('');
  const pg = (k, t, o) =>
    `<a href="#${k}" title="${t}"${cur2(k)}><span class="ico">${ic(o)}</span><span class="lb">${t}</span></a>`;
  $('#sb').innerHTML =
    sbh() +
    '<p class="sh">صفحه‌ها</p>' +
    pg('home', 'خانه', 'home') +
    pg('menu', 'غذاها و محصولات', 'grid') +
    pg('pick', 'چی بخورم؟', 'star') +
    pg('events', 'مراسم و کیترینگ', 'cal') +
    pg('gallery', 'گالری', 'grid') +
    pg('track', 'پیگیری سفارش', 'cart') +
    pg('reserve', 'رزرو و آدرس', 'cal') +
    pg('about', 'درباره ما', 'info') +
    pg('contact', 'تماس با ما', 'mail') +
    `<p class="sh">غذاها</p>${cl(0, NF)}<p class="sh">محصولات</p>${cl(NF, cats.length)}` +
    (typeof skinHtml === 'function' ? skinHtml() : '');
};
const renderBn = () => {
  const t = (k, l, o, x = '') => `<a href="#${k}"${cur2(k)}>${ic(o)}<span>${l}</span>${x}</a>`;
  $('#bn').innerHTML =
    t('home', 'خانه', 'home') +
    t('menu', 'منو', 'grid') +
    `<button data-act="cmd">${ic('search')}<span>جستجو</span></button>` +
    t('cart', 'سبد', 'cart', count() ? `<b>${fa(count())}</b>` : '') +
    t('account', 'حساب', 'user');
};
const renderPop = () => {
  const th = ls.get('theme') || '';
  $('#pop').innerHTML = me
    ? `<div class="ph2"><span class="avl">${[...me.name.trim()][0]}</span><div><b>${esc(me.name)}</b><small>باشگاه ${tierOf(ptsOf(me))[0]}، ${fa(ptsOf(me))} امتیاز</small></div></div><div class="mini3"><span><b>${fa(me.orders.length)}</b>سفارش</span><span><b>${fa(me.res.length)}</b>رزرو</span><span><b>${fa(me.fav.length)}</b>علاقه‌مندی</span></div>` +
      [
        ['overview', 'نمای کلی'],
        ['orders', 'سفارش‌ها'],
        ['res', 'رزروها'],
        ['fav', 'علاقه‌مندی‌ها'],
        ['addr', 'آدرس‌ها'],
        ['settings', 'تنظیمات'],
        ['profile', 'پروفایل']
      ]
        .map(([k, t]) => `<button data-act="acctab" data-k="${k}">${t}</button>`)
        .join('') +
      `<div class="tr2">${[
        ['', 'خودکار'],
        ['light', 'روشن'],
        ['dark', 'تیره']
      ]
        .map(
          ([v, t]) =>
            `<button class="ic" data-act="theme" data-v="${v}" aria-pressed="${th === v}">${t}</button>`
        )
        .join('')}</div><button class="out" data-act="logout">خروج از حساب</button>`
    : '<div class="ph2"><div><b>به دیگ‌آوا خوش آمدید</b><small>برای سفارش و رزرو وارد شوید</small></div></div><button data-act="authmode" data-m="login">ورود</button><button data-act="authmode" data-m="reg">ثبت نام</button>';
};
let tickId = 0,
  corMax = 0;
