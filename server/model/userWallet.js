import mongoose, { Schema } from "mongoose";

const userWallet = new Schema({
  totalStars: {
    type: Number,
    default: 0,
  },
  couponStars: {
    type: Number,
    default: 0,
  },
  adWatchStars: {
    type: Number,
    default: 0,
  },
  starBought: [
    {
      starsNeeded: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      paymentId: {
        type: String,
        // optional
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
        required: true,
      },
    },
  ],
  referralTransactions: [
    {
      fromUser: { type: Schema.Types.ObjectId, ref: "User" },
      starsReceived: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export const UserWallet = mongoose.model("UserWallet", userWallet);
