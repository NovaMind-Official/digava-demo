/**
 * اعمال تنظیمات برند، سئو و راه‌اندازی
 */
'use strict';

/* ── اعمال تنظیمات روی صفحه: عنوان، فوتر، رنگ، سئو (OG + JSON-LD)، آیکون ── */
const applySite = () => {
  const B = 'دیگ‌آوا',
    set = (s, fn) => {
      const n = $(s);
      if (n) fn(n);
    };
  document.title = document.title.split(B).join(SITE.name);
  set('meta[name=description]', n => (n.content = SITE.description));
  $$('.brand').forEach(n => {
    if (n.textContent.trim() === B) n.textContent = SITE.name;
  });
  set('.foot > div:nth-child(1) p', n => (n.textContent = SITE.tagline));
  set(
    '.foot > div:nth-child(2)',
    n => (n.innerHTML = `<p>${esc(SITE.address)}</p><p>${esc(SITE.phoneLabel)} · ${esc(SITE.email)}</p>`)
  );
  set('.copy', n => (n.innerHTML = n.innerHTML.split(B).join(esc(SITE.name))));
  const c = SITE.colors,
    st = document.createElement('style');
  st.textContent = `:root{--acc:${c.light.acc};--star:${c.light.acc};--tq:${c.light.tq}}@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--acc:${c.dark.acc};--star:${c.dark.acc};--tq:${c.dark.tq}}}:root[data-theme="dark"]{--acc:${c.dark.acc};--star:${c.dark.acc};--tq:${c.dark.tq}}`;
  document.head.appendChild(st);
  const meta = (p, k, v) => {
    const m = document.createElement('meta');
    m.setAttribute(p, k);
    m.content = v;
    document.head.appendChild(m);
  };
  meta('property', 'og:title', document.title);
  meta('property', 'og:description', SITE.description);
  meta('property', 'og:type', 'restaurant');
  meta('property', 'og:locale', 'fa_IR');
  meta('name', 'theme-color', c.dark.tq);
  if (SITE.url) {
    meta('property', 'og:url', SITE.url);
    const l = document.createElement('link');
    l.rel = 'canonical';
    l.href = SITE.url;
    document.head.appendChild(l);
  }
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: SITE.name,
    description: SITE.description,
    telephone: SITE.phone,
    email: SITE.email,
    servesCuisine: 'Persian',
    priceRange: '$$',
    openingHours: SITE.hours,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address,
      addressLocality: SITE.city,
      addressCountry: 'IR'
    }
  };
  if (SITE.url) ld.url = SITE.url;
  if (SITE.instagram) ld.sameAs = ['https://instagram.com/' + SITE.instagram];
  const sc = document.createElement('script');
  sc.type = 'application/ld+json';
  sc.textContent = JSON.stringify(ld);
  document.head.appendChild(sc);
  // برند در متن‌های ساخته‌شده توسط جاوااسکریپت
  if (SITE.name !== B) {
    const fix = root => {
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode()))
        if (n.nodeValue.includes(B)) n.nodeValue = n.nodeValue.split(B).join(SITE.name);
    };
    let t = 0;
    new MutationObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => fix(document.body), 30);
    }).observe(document.body, { childList: true, subtree: true });
    fix(document.body);
  }
};
$('#yr').textContent = new Date().toLocaleDateString('fa-IR', { year: 'numeric' });
applySite();
head();
render(true);
loadPhotos();
