import mongoose, { Schema } from "mongoose";

// ✅ Existing Sub-Schemas Stay as-is

const transactionSchemaSA = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User" },
    starsReceived: Number,
    reason: { 
      type: String, 
      default: "Bonus" },
    addedBy: { 
      type: Schema.Types.ObjectId,
       ref: "SuperAdmin" },
    date: { 
      type: Date, 
      default: Date.now },
  },
  { _id: false }
);

const expiredCouponRefundSchema = new Schema(
  {
    stars: Number,
    couponCodes: [String],
    refundedAt: {
       type: Date, 
      default: Date.now },
  },
  { _id: false }
);

const welcomeBonusRecordSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User" },
    starsGiven: Number,
    givenAt: {
       type: Date,
        default: Date.now },
  },
  { _id: false }
);

const welcomeBonusTopUpLogSchema = new Schema(
  {
    starsAdded: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now },
    source: { type: String, default: "External" },
  },
  { _id: false }
);

const welcomeBonusWalletSchema = new Schema(
  {
    totalReceived: { type: Number, default: 0 },
    remainingStars: { type: Number, default: 0 },
    given: [welcomeBonusRecordSchema],
    logs: [welcomeBonusTopUpLogSchema],
  },
  { _id: false }
);

const companyDepositSchema = new Schema(
  {
    starsReceived: { type: Number, required: true },
    sourceCompany: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const rewardGivenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    starsGiven: { type: Number, required: true },
    contestId: { type: Schema.Types.ObjectId, ref: "Contest" },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const companyRewardWalletSchema = new Schema(
  {
    totalReceived: { type: Number, default: 0 },
    remainingStars: { type: Number, default: 0 },
    companyDeposits: [companyDepositSchema],
    givenToWinners: [rewardGivenSchema],
  },
  { _id: false }
);

const userEntrySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    starsUsed: { type: Number, required: true },
    contestId: { type: Schema.Types.ObjectId, ref: "Contest" },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const deletedUserStarsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    starsTransferred: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const blacklistedUserStarsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    starsTransferred: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ✅ Just adding `reservedForContests` inside existing contestEntryWalletSchema
const contestEntryWalletSchema = new Schema(
  {
    totalReceived: { type: Number, default: 0 },
    totalEntries: { type: Number, default: 0 },
    reservedForContests: { type: Number, default: 0 }, // ✅ <-- newly added
    collectedFromUsers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        starsUsed: Number,
        contestId: { type: mongoose.Schema.Types.ObjectId, ref: "ContestEntry" },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { _id: false }
);

const subscriptionLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, required: true },
    starsUsed: { type: Number, required: true },
    subscriptionStatus: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
    subscriptionStartDate: { type: Date, required: true },
    subscriptionEndDate: { type: Date, required: true },
    renewedAt: { type: Date, default: null },
    loggedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ✅ Final Schema (no restructuring)
const superAdminWalletSchema = new Schema(
  {
    totalStars: { type: Number, default: 0 },
    perUserWelcomeBonus: { type: Number, default: 0 },
    transactions: [transactionSchemaSA],
    expiredCouponRefunds: [expiredCouponRefundSchema],
    deletedUserStars: [deletedUserStarsSchema],
    welcomeBonusWallet: welcomeBonusWalletSchema,
    companyRewardWallet: companyRewardWalletSchema,
    contestEntryWallet: contestEntryWalletSchema,
    userEntry: [userEntrySchema],
    blacklistedUserStars: [blacklistedUserStarsSchema],
    subscriptionLogs: [subscriptionLogSchema],
  },
  { timestamps: true }
);

export default mongoose.model("SuperAdminWallet", superAdminWalletSchema);
