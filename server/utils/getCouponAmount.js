// utils/coupon.js

const getCouponAmount=(starCount)=> {
  switch (starCount) {
    case 5: return 5.00;
    case 10: return 7.50;
    case 25: return 12.50;
    case 50: return 20.00;
    case 100: return 40.00;
    case 250: return 100.00;
    default: return starCount; 
  }
}

export default getCouponAmount
