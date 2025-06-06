import mongoose, { Schema } from "mongoose";

// Transaction schema: each bonus provided
const transactionSchemaSA = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Recipient of the bonus
    },
    starsReceived: {
      type: Number,
    },
    reason: {
      type: String,
      default: "Bonus", // Welcome Bonus, Manual Top-up, etc.
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "SuperAdmin", // Who gave the bonus
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Schema for expired coupon refunds
const expiredCouponRefundSchema = new Schema(
  {
    stars: {
      type: Number,
    },
    couponCodes: [String],
    refundedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// SuperAdmin Wallet schema
const superAdminWalletSchema = new Schema(
  {
    totalStars: {
      type: Number,
      default: 0,
    },
    perUserWelcomeBonus: {
      type: Number,
      default: 0, // This value is set manually by superadmin
    },
    transactions: [transactionSchemaSA],
    expiredCouponRefunds: [expiredCouponRefundSchema],
  },
  { timestamps: true }
);

export default mongoose.model("SuperAdminWallet", superAdminWalletSchema);
