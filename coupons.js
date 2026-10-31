/**
 * کد تخفیف و مبلغ نهایی
 */
'use strict';

let coupon = '',
  delArm = false;
const COUPONS = SITE.coupons;
const disc = () => {
  const c = COUPONS[coupon];
  if (!c || (coupon === 'WELCOME' && me && me.orders.length)) return 0;
  return Math.round(sub() * c[0]);
};
const payable = () => Math.round((sub() - disc()) * (1 + SITE.serviceRate));
