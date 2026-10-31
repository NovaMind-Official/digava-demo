/**
 * مدیریت کلیک‌ها و رویدادهای اصلی
 */
'use strict';

document.addEventListener('submit', e => {
  e.preventDefault();
  const h = forms[e.target.id];
  if (h) h(e.target);
});
document.addEventListener('input', e => {
  const id = e.target.id;
  if (id === 'q') f.q = e.target.value.trim();
  else if (id === 'sort') f.sort = e.target.value;
  else if (id === 'pmax') {
    f.pmax = +e.target.value;
    $('#pv').textContent = money(f.pmax);
  } else return;
  grid();
});
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (!a) return;
  const i = +a.dataset.i,
    act = a.dataset.act;
  if (act === 'add') {
    if (+a.dataset.d > 0) fly(i, a);
    add(i, +a.dataset.d);
  } else if (act === 'open') navTo('p' + i, a.querySelector('.ph'));
  else if (act === 'opts') {
    const o = a.closest('.cb').querySelector('.opts');
    o.classList.toggle('open');
    if (o.classList.contains('open')) o.firstElementChild.innerHTML = optsInner(i);
  } else if (act === 'osz') {
    (sel[i] || (sel[i] = defSel(i))).s = +a.dataset.k;
    refreshOpts(i);
  } else if (act === 'oad') {
    const sl = sel[i] || (sel[i] = defSel(i)),
      k = +a.dataset.k,
      x = sl.a.indexOf(k);
    x < 0 ? sl.a.push(k) : sl.a.splice(x, 1);
    refreshOpts(i);
  } else if (act === 'oadd') {
    addK(keyOf(i), 1);
    toast('به سبد اضافه شد.');
  } else if (act === 'addk') addK(a.dataset.k, +a.dataset.d);
  else if (act === 'rmk') {
    delete cart[a.dataset.k];
    save();
    head();
    refresh();
  } else if (act === 'cmp') {
    const x = cmpSet.indexOf(i);
    if (x < 0) {
      if (cmpSet.length >= 3) return toast('حداکثر ۳ مورد را می‌توان مقایسه کرد.');
      cmpSet.push(i);
    } else cmpSet.splice(x, 1);
    renderCmp();
  } else if (act === 'cmpgo') {
    if (cmpSet.length < 2) toast('دست‌کم دو مورد انتخاب کنید.');
    else openCmp();
  } else if (act === 'cmpclr') {
    cmpSet.length = 0;
    renderCmp();
  } else if (act === 'coupon') {
    coupon = ($('#cpn').value || '').trim().toUpperCase();
    if (coupon && !COUPONS[coupon]) {
      toast('کد تخفیف معتبر نیست.');
      coupon = '';
    } else if (coupon === 'WELCOME' && me && me.orders.length) {
      toast('این کد فقط برای اولین سفارش است.');
      coupon = '';
    } else if (coupon) toast(COUPONS[coupon][1] + ' اعمال شد.');
    render(true);
  } else if (act === 'reorder') {
    const o = me.orders[+a.dataset.k];
    if (!o || !o.ks) return toast('این سفارش قابل تکرار نیست.');
    o.ks.forEach(([k, n]) => {
      cart[k] = (cart[k] || 0) + n;
    });
    save();
    head();
    toast('اقلام به سبد اضافه شد.');
    location.hash = 'cart';
  } else if (act === 'deladdr') {
    me.addrs.splice(+a.dataset.k, 1);
    save();
    render(true);
  } else if (act === 'pk') {
    const k = a.dataset.k;
    if (k === 'n') PK.n = Math.min(12, Math.max(1, PK.n + +a.dataset.d));
    else if (k === 'mood') PK.mood = a.dataset.v;
    else PK.bud = +a.dataset.v;
    PK.seed++;
    pkRefresh();
  } else if (act === 'pkre') {
    PK.seed += 1;
    pkRefresh();
  } else if (act === 'pkall') {
    PK.set.forEach(x => addK(keyOf(x.i), x.q));
    toast('همه به سبد اضافه شد.');
  } else if (act === 'theme') {
    setTheme(a.dataset.v);
    renderPop();
    if (view === 'account') render(true);
  } else if (act === 'delacc') {
    if (!delArm) {
      delArm = true;
      render(true);
      return;
    }
    users = users.filter(u => u !== me);
    me = null;
    delArm = false;
    save();
    head();
    toast('حساب شما حذف شد.');
    location.hash = 'home';
    render(true);
  } else if (act === 'phdel') {
    delPhoto(a.dataset.k).then(() => render(true));
  } else if (act === 'phzip') exportZip();
  else if (act === 'back') {
    history.length > 1 ? history.back() : navTo('menu');
  } else if (act === 'cmd') openCmd();
  else if (act === 'mega') openMega(+a.dataset.g);
  else if (act === 'cat') {
    f.cat = +a.dataset.v;
    syncSide();
    grid();
  } else if (act === 'reg' || act === 'meth' || act === 'diet') {
    const L = f[act],
      v = a.dataset.v,
      k = L.indexOf(v);
    k < 0 ? L.push(v) : L.splice(k, 1);
    syncSide();
    grid();
  } else if (act === 'time') {
    f.time = f.time === +a.dataset.v ? 0 : +a.dataset.v;
    syncSide();
    grid();
  } else if (act === 'mode') {
    f.mode = a.dataset.v;
    $$('.seg button').forEach(b => b.setAttribute('aria-pressed', b === a));
    grid();
  } else if (act === 'filters') $('#side').classList.toggle('open');
  else if (act === 'clear') {
    reset();
    render(true);
  } else if (act === 'preset') {
    reset();
    presets[+a.dataset.k][3]();
    go();
  } else if (act === 'goreg') {
    reset();
    f.reg = [a.dataset.v];
    go();
  } else if (act === 'close') a.closest('dialog').close();
  else if (act === 'authmode') auth(a.dataset.m);
  else if (act === 'rday') {
    rsv.day = +a.dataset.k;
    rsv.t = 0;
    $$('.days button').forEach(b => b.setAttribute('aria-pressed', b === a));
    $('#slots').innerHTML = slots();
    fpUpdate();
  } else if (act === 'rslot') {
    rsv.t = +a.dataset.t;
    $$('#slots button').forEach(b => b.setAttribute('aria-pressed', b === a));
    fpUpdate();
  } else if (act === 'rn') {
    rsv.n = Math.min(12, Math.max(1, rsv.n + +a.dataset.d));
    $('#rn').textContent = fa(rsv.n);
    fpUpdate();
  } else if (act === 'evo') {
    EV.occ = +a.dataset.k;
    evRefresh();
  } else if (act === 'evp') {
    EV.pk = +a.dataset.k;
    evRefresh();
  } else if (act === 'evx') {
    const k = +a.dataset.k;
    EV.x = EV.x.includes(k) ? EV.x.filter(x => x !== k) : [...EV.x, k];
    evRefresh();
  } else if (act === 'trko') {
    ls.set('trk', a.dataset.c);
    const i = $('#tf [name=c]');
    if (i) i.value = a.dataset.c;
    trkRender();
  } else if (act === 'gf') {
    $$('#gfl button').forEach(b => b.setAttribute('aria-pressed', b === a));
    $('#galw').innerHTML = galView(a.dataset.v);
  } else if (act === 'gal') {
    lbShow(+a.dataset.k);
    $('#lb').showModal();
  } else if (act === 'lbx') $('#lb').close();
  else if (act === 'lbp') lbShow(lbK - 1);
  else if (act === 'lbn') lbShow(lbK + 1);
  else if (act === 'fp') {
    if (Date.now() - fpDragged < 250) return;
    const t = fpTb(a.dataset.id);
    if (fpBusy(t[0])) return toast('این میز در این ساعت رزرو شده است.');
    if (t[6] < rsv.n)
      return toast(`ظرفیت این میز ${fa(t[6])} نفر است؛ تعداد نفرات را کم کنید یا میز بزرگ‌تر بردارید.`);
    rsv.table = rsv.table === t[0] ? 0 : t[0];
    fpUpdate();
    if (rsv.table && navigator.vibrate)
      try {
        navigator.vibrate(12);
      } catch (_) {}
  } else if (act === 'fpclr') {
    rsv.table = 0;
    fpUpdate();
  } else if (act === 'fpv') {
    const w = $('#fpw');
    $$('.seg2 button').forEach(b => b.setAttribute('aria-pressed', b === a));
    w.style.setProperty('--rx', a.dataset.v === 'top' ? '0deg' : '58deg');
    w.style.setProperty('--s', fpS(a.dataset.v === 'top').toFixed(3));
    w.style.setProperty('--rz', a.dataset.v === 'top' ? '0deg' : '-32deg');
  } else if (act === 'rarea') {
    rsv.area = a.dataset.v;
    $$('#areas button').forEach(b => b.setAttribute('aria-pressed', b === a));
  } else if (act === 'fav') {
    if (!me) return auth('login', 'برای ذخیره علاقه‌مندی‌ها وارد شوید.');
    const k = me.fav.indexOf(i);
    k < 0 ? me.fav.push(i) : me.fav.splice(k, 1);
    save();
    $$(`.heart[data-i="${i}"]`).forEach(h => {
      h.setAttribute('aria-pressed', k < 0);
      h.textContent = k < 0 ? '♥' : '♡';
    });
    head();
    if (view === 'account') render(true);
  } else if (act === 'pnav') pnav(+a.dataset.d);
  else if (act === 'share') {
    const t = menu[i][0] + ' | ' + money(menu[i][2]) + ' | دیگ‌آوا';
    if (navigator.share) navigator.share({ title: t }).catch(() => {});
    else {
      try {
        navigator.clipboard.writeText(t);
      } catch (e) {}
      toast('اطلاعات محصول کپی شد.');
    }
  } else if (act === 'ptab') {
    $$('.pt3 button').forEach(b => b.setAttribute('aria-pressed', b === a));
    $$('.pane').forEach(p => (p.hidden = p.dataset.p !== a.dataset.k));
  } else if (act === 'catgo') {
    reset();
    f.cat = +a.dataset.v;
    closeSb();
    closeMega();
    go();
  } else if (act === 'logout') {
    me = null;
    save();
    head();
    toast('از حساب خارج شدید.');
    render(true);
  } else if (act === 'acctab') {
    accTab = a.dataset.k;
    location.hash === '#account' ? render(true) : (location.hash = 'account');
  } else if (act === 'rm') {
    delete cart[i];
    save();
    head();
    refresh();
  } else if (act === 'cancelres') {
    me.res.splice(+a.dataset.k, 1);
    save();
    render(true);
  }
});
const wide = matchMedia('(min-width:1100px)');
$('#menuBtn').onclick = () => document.body.classList.toggle(wide.matches ? 'sb-pin' : 'sb-open');
$('#scrim').onclick = closeSb;
$('#sb').onclick = e => {
  if (e.target.closest('a,button')) closeSb();
};
$('#accBtn').onclick = e => {
  e.stopPropagation();
  const p = $('#pop');
  p.toggleAttribute('hidden');
  if (!p.hidden) {
    const r = $('#accBtn').getBoundingClientRect();
    p.style.top = r.bottom + 10 + 'px';
    p.style.left = Math.max(8, Math.min(r.left, innerWidth - p.offsetWidth - 8)) + 'px';
  }
};
addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openCmd();
  }
  if (e.key === 'Escape') {
    $('#pop').hidden = true;
    closeSb();
    closeMega();
  }
});
['#dd', '#au'].forEach(s =>
  $(s).addEventListener('click', e => {
    if (e.target === e.currentTarget) e.currentTarget.close();
  })
);
$('#pop').onclick = e => {
  if (e.target.closest('a,button')) $('#pop').hidden = true;
};
document.addEventListener('click', e => {
  if (!e.target.closest('.acct,#pop')) $('#pop').hidden = true;
});
let skip = false,
  mg = -1;
