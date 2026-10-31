/**
 * فرم‌ها: ثبت‌نام، رزرو، سفارش، مراسم، تماس
 */
'use strict';

const forms = {
  async af(f) {
    const m = f.dataset.m,
      v = n => (f.elements[n] ? f.elements[n].value.trim() : ''),
      msg = f.querySelector('.msg'),
      email = v('email').toLowerCase(),
      pw = v('pw');
    if (m === 'reg') {
      if (v('name').length < 3) return (msg.textContent = 'نام و نام خانوادگی را کامل وارد کنید.');
      if (!/^09\d{9}$/.test(toEn(v('phone'))))
        return (msg.textContent = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.');
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return (msg.textContent = 'ایمیل معتبر وارد کنید.');
    if (pw.length < 6) return (msg.textContent = 'رمز عبور دست‌کم ۶ کاراکتر باشد.');
    const h = await hash(pw),
      u = users.find(x => x.email === email);
    if (m === 'reg') {
      if (u) return (msg.textContent = 'با این ایمیل قبلاً ثبت نام شده است.');
      me = { name: v('name'), phone: toEn(v('phone')), email, pw: h, orders: [], res: [], fav: [] };
      users.push(me);
    } else {
      if (!u || u.pw !== h) return (msg.textContent = 'ایمیل یا رمز عبور درست نیست.');
      me = u;
      me.fav = me.fav || [];
    }
    save();
    head();
    $('#au').close();
    toast(m === 'reg' ? 'حساب شما ساخته شد.' : 'خوش آمدید، ' + me.name);
    render(true);
  },
  ef(f) {
    const el = f.elements,
      msg = f.querySelector('.msg');
    msg.className = 'msg';
    const t = evTot(),
      P = EVC.packages[EV.pk];
    if (!EV.date) return (msg.textContent = 'تاریخ مراسم را انتخاب کنید.');
    if (el.fullname.value.trim().length < 3)
      return (msg.textContent = 'نام و نام خانوادگی را کامل وارد کنید.');
    if (!/^09\d{9}$/.test(toEn(el.phone.value.trim())))
      return (msg.textContent = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.');
    const id = code('E'),
      d = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full' }).format(new Date(EV.date));
    msg.className = 'msg ok';
    msg.textContent = `درخواست ${EVC.occasions[EV.occ]} ثبت شد. کد: ${id}`;
    sendDlg(
      'درخواست مراسم ثبت شد',
      'برای هماهنگی نهایی، درخواست را برای ' + SITE.name + ' بفرستید.',
      `🎉 درخواست مراسم در ${SITE.name}\nکد: ${id}\nمناسبت: ${EVC.occasions[EV.occ]}\nتاریخ: ${d}\nمهمان: ${fa(EV.g)} نفر\nبسته: ${P[0]} (${money(P[1])} برای هر نفر)\n` +
        (EV.x.length ? 'خدمات: ' + EV.x.map(k => EVC.extras[k][0]).join('، ') + '\n' : '') +
        `برآورد کل: ${money(t.total)}\nنام: ${el.fullname.value.trim()}\nموبایل: ${toEn(el.phone.value.trim())}` +
        (el.note.value.trim() ? '\nتوضیحات: ' + el.note.value.trim() : ''),
      'مراسم ' + id
    );
  },
  tf(f) {
    ls.set('trk', f.elements.c.value.trim().toUpperCase());
    trkRender();
  },
  rf(f) {
    const el = f.elements,
      msg = f.querySelector('.msg');
    msg.className = 'msg';
    if (!rsv.t) return (msg.textContent = 'ساعت مورد نظر را انتخاب کنید.');
    if (!rsv.table) return (msg.textContent = 'یک میز روی نقشه انتخاب کنید.');
    if (el.fullname.value.trim().length < 3)
      return (msg.textContent = 'نام و نام خانوادگی را کامل وارد کنید.');
    if (!/^09\d{9}$/.test(toEn(el.phone.value.trim())))
      return (msg.textContent = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.');
    // نقطه‌ی اتصال به سرور: درخواست رزرو را اینجا به API خودتان بفرستید
    const r = { id: code('R'), day: dayL(rsv.day), t: rsv.t, n: rsv.n, area: rsv.area, tb: rsv.table };
    if (me) {
      me.res.unshift(r);
      save();
    }
    msg.className = 'msg ok';
    msg.textContent =
      `میز ${fa(r.tb)} (${fa(r.n)} نفر) در ${r.area}، ${r.day} ساعت ${fa(r.t)}:۰۰ ثبت شد. کد: ${r.id}` +
      (me ? '' : ' (برای مدیریت رزرو ثبت نام کنید)');
    sendDlg(
      'رزرو شما ثبت شد',
      'برای تأیید نهایی، رزرو را برای ' + SITE.name + ' بفرستید.',
      `📅 رزرو میز در ${SITE.name}\nکد: ${r.id}\n${r.day} ساعت ${fa(r.t)}:۰۰\n${fa(r.n)} نفر — ${r.area}${r.tb ? ' — میز ' + fa(r.tb) : ''}\nنام: ${el.fullname.value.trim()}\nموبایل: ${toEn(el.phone.value.trim())}` +
        (el.note.value.trim() ? '\nتوضیحات: ' + el.note.value.trim() : ''),
      'رزرو ' + r.id
    );
  },
  of(f) {
    const guest = !me;
    if (guest && !SITE.guestCheckout) return auth('login', 'برای ثبت سفارش وارد حساب شوید یا ثبت نام کنید.');
    if (!f.elements.where.value.trim()) return toast('شماره میز یا آدرس را وارد کنید.');
    let gn = '',
      gp = '';
    if (guest) {
      gn = f.elements.gname.value.trim();
      gp = toEn(f.elements.gphone.value.trim());
      if (gn.length < 3) return toast('نام و نام خانوادگی را کامل وارد کنید.');
      if (!/^09\d{9}$/.test(gp)) return toast('شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.');
    }
    const o = {
      id: code('S'),
      items: Object.entries(cart).map(([k, n]) => [label(k), n]),
      ks: Object.entries(cart),
      total: payable(),
      date: Date.now(),
      st: 'در حال آماده‌سازی'
    };
    const who = guest ? gn + ' — ' + gp : me.name + ' — ' + me.phone;
    const txt =
      `🧾 سفارش جدید از ${SITE.name}\nکد پیگیری: ${o.id}\n\n` +
      o.items.map(([t, n]) => `• ${t} × ${fa(n)}`).join('\n') +
      `\n\nمبلغ نهایی: ${money(o.total)}\n${f.elements.type.value}: ${f.elements.where.value.trim()}\nمشتری: ${who}`;
    if (me) me.orders.unshift(o);
    else ls.set('gorders', [o, ...(ls.get('gorders') || [])].slice(0, 20));
    ls.set('trk', o.id);
    cart = {};
    coupon = '';
    save();
    head();
    if (me) {
      accTab = 'orders';
      if (location.hash === '#account') render();
      else location.hash = 'account';
    } else render(true);
    toast('سفارش ثبت شد. کد پیگیری ' + o.id);
    sendDlg(
      'سفارش شما ثبت شد',
      'برای نهایی شدن، سفارش را از یکی از راه‌های زیر برای ' + SITE.name + ' بفرستید.',
      txt,
      'سفارش ' + o.id
    );
  },
  ad(f) {
    const msg = f.querySelector('.msg'),
      t = f.elements.t.value.trim(),
      a = f.elements.a.value.trim();
    if (t.length < 2 || a.length < 8) return (msg.textContent = 'عنوان و آدرس کامل را وارد کنید.');
    me.addrs.push({ t, a });
    save();
    render(true);
    toast('آدرس ذخیره شد.');
  },
  async pw2(f) {
    const msg = f.querySelector('.msg'),
      o = f.elements.o.value,
      n = f.elements.n.value;
    if (n.length < 6) return (msg.textContent = 'رمز جدید دست‌کم ۶ کاراکتر باشد.');
    if ((await hash(o)) !== me.pw) return (msg.textContent = 'رمز فعلی درست نیست.');
    me.pw = await hash(n);
    save();
    f.reset();
    msg.className = 'msg ok';
    msg.textContent = 'رمز عبور تغییر کرد.';
  },
  pf(f) {
    const msg = f.querySelector('.msg'),
      n = f.elements.name.value.trim(),
      p = toEn(f.elements.phone.value.trim());
    if (n.length < 3 || !/^09\d{9}$/.test(p)) return (msg.textContent = 'نام یا شماره موبایل معتبر نیست.');
    me.name = n;
    me.phone = p;
    save();
    head();
    msg.className = 'msg ok';
    msg.textContent = 'تغییرات ذخیره شد.';
  },
  vf(f) {
    if (!me) return auth('login', 'برای ثبت نظر وارد شوید.');
    const t = f.elements.t.value.trim();
    if (t.length < 5) return toast('نظر خود را کمی کامل‌تر بنویسید.');
    revs.unshift({ d: +f.dataset.i, n: me.name, s: +f.elements.s.value, t });
    save();
    render(true);
    toast('نظر شما ثبت شد.');
  },
  cf(f) {
    const e = f.elements;
    if (!e.msg.value.trim()) return toast('متن پیام را بنویسید.');
    const txt = `✉️ پیام از وب‌سایت ${SITE.name}\nنام: ${e.fullname ? e.fullname.value.trim() : ''}\n${e.phone && e.phone.value.trim() ? 'تلفن: ' + e.phone.value.trim() + '\n' : ''}${e.email && e.email.value.trim() ? 'ایمیل: ' + e.email.value.trim() + '\n' : ''}\n${e.msg.value.trim()}`;
    f.reset();
    sendDlg('پیام شما آماده است', 'یکی از راه‌ها را برای ارسال انتخاب کنید.', txt, 'پیام از وب‌سایت');
  }
};
