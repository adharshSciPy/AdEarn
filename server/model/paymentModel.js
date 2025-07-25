import mongoose,{Schema} from "mongoose";
const payoutDetailsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    starCount: Number,
    amount: Number,
    requestedAt: { type: Date, default: Date.now },
    paymentVerified: Boolean,
    isComplete: Boolean,
    isRejected: Boolean,
    rejectionReason: String,
    decisionAt: Date,
  }
);

export const Payout = mongoose.model("Payout", payoutDetailsSchema);
