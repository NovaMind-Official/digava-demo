/**
 * قفل اسکرول صفحه‌ی زیرین وقتی منو، سبد، برگه یا پنجره باز است
 */
'use strict';

{
  const root = document.documentElement;
  const sync = () => {
    const mg = $('#mega');
    const on =
      document.body.matches('.sb-open, .dro, .qso') ||
      !!document.querySelector('dialog[open]') ||
      !!(mg && !mg.hidden);
    root.classList.toggle('lock', on);
  };
  const mo = new MutationObserver(sync);
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open', 'hidden'] });
}
