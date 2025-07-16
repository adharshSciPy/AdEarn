import mongoose,{Schema} from "mongoose";
const adminTransferLogSchema = new Schema(
  {
    starsTransferred: { type: Number, required: true },
    amount: { type: Number, required: true },
    note: { type: String },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);


const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    starsReceived: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const adminWalletSchema = new Schema(
  {
    totalStars: {
      type: Number,
      default: 0,
    },
    transactions: [transactionSchema],
    adminTransfersLog: [adminTransferLogSchema],
  },
  { timestamps: true }
);

export default mongoose.model('AdminWallet', adminWalletSchema);




