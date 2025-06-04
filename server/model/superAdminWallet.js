import mongoose, { Schema } from "mongoose";

// Sub-document schema for each transaction entry
const transactionSchemaSA = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Recipient of the bonus
      required: true,
    },
    starsReceived: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      default: "Bonus", // e.g., Welcome Bonus, Manual Top-up, etc.
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "SuperAdmin", // Points to SuperAdmin model now
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Main schema for Super Admin’s wallet
const superAdminWalletSchema = new Schema(
  {
    totalStars: {
      type: Number,
      default: 0,
    },
    transactions: [transactionSchemaSA],
  },
  { timestamps: true }
);

export default mongoose.model("SuperAdminWallet", superAdminWalletSchema);
