/**
 * صفحه‌ها (V)، رندر و صفحه‌ی محصول
 */
'use strict';

const V = {
  home: () => {
    const m = mealOf(T().getHours()),
      M2 = MEALS[m];
    document.documentElement.dataset.meal = m;
    const mq = [...cats, ...menu.slice(0, 14).map(d => d[0])].map(t => `<span>${t}</span>`).join('');
    return (
      stage(M2) +
      `<div class="mq" aria-hidden="true"><div>${mq}${mq}</div></div>` +
      mani() +
      W(
        `<h2>سفره‌ی دیگ‌آوا را بچین</h2><p class="muted">روی هر غذا بزن: اطلاعات، افزودن به سبد یا جزئیات.</p>${sofreh()}`
      ) +
      corridor() +
      W(
        `<h2>الان در دیگ‌آوا</h2><div class="hs">${M2[2]
          .map(n => menu.findIndex(d => d[0] === n))
          .map(i => card(i))
          .join('')}</div>`
      ) +
      chefHtml() +
      comboSec() +
      W(
        `<h2>فروشگاه دیگ‌آوا</h2><p class="muted">زعفران، شیرینی، چای، آجیل و لوازم سنتی؛ همان کیفیتی که در سفره‌مان می‌بینید.</p><div class="hs">${menu
          .map((_, i) => i)
          .filter(i => menu[i][1] >= NF)
          .sort(sorts.pop)
          .slice(0, 10)
          .map(i => card(i))
          .join(
            ''
          )}</div><p><button class="btn ghost" data-act="catgo" data-v="${NF}">دیدن همه‌ی محصولات</button></p>`
      ) +
      `<section class="cta"><div class="wrap two"><div class="rev"><h2>امشب میز دارید؟</h2><p class="muted">ساعت و تعداد نفرات را انتخاب کنید و نوع فضا را مشخص کنید. آدرس و مسیریابی هم در همان صفحه است.</p><p><a class="btn" href="#reserve">رزرو میز و آدرس</a></p></div>${info}</div></section>` +
      W(
        `<h2>بیشتر از یک وعده غذا</h2><div class="tiles2"><a class="tl2" href="#events" style="--c:#A23A4A"><b>مراسم و کیترینگ</b><span>تولد، عقد و همایش؛ برآورد هزینه در یک دقیقه</span></a><a class="tl2" href="#reserve" style="--c:#2E8F8B"><b>میز خود را ببینید</b><span>نقشه‌ی سه‌بعدی سالن و انتخاب میز</span></a><a class="tl2" href="#gallery" style="--c:#C98303"><b>گالری</b><span>غذاها، فضا و لحظه‌های مراسم</span></a></div>`
      ) +
      W(`<h2>نظر مهمان‌ها</h2>${wall()}`)
    );
  },
  menu: () =>
    `<section class="dash">${W(
      `<h1 class="pt">غذاها و محصولات</h1><div class="bar2"><input id="q" type="search" placeholder="جستجوی غذا یا ماده اولیه…" aria-label="جستجو" value="${esc(f.q)}"><select id="sort" aria-label="مرتب‌سازی">${Object.entries(
        sortNames
      )
        .map(([k, t]) => `<option value="${k}"${f.sort === k ? ' selected' : ''}>${t}</option>`)
        .join(
          ''
        )}</select><div class="seg"><button data-act="mode" data-v="table" aria-pressed="${f.mode === 'table'}">جدول</button><button data-act="mode" data-v="cards" aria-pressed="${f.mode === 'cards'}">منو</button></div><button class="fbtn" data-act="filters">فیلترها</button></div><div class="dl"><aside class="side" id="side">${side()}<button class="clr" data-act="clear">پاک کردن فیلترها</button></aside><div><p class="muted" id="rc"></p><div id="grid"></div></div></div>`
    )}</section>`,
  product: i => {
    cur = i;
    const d = menu[i],
      rv = revs.filter(r => r.d === i),
      sp = specs(d),
      on = me && me.fav.includes(i),
      rel = sameCat(i)
        .filter(j => j !== i)
        .slice(0, 6);
    return (
      `<article class="pg ap" style="--c:${d[6]}"><div class="crumb"><button class="back" data-act="back">بازگشت</button><span class="muted">${cats[d[1]]}</span></div>` +
      `<header class="ap-hero"><p class="ap-eyebrow" style="--k:1">${badge(d) || cats[d[1]]} · ${d[10]}</p><h1 class="pn1" style="--k:2">${d[0]}</h1><p class="desc2" style="--k:3">${d[3]}. ${d[1] >= NF ? 'بسته‌بندی سالم و ارسال به سراسر کشور.' : 'همان روز با مواد تازه تهیه می‌شود.'}</p>` +
      `<p class="pp" id="ppr" style="--k:4">${money(unit(keyOf(i)))}</p><div class="ap-cta" style="--k:5"><span id="dctl">${pctl(i)}</span><button class="ic" data-act="share" data-i="${i}">اشتراک‌گذاری</button><button class="heart heart2" data-act="fav" data-i="${i}" aria-pressed="${!!on}" aria-label="علاقه‌مندی">${on ? '♥' : '♡'}</button></div></header>` +
      `<div class="pv ap-stage" data-par="stage"><div class="glow"></div><div class="pimg">${img(i)}</div></div>` +
      `<section class="ap-nums rev">${sp
        .slice(0, 3)
        .map(s => `<div><b>${s[1]}</b><small>${s[0]}</small></div>`)
        .join('')}<div><b>${fa(d[8])}</b><small>از ${fa(d[9])} نظر</small></div></section>` +
      `<section class="ap-story rev" data-par="story"><div class="ap-bg">${img(i)}</div><div class="ap-glass"><h2>${d[1] >= NF ? 'اصل و اصیل، از مبدأ' : 'طعمی که صبر می‌خواهد'}</h2><p>${d[1] >= NF ? 'از ' + d[10] + '، با کیفیتی که در هر بسته حس می‌شود.' : d[11] + '، با مواد تازه‌ی ' + d[10] + '، تا هر لقمه همان طعم اصلی را داشته باشد.'}</p></div></section>` +
      `<section class="ap-buy rev"><div class="ap-card"><h2>سفارش خود را بسازید</h2><div class="optp" id="optp" data-opt="${i}">${optsInner(i)}</div><div class="trust">${trust(d)
        .map(t => `<span>${t}</span>`)
        .join('')}</div></div></section></article>` +
      W(
        `<h2>${d[1] >= NF ? 'جنس و ویژگی‌ها' : 'مواد و ویژگی‌ها'}</h2>${ing(d)}<dl class="specs">${sp.map(s => `<div><dt>${s[0]}</dt><dd>${s[1]}</dd></div>`).join('')}</dl>`
      ) +
      W(
        `<h2>نظرها</h2><div class="two"><div class="dist"><p class="avg"><b>${fa(d[8])}</b> از ۵</p>${dist(
          d[8]
        )
          .map(
            (p, k) =>
              `<div><span>${fa(5 - k)} ★</span><i style="--w:${p}%"></i><small>${fa(p)}٪</small></div>`
          )
          .join(
            ''
          )}</div><div>${rv.map(quote).join('') || '<p class="muted">هنوز نظری ثبت نشده.</p>'}<form id="vf" data-i="${i}" novalidate><label>امتیاز شما<select name="s">${[5, 4, 3, 2, 1].map(n => `<option value="${n}">${stars(n)}</option>`).join('')}</select></label><label>نظر شما<textarea name="t" rows="2"></textarea></label><button class="btn sm">ثبت نظر</button></form></div></div>`
      ) +
      W(`<h2>مشابه</h2><div class="grid">${rel.map(card).join('')}</div>`)
    );
  },
  photos: () => {
    const n = menu.filter((_, i) => photos[i]).length;
    return W(
      `<h1 class="pt">مدیریت عکس‌ها</h1><p class="muted">عکس‌ها را اینجا بیندازید تا خودکار مربع‌برش و بهینه شوند. در همین مرورگر ذخیره می‌شوند و بلافاصله روی سایت دیده می‌شوند. برای نسخه‌ی نهایی «دانلود همه» را بزنید و فایل‌ها را در assets/img/dishes بگذارید.</p><p class="muted">برای پیدا کردن عکس قانونی، زیر هر غذا لینک «عکس مجاز» (جستجوی عکس‌های با مجوز آزاد) و «ویکی‌مدیا» هست. فقط عکس‌هایی را بردارید که مجوزشان استفاده‌ی تجاری را اجازه می‌دهد (CC0، دامنه‌ی عمومی یا CC BY با ذکر منبع) و منبعشان را نگه دارید.</p><div class="drop" id="drop"><b>عکس‌ها را اینجا رها کنید</b><span>نام فایل می‌تواند شماره (مثل dish-12) یا نام غذا باشد؛ بقیه را زیر هر غذا دستی انتخاب کنید.</span><label class="btn sm">انتخاب چند عکس<input type="file" accept="image/*" multiple data-ph="bulk" hidden></label></div><p><b>${fa(n)}</b> از ${fa(menu.length)} عکس آماده است <button class="btn ghost sm" data-act="phzip">دانلود همه (ZIP)</button></p><div class="phg"><div class="phi"><span class="hp">${photos.hero ? `<img src="${photos.hero}" alt="">` : ''}</span><b>عکس صفحه اول</b><label class="ic">انتخاب<input type="file" accept="image/*" data-ph="hero" hidden></label>${photos.hero ? '<button class="ic" data-act="phdel" data-k="hero">حذف</button>' : ''}</div>${menu.map((d, i) => `<div class="phi">${img(i)}<b>${d[0]}</b><small class="muted">dish-${String(i + 1).padStart(2, '0')}</small><span class="lk"><a href="https://www.google.com/search?tbm=isch&tbs=sur:fc&q=${encodeURIComponent(d[0] + ' غذا')}" target="_blank" rel="noopener">عکس مجاز</a><a href="https://commons.wikimedia.org/w/index.php?ns6=1&search=${encodeURIComponent(d[0])}" target="_blank" rel="noopener">ویکی‌مدیا</a></span><label class="ic">انتخاب<input type="file" accept="image/*" data-ph="${i}" hidden></label>${photos[i] ? `<button class="ic" data-act="phdel" data-k="${i}">حذف</button>` : ''}</div>`).join('')}</div>`
    );
  },
  reserve: () =>
    W(
      `<h1 class="pt">رزرو میز و آدرس</h1>${fpHtml()}<div class="two"><form id="rf" class="panel" novalidate><h3>رزرو میز</h3><div class="days">${Array.from({ length: 10 }, (_, k) => `<button type="button" data-act="rday" data-k="${k}" aria-pressed="${rsv.day === k}"><small>${new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(dayD(k))}</small><b>${new Intl.DateTimeFormat('fa-IR', { day: 'numeric' }).format(dayD(k))}</b></button>`).join('')}</div><div class="slots" id="slots">${slots()}</div><div class="rrow"><span>تعداد نفرات</span><span class="step"><button type="button" data-act="rn" data-d="-1" aria-label="کم کردن">−</button><b id="rn">${fa(rsv.n)}</b><button type="button" data-act="rn" data-d="1" aria-label="زیاد کردن">+</button></span></div><div id="fpsel">${fpSel()}</div><label>نام و نام خانوادگی<input name="fullname" autocomplete="name"></label><label>شماره موبایل<input name="phone" inputmode="tel" autocomplete="tel" placeholder="09123456789"></label><label>توضیحات (مناسبت، حساسیت غذایی…)<textarea name="note" rows="2"></textarea></label><button class="btn">تأیید رزرو</button><p class="msg" role="status"></p></form>` +
        `<div class="panel"><div class="map"><svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="300" height="170" fill="var(--alt)"/><path d="M-10 120L310 70M70-10L120 180M210-10L170 180M-10 30L310 140" stroke="var(--mist)" stroke-width="11" fill="none"/><circle cx="150" cy="95" r="22" fill="var(--acc)" opacity=".25"/><circle cx="150" cy="95" r="9" fill="var(--acc)"/></svg></div><h3>آدرس رستوران</h3>${info}<ul class="ing"><li>پارکینگ رایگان</li><li>دسترسی ویلچر</li><li>Wi-Fi</li><li>نمازخانه</li></ul><p><a class="btn sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapQuery)}">مسیریابی</a></p></div></div>`
    ),
  events: () =>
    W(
      `<div class="pgh"><h1 class="pt">مراسم و کیترینگ</h1><p class="muted">تولد، عقد، همایش یا یک دورهمی بزرگ؛ بسته‌ی مناسب را انتخاب کنید، برآورد هزینه را همین‌جا ببینید و درخواست را بفرستید.</p></div><h3>مناسبت</h3>${evChips()}<h3 style="margin-top:1.4rem">بسته‌ی پذیرایی</h3>${evPk()}<div class="evb"><div class="panel"><h3>تعداد مهمان</h3><div class="evn" id="evn">${fa(EV.g)}</div><input id="evg" type="range" min="10" max="200" step="5" value="${EV.g}" aria-label="تعداد مهمان"><h3>خدمات اضافه</h3>${evX()}<label>تاریخ مراسم<input id="evd" type="date" value="${EV.date}" min="${new Date().toISOString().slice(0, 10)}"></label><form id="ef" class="panel" style="padding:0;border:0;background:none" novalidate><label>نام و نام خانوادگی<input name="fullname" autocomplete="name"></label><label>شماره موبایل<input name="phone" inputmode="tel" autocomplete="tel" placeholder="09123456789"></label><label>توضیحات<textarea name="note" rows="2" placeholder="مکان، ساعت، حساسیت غذایی…"></textarea></label><button class="btn">ارسال درخواست</button><p class="msg" role="status"></p></form></div><div class="panel evs" id="evs">${evSum()}</div></div><h3 style="margin-top:2rem">پرسش‌های پرتکرار</h3><div class="faq"><details><summary>چند روز قبل باید هماهنگ کنیم؟</summary><p>برای مراسم کوچک ۳ روز و برای مراسم بالای ۵۰ نفر دست‌کم یک هفته قبل.</p></details><details><summary>پیش‌پرداخت چقدر است؟</summary><p>${fa(Math.round(EVC.deposit * 100))}٪ برآورد کل، بعد از تأیید تاریخ.</p></details><details><summary>منو قابل تغییر است؟</summary><p>بله؛ هر بسته را می‌توانیم با سلیقه‌ی شما و حساسیت‌های غذایی تغییر دهیم.</p></details><details><summary>غذا را به مکان خودمان می‌آورید؟</summary><p>با گزینه‌ی «سرویس در مکان شما»؛ هزینه‌ی حمل و تجهیزات در برآورد دیده شده است.</p></details></div>`
    ),
  track: () =>
    W(
      `<div class="pgh"><h1 class="pt">پیگیری سفارش</h1><p class="muted">کد سفارش را وارد کنید تا وضعیت لحظه‌ای آن را ببینید.</p></div><div class="trk"><form id="tf" class="box" novalidate><label>کد سفارش<input name="c" value="${esc(ls.get('trk') || '')}" placeholder="S-AB12" autocomplete="off"></label><button class="btn">نمایش وضعیت</button></form><div id="trkw" class="trk">${''}</div></div>`
    ),
  gallery: () =>
    W(
      `<div class="pgh"><h1 class="pt">گالری</h1><p class="muted">غذاها، فضای رستوران و لحظه‌های مراسم.</p></div><div class="gfl" id="gfl">${[
        ['', 'همه'],
        ['food', 'غذاها'],
        ['space', 'فضا'],
        ['event', 'مراسم']
      ]
        .map(
          (x, k) =>
            `<button type="button" data-act="gf" data-v="${x[0]}" aria-pressed="${k === 0}">${x[1]}</button>`
        )
        .join('')}</div><div id="galw">${galView('')}</div>` +
        (SITE.press && SITE.press.length
          ? `<div class="prs">${SITE.press.map(x => `<span>${esc(x)}</span>`).join('')}</div>`
          : '')
    ),
  pick: () =>
    W(
      `<h1 class="pt">چی بخورم؟</h1><p class="muted">تعداد نفرات، حال‌وهوا و بودجه را بگویید؛ یک سفره‌ی کامل از منوی خودمان می‌چینیم.</p><div class="pk" id="pkw">${pkAll()}</div>`
    ),
  about: () =>
    W(
      `<h1 class="pt">درباره ما</h1><div class="two"><div><p>دیگ‌آوا از یک آشپزخانه‌ی خانگی شروع شد؛ جایی که غذا آهسته می‌پخت و صدای دیگ یعنی سفره نزدیک است. حالا همان روش را با مواد تازه‌ی بازار صبح و دستور پخت‌های خانوادگی ادامه می‌دهیم.</p><p>هر روز صبح سبزی و گوشت همان روز تهیه می‌شود و خورشت‌ها ساعت‌ها روی حرارت ملایم می‌مانند.</p></div><dl class="facts"><div><dt>۱۲</dt><dd>سال پخت آهسته روی حرارت ملایم</dd></div><div><dt>${fa(menu.length)}</dt><dd>غذا و نوشیدنی با دستور پخت خانوادگی</dd></div><div><dt>۶</dt><dd>تأمین‌کننده‌ی محلی برای سبزی و گوشت</dd></div></dl></div>`
    ),
  contact: () =>
    W(
      `<h1 class="pt">تماس با ما</h1><div class="two"><div>${info}</div><form id="cf" class="panel" novalidate><label>نام<input name="fullname"></label><label>ایمیل<input name="email" type="email" dir="ltr"></label><label>پیام<textarea name="msg" rows="4"></textarea></label><button class="btn">ارسال پیام</button></form></div>`
    ),
  cart: () => {
    const ks = Object.keys(cart);
    if (!ks.length)
      return W(
        '<h1 class="pt">سبد خرید</h1><div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.5L20.5 8H6"/><circle cx="10" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/></svg><h2>سبد شما خالی است</h2><p class="muted">از منو چیزی که دوست دارید انتخاب کنید؛ اینجا جمع می‌شود.</p><a class="btn" href="#menu">دیدن منو</a></div>'
      );
    const thumb = k => {
      const p = parseK(k);
      return p.c !== undefined ? '<span class="ph" style="--c:#0E8F8B"></span>' : img(p.i);
    };
    return W(
      `<h1 class="pt">سبد خرید</h1><div class="two"><div>${ks.map(k => `<div class="line">${thumb(k)}<div class="li"><b>${label(k)}</b><p class="muted">${money(unit(k))}</p></div>${stepK(k)}<b class="lp">${money(unit(k) * cart[k])}</b><button class="x" data-act="rmk" data-k="${k}" aria-label="حذف">×</button></div>`).join('')}</div>` +
        `<form id="of" class="panel" novalidate><p class="sum"><span>جمع اقلام</span><span>${money(sub())}</span></p>${disc() ? `<p class="sum off2"><span>تخفیف (${coupon})</span><span>−${money(disc())}</span></p>` : ''}${SITE.serviceRate ? `<p class="sum"><span>هزینه سرویس (${fa(Math.round(SITE.serviceRate * 100))}٪)</span><span>${money(Math.round((sub() - disc()) * SITE.serviceRate))}</span></p>` : ''}<p class="sum big"><span>مبلغ نهایی</span><span>${money(payable())}</span></p><label>نحوه دریافت<select name="type"><option>سرو در سالن</option><option>بیرون‌بر</option></select></label><label>شماره میز یا آدرس<input name="where" list="addrs" autocomplete="off"></label>${!me && SITE.guestCheckout ? '<label>نام و نام خانوادگی<input name="gname" autocomplete="name"></label><label>شماره موبایل<input name="gphone" inputmode="tel" autocomplete="tel" placeholder="09123456789"></label>' : ''}<datalist id="addrs">${me ? (me.addrs || []).map(a => `<option value="${esc(a.a)}">${esc(a.t)}</option>`).join('') : ''}</datalist><div class="cpn"><input id="cpn" placeholder="کد تخفیف (مثلاً DIGAVA10)" value="${esc(coupon)}" dir="ltr" aria-label="کد تخفیف"><button type="button" class="ic" data-act="coupon">اعمال</button></div><button class="btn">ثبت سفارش</button></form></div>`
    );
  },
  account: () => {
    if (!me)
      return W(
        '<h1 class="pt">حساب کاربری</h1><div class="panel"><p class="muted">برای دیدن سفارش‌ها، رزروها و علاقه‌مندی‌ها وارد شوید یا ثبت نام کنید.</p><p><button class="btn" data-act="authmode" data-m="login">ورود</button> <button class="btn ghost" data-act="authmode" data-m="reg">ثبت نام</button></p></div>'
      );
    me.addrs = me.addrs || [];
    me.prefs = me.prefs || { sms: true, promo: false, news: false, veg: false, mild: false };
    const spent = me.orders.reduce((s, o) => s + o.total, 0),
      pts = ptsOf(me),
      tr = tierOf(pts),
      pct = tr[0] === 'طلایی' ? 100 : Math.round(((pts - tr[1]) / (tr[2] - tr[1])) * 100);
    const body =
      {
        overview:
          `<div class="club"><small>باشگاه مشتریان دیگ‌آوا</small><b>سطح ${tr[0]}</b><div class="pts"><b>${fa(pts)}</b> امتیاز</div><div class="capb"><i style="--w:${pct}%"></i></div><small>${tr[0] === 'طلایی' ? 'شما در بالاترین سطح هستید.' : `${fa(tr[2] - pts)} امتیاز تا سطح بعدی`}</small><small>کدهای تخفیف شما: DIGAVA10 ${me.orders.length ? '' : 'و WELCOME'}</small></div>` +
          `<div class="stats"><div><b>${fa(me.orders.length)}</b><span>سفارش</span></div><div><b>${money(spent)}</b><span>مجموع خرید</span></div><div><b>${fa(me.res.length)}</b><span>رزرو</span></div><div><b>${fa(me.fav.length)}</b><span>علاقه‌مندی</span></div></div><h3>آخرین سفارش</h3>${me.orders[0] ? orderCard(me.orders[0], 0) : '<p class="muted">هنوز سفارشی ثبت نکرده‌اید.</p>'}` +
          (me.res[0]
            ? `<h3>رزرو بعدی</h3><div class="rowc"><div><b>${me.res[0].id}</b><span class="muted">${me.res[0].day}، ساعت ${fa(me.res[0].t)}:۰۰</span></div><p>${fa(me.res[0].n)} نفر، ${me.res[0].area || ''}</p></div>`
            : ''),
        orders: me.orders.map(orderCard).join('') || '<p class="muted">هنوز سفارشی ثبت نکرده‌اید.</p>',
        res:
          me.res
            .map(
              (r, k) =>
                `<div class="rowc"><div><b>${r.id}</b><span class="muted">${r.day}، ساعت ${fa(r.t)}:۰۰</span></div><p>${fa(r.n)} نفر، ${r.area || ''}${r.tb ? '، میز ' + fa(r.tb) : ''}</p><button class="btn ghost sm" data-act="cancelres" data-k="${k}">لغو رزرو</button></div>`
            )
            .join('') || '<p class="muted">رزروی ندارید.</p>',
        fav: me.fav.length
          ? `<div class="grid">${me.fav.map(card).join('')}</div>`
          : '<p class="muted">با زدن قلب روی هر غذا یا محصول، اینجا ذخیره می‌شود.</p>',
        addr: `${me.addrs.map((a, k) => `<div class="rowc"><div><b>${esc(a.t)}</b></div><p>${esc(a.a)}</p><button class="btn ghost sm" data-act="deladdr" data-k="${k}">حذف</button></div>`).join('') || '<p class="muted">آدرسی ذخیره نشده است.</p>'}<form id="ad" class="panel" novalidate><h3>افزودن آدرس</h3><label>عنوان<input name="t" placeholder="خانه، محل کار…"></label><label>آدرس کامل<textarea name="a" rows="2"></textarea></label><p class="msg" role="status"></p><button class="btn sm">ذخیره آدرس</button></form>`,
        settings:
          `<div class="panel"><h3>ظاهر سایت</h3><div class="tabs">${[
            ['', 'خودکار'],
            ['light', 'روشن'],
            ['dark', 'تیره']
          ]
            .map(
              ([v, t]) =>
                `<button data-act="theme" data-v="${v}" aria-pressed="${(ls.get('theme') || '') === v}">${t}</button>`
            )
            .join('')}</div></div>` +
          `<div class="panel"><h3>اعلان‌ها و ترجیحات</h3>${[
            ['sms', 'پیامک وضعیت سفارش'],
            ['promo', 'پیامک تخفیف‌ها'],
            ['news', 'خبرنامه ایمیلی'],
            ['veg', 'فقط غذای گیاهی پیشنهاد شود'],
            ['mild', 'غذای ملایم و بدون تندی']
          ]
            .map(
              ([k, t]) =>
                `<label class="sw"><input type="checkbox" data-pref="${k}"${me.prefs[k] ? ' checked' : ''}><span>${t}</span></label>`
            )
            .join('')}</div>` +
          `<form id="pw2" class="panel" novalidate><h3>تغییر رمز عبور</h3><label>رمز فعلی<input name="o" type="password" dir="ltr"></label><label>رمز جدید<input name="n" type="password" dir="ltr"></label><p class="msg" role="status"></p><button class="btn sm">تغییر رمز</button></form>` +
          `<div class="panel"><h3>حذف حساب</h3><p class="muted">با حذف حساب، سفارش‌ها، رزروها و علاقه‌مندی‌ها پاک می‌شوند.</p><p><button class="btn ghost sm" data-act="delacc">${delArm ? 'برای تأیید دوباره بزنید' : 'حذف حساب'}</button></p></div>`,
        profile: `<form id="pf" class="panel" novalidate><label>نام و نام خانوادگی<input name="name" value="${esc(me.name)}"></label><label>شماره موبایل<input name="phone" value="${esc(me.phone)}" inputmode="tel"></label><label>ایمیل<input value="${esc(me.email)}" dir="ltr" disabled></label><p class="msg" role="status"></p><button class="btn">ذخیره تغییرات</button></form>`
      }[accTab] || '';
    return W(
      `<h1 class="pt">سلام ${esc(me.name.split(' ')[0])}</h1><div class="acc"><nav class="tabs vert">${[
        ['overview', 'نمای کلی'],
        ['orders', 'سفارش‌ها'],
        ['res', 'رزروها'],
        ['fav', 'علاقه‌مندی‌ها'],
        ['addr', 'آدرس‌ها'],
        ['settings', 'تنظیمات'],
        ['profile', 'پروفایل']
      ]
        .map(
          ([k, t]) => `<button data-act="acctab" data-k="${k}" aria-pressed="${accTab === k}">${t}</button>`
        )
        .join('')}<button data-act="logout">خروج از حساب</button></nav><div>${body}</div></div>`
    );
  }
};
const render = keep => {
  clearInterval(tickId);
  const h = location.hash.slice(1),
    pm = /^p(\d+)$/.exec(h);
  view = pm && menu[+pm[1]] ? 'product' : V[h] && h !== 'product' ? h : 'home';
  $('#app').innerHTML = view === 'product' ? V.product(+pm[1]) : V[view]();
  renderSb();
  renderBn();
  grid();
  syncSide();
  const f = $('#rf') || $('#cf');
  if (me && f) {
    f.elements.fullname.value = me.name;
    if (f.elements.phone) f.elements.phone.value = me.phone;
    if (f.elements.email) f.elements.email.value = me.email;
  }
  $('#mini').hidden = !count() || view === 'cart' || view === 'product';
  if (!keep) {
    scrollTo(0, 0);
    const a = $('#app');
    a.classList.remove('vin');
    void a.offsetWidth;
    a.classList.add('vin');
  }
  reveal();
  if ($('#cdn')) {
    tick();
    tickId = setInterval(tick, 1000);
  }
  corSet();
  stgUpd();
  maniUpd();
  fpFit();
  trkRender();
};
const refresh = () => {
  if (view === 'cart') return render(true);
  $$('[data-ci]').forEach(n => (n.innerHTML = cctl(+n.dataset.ci)));
  const c = $('#dctl');
  if (c) c.innerHTML = pctl(cur);
};
const dist = a => {
  const p = Math.round(Math.min(90, 40 + (a - 4) * 60)),
    r = 100 - p;
  return [p, Math.round(r * 0.55), Math.round(r * 0.27), Math.round(r * 0.12), Math.round(r * 0.06)];
};
const specs = d =>
  d[1] >= NF
    ? [
        ['منطقه', d[10]],
        ['دسته', cats[d[1]]],
        [d[15].includes('ضمانت') ? 'گارانتی' : 'ماندگاری', d[15].split('|')[1]],
        ['وزن یا اندازه', d[15].split('|')[0]]
      ]
    : [
        ['منطقه', d[10]],
        ['روش پخت', d[11]],
        ['زمان آماده‌سازی', fa(d[12]) + ' دقیقه'],
        ['انرژی', fa(d[14]) + ' کالری'],
        [
          'رژیم',
          [d[13] ? 'بدون گلوتن' : '', d[4].includes('v') ? 'گیاهی' : '', d[4].includes('s') ? 'تند' : '']
            .filter(Boolean)
            .join('، ') || 'معمولی'
        ]
      ];
