import mongoose, { Schema } from "mongoose";
import { type } from "os";

const couponSchema = new Schema(
  {
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
    isApproved:{
      type:Boolean,
      default:false
    },

    // For future extensibility; null by default
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
      enum: ["superadmin"], // locked to superadmin only
      required: true,
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CouponBatch",
      required: true,
    },
    refunded: {
  type: Boolean,
  default: false,
},


  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
