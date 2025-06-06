import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  perStarCount: {
    type: Number,
    required: true
  },
  generationDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date
  },
  isClaimed: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Coupon", couponSchema);
