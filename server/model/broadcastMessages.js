import mongoose, { Schema } from "mongoose";

const broadcastSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    target: {
      type: String,
      enum: ["allUsers", "allAdmins"],
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


export const Broadcast = mongoose.model("Broadcast", broadcastSchema);
