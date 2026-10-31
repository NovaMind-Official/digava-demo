/**
 * پنجره‌ی ارسال سفارش و پیام
 */
'use strict';

/* ── ارسال سفارش/رزرو/پیام از طریق واتساپ، تلگرام، بله، ایتا، پیامک، تماس (بدون نیاز به سرور) ── */
const sendDlg = (title, sub, text, subject) => {
  const S = SITE.send,
    ct = encodeURIComponent(text),
    L = [];
  if (S.whatsapp) L.push(['واتساپ', '#25D366', 'https://wa.me/' + S.whatsapp + '?text=' + ct, false]);
  if (S.telegram) L.push(['تلگرام', '#2AABEE', 'https://t.me/' + S.telegram, true]);
  if (S.bale) L.push(['بله', '#1ABC9C', 'https://ble.ir/' + S.bale, true]);
  if (S.eitaa) L.push(['ایتا', '#F58220', 'https://eitaa.com/' + S.eitaa, true]);
  if (S.sms) L.push(['پیامک', '#8E8E93', 'sms:' + S.sms + '?&body=' + ct, false]);
  if (SITE.email)
    L.push([
      'ایمیل',
      '#C98303',
      'mailto:' + SITE.email + '?subject=' + encodeURIComponent(subject) + '&body=' + ct,
      false
    ]);
  if (S.call) L.push(['تماس', '#0E8F8B', 'tel:' + SITE.phone, false]);
  const d = $('#ob');
  d.innerHTML = `<div class="obx"><button class="x" data-act="obc" aria-label="بستن">×</button><div class="obk">✓</div><h2>${title}</h2><p class="muted">${sub}</p><pre class="obt">${esc(text)}</pre><div class="obg">${L.map(([n, c, h, cp], k) => `<a class="obb" style="--c:${c}" href="${esc(h)}" ${cp ? 'data-cp="1"' : ''} target="_blank" rel="noopener">${n}</a>`).join('')}</div><button class="btn ghost obcp" type="button" data-act="obcopy">کپی متن</button>${L.some(l => l[3]) ? '<p class="muted obn">برای تلگرام، بله و ایتا متن خودکار کپی می‌شود؛ در چت Paste کنید.</p>' : ''}</div>`;
  d._t = text;
  if (SITE.formEndpoint) {
    try {
      fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ subject, message: text })
      });
    } catch (e) {}
  }
  if (!d.open) d.showModal();
};
const cpTxt = t => {
  try {
    navigator.clipboard.writeText(t);
    return true;
  } catch (e) {
    return false;
  }
};
document.addEventListener('click', e => {
  const d = $('#ob'),
    a = e.target.closest('[data-act="obc"],[data-act="obcopy"],#ob [data-cp]');
  if (e.target === d) return d.close();
  if (!a) return;
  if (a.dataset.act === 'obc') d.close();
  else if (a.dataset.act === 'obcopy') {
    toast(cpTxt(d._t) ? 'متن کپی شد.' : 'کپی نشد؛ متن را دستی انتخاب کنید.');
  } else if (a.dataset.cp) {
    cpTxt(d._t);
    toast('متن کپی شد؛ در چت Paste کنید.');
  }
});
