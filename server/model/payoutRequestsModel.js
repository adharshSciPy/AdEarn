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
  isVerified: {
    type: Boolean,
    default: false, 
  },
  verifiedAt: {
    type: Date,
    default: null, 
  },
  isPayoutCompleted: {
    type: Boolean,
    default: false,
  },
   payoutCompletedAt: {
    type: Date,
    default: null, 
  },
   rejected: {
    type: Boolean,
    default: false,
  },
  rejectedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },

},  {timestamps:true});


export const PayoutRequest = mongoose.model("PayoutRequest", payoutRequestSchema);
