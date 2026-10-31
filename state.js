/**
 * وضعیت برنامه، ذخیره‌سازی محلی و توابع کمکی
 */
'use strict';

// ذخیره‌سازی نمایشی در مرورگر؛ در محصول واقعی به API و پایگاه‌داده وصل کنید
const ls = {
  get: k => {
    try {
      return JSON.parse(localStorage.getItem(k));
    } catch (e) {
      return null;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }
};
const seed = [
  { d: 11, n: 'مریم احمدی', s: 5, t: 'سبزی تازه بود و ترشی‌اش به اندازه؛ مزه‌ی غذای خانه می‌داد.' },
  { d: 6, n: 'کامران ستوده', s: 5, t: 'کباب نرم و آبدار بود و برنج را داغ آوردند.' },
  { d: 0, n: 'نیلوفر عباسی', s: 4, t: 'خیلی خوشمزه بود، فقط کاش نان بیشتری می‌آوردند.' },
  { d: 20, n: 'حمید قربانی', s: 5, t: 'بعد از شام بهترین پایان ممکن بود؛ زعفرانش واقعی بود.' }
];
for (let k = seed.length - 1; k >= 0; k--) {
  if (demoMap[seed[k].d] === undefined) seed.splice(k, 1);
  else seed[k].d = demoMap[seed[k].d];
}
let users = ls.get('users') || [],
  cart = ls.get('cart') || {},
  revs = ls.get('revs') || seed;
let me = users.find(u => u.email === ls.get('me')) || null;
if (me) me.fav = me.fav || [];
let f = { cat: -1, reg: [], meth: [], diet: [], time: 0, pmax: 1000, q: '', sort: 'pop', mode: 'cards' },
  accTab = 'overview',
  view = '',
  cur = 0;
const save = () => {
  ls.set('users', users);
  ls.set('cart', cart);
  ls.set('revs', revs);
  ls.set('me', me && me.email);
};
const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
const sub = () => Object.entries(cart).reduce((s, [k, n]) => s + unit(k) * n, 0);
const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
const code = p => p + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
const dt = d =>
  new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
const toast = t => {
  const e = $('#toast');
  e.textContent = t;
  e.classList.add('on');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove('on'), 2600);
};
const W = h => `<section class="wrap rev">${h}</section>`;
const ing = d =>
  `<ul class="ing">${d[7]
    .split('،')
    .map(x => `<li>${x.trim()}</li>`)
    .join('')}</ul>`;
