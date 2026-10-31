/**
 * نسخه‌ی دمو: فرم‌ها نمایش داده می‌شوند ولی ثبت نمی‌شوند
 */
'use strict';

document.addEventListener(
  'submit',
  e => {
    if (e.target.id === 'vf') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    toast('این بخش در نسخه‌ی دمو فقط نمایشی است و ثبت نمی‌شود.');
  },
  true
);
