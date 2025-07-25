import mongoose, { Schema } from "mongoose";

const payoutRequestSchema = new Schema({
  starCount: {
    type: Number,
    required: true,
    min: 1000,
  },
  amount: {
    type: Number,
    required: true,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  payoutStatus: {
    type: String,
    enum: ["pending", "verified", "rejected", "completed"],
    default: "pending",
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  payoutCompletedAt: {
    type: Date,
    default: null,
  },
  rejectedAt: {
    type: Date,
    default: null,
  },
  rejectionReason: {
    type: String,
  },
}, { timestamps: true });

export const PayoutRequest = mongoose.model("PayoutRequest", payoutRequestSchema);
