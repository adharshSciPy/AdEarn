import mongoose,{Schema} from "mongoose";

const transactionSchemaSA = new Schema(
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

const superAdminWalletSchema = new Schema(
  {
    totalStars: {
      type: Number,
      default: 0,
    },
    transactions: [transactionSchemaSA],
  },
  { timestamps: true }
);

export default mongoose.model('SuperAdminWallet', superAdminWalletSchema);




