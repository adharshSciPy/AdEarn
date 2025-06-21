import mongoose from "mongoose";

const welcomeBonusSettingSchema = new mongoose.Schema(
  {
    perUserBonus: {
      type: Number,
      default: 0,
      min: 0,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },
    companyImage: {
      type: String, // Stores the image path
    },
  },
  { timestamps: true }
);

export default mongoose.model("WelcomeBonusSetting", welcomeBonusSettingSchema);
