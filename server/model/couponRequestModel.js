import mongoose,{Schema} from "mongoose";
const couponRequestSchema = new Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  starCountPerCoupon: {
    type: Number,
    required: true
  },
  totalStars: {
    type: Number,
    required: true
  },
  amountToPay: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  note: String,
  requestedDate: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null
  },
  assignedCoupons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon"
  }]
}, { timestamps: true });

export default mongoose.model("CouponRequest", couponRequestSchema);
