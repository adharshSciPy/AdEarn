import mongoose, { Schema } from "mongoose";

const contestEntrySchema = new mongoose.Schema({
  contestName: {
    type: String,
    required: true
  },
  contestNumber: {
    type: Number,
    required: true,
    unique: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  entryStars: {
    type: Number,
    required: true
  },
  totalEntries: {
    type: Number,
    default: 0
  },
  result: {
    type: String, // or use an ObjectId reference if result is a separate document
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.model("ContestEntry", contestEntrySchema);