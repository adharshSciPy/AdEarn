import mongoose from "mongoose";

const superAdminAdSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SuperAdminAd", superAdminAdSchema);
