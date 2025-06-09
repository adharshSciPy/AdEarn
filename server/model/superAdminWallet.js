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

// Schema for welcome bonus records
const welcomeBonusRecordSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    starsGiven: {
      type: Number,
    },
    givenAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Schema for welcome bonus top-ups from external source
const welcomeBonusTopUpLogSchema = new Schema(
  {
    starsAdded: {
      type: Number,
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      default: "External",
    },
  },
  { _id: false }
);

// Wrapper schema for welcome bonus wallet
const welcomeBonusWalletSchema = new Schema(
  {
    totalReceived: {
      type: Number,
      default: 0,
    },
    remainingStars: {
      type: Number,
      default: 0,
    },
    given: [welcomeBonusRecordSchema],
    logs: [welcomeBonusTopUpLogSchema],
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
      default: 0,
    },
    transactions: [transactionSchemaSA],
    expiredCouponRefunds: [expiredCouponRefundSchema],
    welcomeBonusWallet: welcomeBonusWalletSchema, // ✅ added structured wallet
  },
  { timestamps: true }
);

export default mongoose.model("SuperAdminWallet", superAdminWalletSchema);
