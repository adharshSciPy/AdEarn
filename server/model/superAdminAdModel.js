import mongoose from "mongoose";

const superAdminAdSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
  },
  description: {
    type: String,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  audioUrl: {
    type: String,
    required: false,
  },
});

export default mongoose.model("SuperAdminAd", superAdminAdSchema);
