import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  perStarCount: {
    type: Number,
    required: true,
  },
  generationDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
  },
  isClaimed: {
    type: Boolean,
    default: false,
  },
  requestedByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  isUserRequestApproved: {
    type: Boolean,
    default: null,
  },
  requestNote: {
    type: String,
    default: null,
  },
  createdByRole: {
    type: String,
    enum: ["admin", "user"],
    required: true,
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CouponBatch",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);
