import mongoose from "mongoose";

const subscriptionSettingsSchema = new mongoose.Schema({
  starCountRequired: {
    type: Number,
    required: true,
    default: 2,
  },
  subscriptionDurationDays: {
    type: Number,
    required: true,
    default: 30,
  },
}, { timestamps: true });

export default mongoose.model("SubscriptionSettings", subscriptionSettingsSchema);
