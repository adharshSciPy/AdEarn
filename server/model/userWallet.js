import mongoose, { Schema } from "mongoose";
const userWallet = new Schema({
  totalStars: {
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
        // required: true,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
        required: true,
      },
    },
  ],
});
export const UserWallet = mongoose.model("UserWallet", userWallet);
