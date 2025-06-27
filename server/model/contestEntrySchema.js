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
  maxParticipants: {
    type: Number,
    required: true
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["Active", "Ended"],
    default: "Active"
  },
  prizeImages: {
    type: [String], 
    validate: {
      validator: function (val) {
        return val.length <= 5; // Allow 0 to 5 images
      },
      message: "You can upload a maximum of 5 prize images"
    },
    default: [] 
  }
}, { timestamps: true }); 

export default mongoose.model("ContestEntry", contestEntrySchema);
