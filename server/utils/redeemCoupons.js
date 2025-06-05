import Coupon from "../model/couponModel.js";
import SuperAdminWallet from "../model/superAdminWallet.js";

const runRefundExpiredCoupons = async () => {
  const now = new Date();

  const expiredCoupons = await Coupon.find({
    expiryDate: { $lt: now },
    isClaimed: false,
    refunded: { $ne: true },
  });

  if (expiredCoupons.length === 0) {
    console.log("No expired unclaimed coupons found.");
    return { refundedCoupons: [], starsRefunded: 0 };
  }

  const totalStarsToRefund = expiredCoupons.reduce(
    (sum, coupon) => sum + coupon.perStarCount,
    0
  );

  const refundedCouponCodes = expiredCoupons.map((c) => c.code);

  let wallet = await SuperAdminWallet.findOne();
  if (!wallet) {
    wallet = new SuperAdminWallet();
  }
wallet.totalStars += totalStarsToRefund;

// wallet.transactions.push({
//   starsReceived: totalStarsToRefund,
//   reason: "Refund of expired unclaimed coupons",
//   addedBy: "System",
// });

wallet.expiredCouponRefunds.push({
  stars: totalStarsToRefund,
  couponCodes: refundedCouponCodes,
  refundedAt: new Date(),
});


  await wallet.save();

  await Coupon.updateMany(
    { _id: { $in: expiredCoupons.map((c) => c._id) } },
    { $set: { refunded: true } }
  );

  console.log("Refunded expired unclaimed coupons:", refundedCouponCodes);

  return {
    refundedCoupons: refundedCouponCodes,
    starsRefunded: totalStarsToRefund,
  };
};

export { runRefundExpiredCoupons };
