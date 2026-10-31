/**
 * پیشنهاد «چی بخورم؟»
 */
'use strict';

const PK = { n: 2, mood: 'any', bud: 1, seed: 1, set: [] };
const PKM = [
  ['any', 'هرچی خوشمزه‌ست'],
  ['trad', 'سنتی و سیر'],
  ['light', 'سبک'],
  ['spicy', 'تند'],
  ['veg', 'گیاهی']
];
const PKB = [
  ['اقتصادی', 300],
  ['معمولی', 500],
  ['ویژه', 900]
];
const pkRnd = k => {
  let x = Math.sin(PK.seed * 97.13 + k * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
const pkOk = d => (PK.mood === 'veg' ? d[4].includes('v') : true);
const pkSc = (d, k) => {
  let v = d[8] * Math.log(2 + d[9]) * (0.75 + pkRnd(k) * 0.6);
  if (PK.mood === 'light' && (d[4].includes('l') || (d[14] && d[14] < 380))) v *= 1.8;
  if (PK.mood === 'spicy' && d[4].includes('s')) v *= 2;
  if (PK.mood === 'trad' && d[1] === 2) v *= 1.5;
  if (PK.mood === 'trad' && d[1] === 1) v *= 1.3;
  if (PK.mood === 'any' && PK.n >= 4 && d[1] === 1) v *= 1.4;
  return v;
};
const pkPick = (cs, cap, k, ex) => {
  let L = menu.map((d, i) => [d, i]).filter(([d, i]) => cs.includes(d[1]) && pkOk(d) && !ex.includes(i));
  let a = L.filter(([d]) => d[2] <= cap);
  if (!a.length) a = L.sort((x, y) => x[0][2] - y[0][2]).slice(0, 2);
  if (!a.length) return null;
  return a.sort((x, y) => pkSc(y[0], y[1] + k) - pkSc(x[0], x[1] + k))[0][1];
};
const pkBuild = () => {
  const n = PK.n,
    B = PKB[PK.bud][1],
    used = [],
    out = [],
    push = (i, q, role) => {
      if (i != null) {
        used.push(i);
        out.push({ i, q, role });
      }
    };
  push(pkPick([0], B * 0.22, 1, used), Math.ceil(n / 2), 'پیش‌غذا');
  if (n >= 4) push(pkPick([0], B * 0.22, 2, used), Math.ceil(n / 3), 'پیش‌غذا');
  const m1 = pkPick(n >= 4 ? [1, 2] : [1, 2], B * 0.55, 3, used);
  const hasSec = n >= 2;
  push(m1, hasSec ? Math.ceil(n / 2) : 1, 'غذای اصلی');
  if (hasSec) push(pkPick([1, 2], B * 0.55, 4, used), Math.floor(n / 2), 'غذای اصلی');
  push(pkPick([3], B * 0.16, 5, used), Math.ceil(n / 2), 'دسر');
  PK.set = out;
};
const pkTotal = () => PK.set.reduce((t, x) => t + menu[x.i][2] * x.q, 0);
const pkRes = () => {
  pkBuild();
  const t = pkTotal();
  return `<div class="res">${PK.set
    .map((x, k) => {
      const d = menu[x.i];
      return `<div class="ri" style="--k:${k}"><a class="im" href="#p${x.i}">${sImg(x.i)}</a><div><small>${x.role}</small><b>${d[0]}</b><p>${d[3]}</p></div><div class="q">× ${fa(x.q)}<span>${fa(d[2] * 1000)}</span></div></div>`;
    })
    .join(
      ''
    )}</div><div class="tot2"><div><b>${fa(t * 1000)} <small style="font-size:.8rem">تومان</small></b><br><span>برای ${fa(PK.n)} نفر، حدود ${fa(Math.round(t / PK.n) * 1000)} تومان برای هر نفر</span></div><div class="acts"><button class="btn" data-act="pkall">افزودن همه به سبد</button><button class="btn ghost" data-act="pkre">یکی دیگه بچین</button></div></div>`;
};
const pkAll = () =>
  `<div class="ctrl"><div><h3>چند نفرید؟</h3><div class="nn"><button data-act="pk" data-k="n" data-d="-1" aria-label="کمتر">−</button><b>${fa(PK.n)}</b><button data-act="pk" data-k="n" data-d="1" aria-label="بیشتر">+</button></div></div><div><h3>حال‌وهوا</h3><div class="chs">${PKM.map(m => `<button data-act="pk" data-k="mood" data-v="${m[0]}" aria-pressed="${PK.mood === m[0]}">${m[1]}</button>`).join('')}</div></div><div><h3>بودجه‌ی هر نفر</h3><div class="chs">${PKB.map((b, k) => `<button data-act="pk" data-k="bud" data-v="${k}" aria-pressed="${PK.bud === k}">${b[0]} · تا ${fa(b[1] * 1000)}</button>`).join('')}</div></div></div><div id="pkr">${pkRes()}</div>`;
const pkRefresh = () => {
  const w = $('#pkw');
  if (w) w.innerHTML = pkAll();
};
