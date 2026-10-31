/**
 * مدیریت عکس‌ها (IndexedDB، برش، خروجی ZIP)
 */
'use strict';

const photos = {},
  blobs = {};
const idb = () =>
  new Promise(r => {
    try {
      const q = indexedDB.open('digava', 1);
      q.onupgradeneeded = () => q.result.createObjectStore('p');
      q.onsuccess = () => r(q.result);
      q.onerror = () => r(null);
    } catch (e) {
      r(null);
    }
  });
const loadPhotos = async () => {
  const d = await idb();
  if (!d) return;
  await new Promise(res => {
    const q = d.transaction('p').objectStore('p').openCursor();
    q.onsuccess = () => {
      const c = q.result;
      if (c) {
        blobs[c.key] = c.value;
        photos[c.key] = URL.createObjectURL(c.value);
        c.continue();
      } else res();
    };
    q.onerror = () => res();
  });
  if (Object.keys(photos).length) render(true);
};
const putPhoto = async (k, b) => {
  blobs[k] = b;
  photos[k] = URL.createObjectURL(b);
  const d = await idb();
  if (d) d.transaction('p', 'readwrite').objectStore('p').put(b, k);
};
const delPhoto = async k => {
  delete blobs[k];
  delete photos[k];
  const d = await idb();
  if (d) d.transaction('p', 'readwrite').objectStore('p').delete(k);
};
const fit = (file, sq) =>
  new Promise(res => {
    const im = new Image(),
      u = URL.createObjectURL(file);
    im.onload = () => {
      const w = im.width,
        hh = im.height,
        m = Math.min(w, hh),
        c = document.createElement('canvas');
      if (sq) {
        c.width = c.height = 1000;
        c.getContext('2d').drawImage(im, (w - m) / 2, (hh - m) / 2, m, m, 0, 0, 1000, 1000);
      } else {
        const k = Math.min(1, 1400 / w);
        c.width = Math.round(w * k);
        c.height = Math.round(hh * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      }
      URL.revokeObjectURL(u);
      c.toBlob(b => res(b), 'image/jpeg', 0.85);
    };
    im.onerror = () => res(null);
    im.src = u;
  });
const norm = s => s.replace(/[\u200c\s_\-.]/g, '').toLowerCase();
const matchFile = name => {
  const base = name.replace(/\.[^.]+$/, ''),
    m = /^(dish|item|img)?[-_ ]?(\d{1,3})$/i.exec(base);
  if (m && +m[2] >= 1 && +m[2] <= menu.length) return +m[2] - 1;
  const b = norm(base);
  return menu.findIndex(d => {
    const n = norm(d[0]);
    return b.includes(n) || n.includes(b);
  });
};
const addPhotos = async (files, key) => {
  let ok = 0,
    miss = 0;
  for (const f of [...files].filter(f => /^image\//.test(f.type))) {
    let k = key;
    if (k === 'bulk') {
      const i = matchFile(f.name);
      if (i < 0) {
        miss++;
        continue;
      }
      k = String(i);
    }
    const b = await fit(f, k !== 'hero');
    if (b) {
      await putPhoto(k, b);
      ok++;
    }
  }
  toast(
    `${fa(ok)} عکس ثبت شد` + (miss ? `؛ ${fa(miss)} عکس با هیچ غذایی جور نشد و باید دستی انتخاب شود.` : '.')
  );
  render(true);
};
const loadZip = () =>
  new Promise((res, rej) => {
    if (window.JSZip) return res();
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });
const exportZip = async () => {
  if (!Object.keys(blobs).length) return toast('هنوز عکسی اضافه نشده است.');
  try {
    await loadZip();
  } catch (e) {
    return toast('بارگذاری ابزار فشرده‌سازی ممکن نشد.');
  }
  const z = new JSZip();
  Object.entries(blobs).forEach(([k, b]) =>
    z.file(k === 'hero' ? 'hero.jpg' : `dish-${String(+k + 1).padStart(2, '0')}.jpg`, b)
  );
  const a = document.createElement('a');
  a.href = URL.createObjectURL(await z.generateAsync({ type: 'blob' }));
  a.download = 'digava-photos.zip';
  a.click();
  toast('فایل ZIP ساخته شد. اگر دانلود نشد، سایت را از نسخه‌ی زیپ روی کامپیوتر باز کنید.');
};