const trust = d =>
  d[1] >= NF
    ? ['ارسال سریع', 'ضمانت تازگی', 'پرداخت امن']
    : ['آماده در ' + fa(d[12]) + ' دقیقه', 'مواد تازه‌ی روز', 'پخت آهسته'];
const qtyOf = i => Object.entries(cart).reduce((s, [k, n]) => (parseK(k).i === i ? s + n : s), 0);
const pctl = i =>
  `<button class="btn" data-act="oadd" data-i="${i}">افزودن به سبد، ${money(unit(keyOf(i)))}</button>` +
  (qtyOf(i) ? `<span class="tot">${fa(qtyOf(i))} در سبد</span>` : '');
const sameCat = i => menu.map((_, j) => j).filter(j => menu[j][1] === menu[i][1]);
const pnav = d => {
  const s = sameCat(cur);
  dish(s[(s.indexOf(cur) + d + s.length) % s.length]);
};
const dish = i => {
  cur = i;
  const d = menu[i],
    rv = revs.filter(r => r.d === i),
    same = sameCat(i),
    sp = specs(d),
    on = me && me.fav.includes(i),
    rel = same.filter(j => j !== i).slice(0, 4);
  $('#dd').innerHTML =
    `<div class="pv" style="--c:${d[6]}"><div class="stage"><div class="glow"></div><button class="x" data-act="close" aria-label="بستن">×</button>` +
    `<div class="nav2"><button data-act="pnav" data-d="-1">قبلی</button><span>${fa(same.indexOf(i) + 1)} از ${fa(same.length)}</span><button data-act="pnav" data-d="1">بعدی</button></div>` +
    `<div class="orb" data-tilt><div class="ring"></div><div class="pimg">${img(i)}<span class="glare"></span></div></div>` +
    `<span class="fl f1">★ ${fa(d[8])}</span><span class="fl f2">${d[10]}</span><span class="fl f3">${badge(d) || cats[d[1]]}</span>` +
    `<button class="heart heart2" data-act="fav" data-i="${i}" aria-pressed="${!!on}" aria-label="علاقه‌مندی">${on ? '♥' : '♡'}</button></div>` +
    `<div class="info2"><small class="muted" style="--k:0">${cats[d[1]]}</small><h3 style="--k:1">${d[0]}</h3><div class="pr2" style="--k:2"><span class="stars">★★★★★</span><b>${fa(d[8])}</b><span class="muted">از ${fa(d[9])} نظر</span></div><p class="pp" style="--k:3">${money(d[2])}</p><p class="desc2" style="--k:4">${d[3]}. ${d[1] >= NF ? 'بسته‌بندی سالم و ارسال به سراسر کشور.' : 'همان روز با مواد تازه تهیه می‌شود.'}</p>` +
    `<div class="tiles" style="--k:5">${sp
      .slice(0, 4)
      .map(s => `<div><small>${s[0]}</small><b>${s[1]}</b></div>`)
      .join('')}</div><div class="trust" style="--k:6">${trust(d)
      .map(t => `<span>${t}</span>`)
      .join('')}</div>` +
    `<div class="pt3" style="--k:7"><button data-act="ptab" data-k="0" aria-pressed="true">${d[1] >= NF ? 'جنس و ویژگی‌ها' : 'مواد و ویژگی‌ها'}</button><button data-act="ptab" data-k="1" aria-pressed="false">نظرها</button><button data-act="ptab" data-k="2" aria-pressed="false">مشابه</button></div>` +
    `<div class="pane" data-p="0">${ing(d)}${
      sp.length > 4
        ? `<dl class="specs">${sp
            .slice(4)
            .map(s => `<div><dt>${s[0]}</dt><dd>${s[1]}</dd></div>`)
            .join('')}</dl>`
        : ''
    }</div>` +
    `<div class="pane" data-p="1" hidden><div class="dist">${dist(d[8])
      .map(
        (p, k) => `<div><span>${fa(5 - k)} ★</span><i style="--w:${p}%"></i><small>${fa(p)}٪</small></div>`
      )
      .join(
        ''
      )}</div>${rv.map(quote).join('') || '<p class="muted">هنوز نظری ثبت نشده.</p>'}<form id="vf" data-i="${i}" novalidate><label>امتیاز شما<select name="s">${[5, 4, 3, 2, 1].map(n => `<option value="${n}">${stars(n)}</option>`).join('')}</select></label><label>نظر شما<textarea name="t" rows="2"></textarea></label><button class="btn sm">ثبت نظر</button></form></div>` +
    `<div class="pane" data-p="2" hidden><div class="rel">${rel.map(j => `<button data-act="open" data-i="${j}">${img(j)}<b>${menu[j][0]}</b><small>${money(menu[j][2])}</small></button>`).join('')}</div></div>` +
    `<div class="buy2"><span id="dctl">${pctl(i)}</span><button class="ic" data-act="share" data-i="${i}">اشتراک‌گذاری</button></div></div></div>`;
  if (!$('#dd').open) $('#dd').showModal();
};
const auth = (mode = 'login', note = '') => {
  const reg = mode === 'reg';
  $('#au').innerHTML =
    `<button class="x" data-act="close" aria-label="بستن">×</button><h3>${reg ? 'ثبت نام' : 'ورود به حساب'}</h3>${note ? `<p class="muted">${note}</p>` : ''}<form id="af" data-m="${mode}" novalidate>${reg ? '<label>نام و نام خانوادگی<input name="name" autocomplete="name"></label><label>شماره موبایل<input name="phone" inputmode="tel" autocomplete="tel" placeholder="09123456789"></label>' : ''}<label>ایمیل<input name="email" type="email" dir="ltr" autocomplete="email"></label><label>رمز عبور<input name="pw" type="password" dir="ltr" autocomplete="${reg ? 'new-password' : 'current-password'}"></label><p class="msg" role="status"></p><button class="btn">${reg ? 'ساخت حساب' : 'ورود'}</button></form><p class="muted">${reg ? 'حساب دارید؟' : 'حساب ندارید؟'} <button class="link" data-act="authmode" data-m="${reg ? 'login' : 'reg'}">${reg ? 'ورود' : 'ثبت نام'}</button></p>`;
  if ($('#dd').open) $('#dd').close();
  if (!$('#au').open) $('#au').showModal();
};
// نمونه‌ی نمایشی: احراز هویت واقعی باید سمت سرور انجام شود
const hash = async s =>
  crypto.subtle
    ? [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('digava:' + s)))]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    : s;
