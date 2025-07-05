import mongoose, { Schema } from "mongoose";

const adminCouponReserveSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin", 
      required: true,
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: "CouponBatch", 
    },
    coupons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Coupon", 
      },
    ],
  },
  { timestamps: true }
);

export const AdminCouponReserve = mongoose.model(
  "AdminCouponReserve",
  adminCouponReserveSchema
);
