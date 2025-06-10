import mongoose, { Schema } from "mongoose";

const transactionSchemaSA = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    starsReceived: Number,
    reason: {
      type: String,
      default: "Bonus",
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const expiredCouponRefundSchema = new Schema(
  {
    stars: Number,
    couponCodes: [String],
    refundedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const welcomeBonusRecordSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    starsGiven: Number,
    givenAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

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

// ✅ NEW SCHEMAS ONLY — DO NOT TOUCH ABOVE

const companyDepositSchema = new Schema(
  {
    starsReceived: {
      type: Number,
      required: true,
    },
    sourceCompany: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const rewardGivenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    starsGiven: {
      type: Number,
      required: true,
    },
    contestId: {
      type: Schema.Types.ObjectId,
      ref: "Contest",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const companyRewardWalletSchema = new Schema(
  {
    totalReceived: {
      type: Number,
      default: 0,
    },
    remainingStars: {
      type: Number,
      default: 0,
    },
    companyDeposits: [companyDepositSchema],
    givenToWinners: [rewardGivenSchema],
  },
  { _id: false }
);

const userEntrySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    starsUsed: {
      type: Number,
      required: true,
    },
    contestId: {
      type: Schema.Types.ObjectId,
      ref: "Contest",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const contestEntryWalletSchema = new Schema(
  {
    totalReceived: { type: Number, default: 0 },
    totalEntries: { type: Number, default: 0 },
    collectedFromUsers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        starsUsed: Number,
        contestId: { type: mongoose.Schema.Types.ObjectId, ref: "ContestEntry" },
      },
    ],
  },
  { _id: false }
);


// ✅ Final Schema with integrated wallets

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
    welcomeBonusWallet: welcomeBonusWalletSchema,

    // ✅ New fields below
    companyRewardWallet: companyRewardWalletSchema,
    contestEntryWallet: contestEntryWalletSchema,
    userEntry: userEntrySchema
  },
  { timestamps: true }
);

export default mongoose.model("SuperAdminWallet", superAdminWalletSchema);
