import mongoose, { Schema } from "mongoose";

const couponBatchSchema = new Schema({
  coupons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon"
  }],
  couponCount: { type: Number, required: true },
  totalStarsSpent: { type: Number, required: true },
  generationDate: { type: Date, required: true },
  expiryDate: { type: Date },
  generatedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: function () {
    return this.createdByRole === "user";
  }
},
  createdByRole: {
    type: String,
    enum: ["admin", "user"],
    required: true,
  },
  requestNote: { type: String },
  assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Admin", 
},
assignedAt: {
  type: Date,
},
}, { timestamps: true });

export default mongoose.model("CouponBatch", couponBatchSchema);
