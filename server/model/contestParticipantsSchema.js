// models/ContestParticipant.js
import mongoose from "mongoose";

const contestParticipantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ContestEntry",
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  isWinner: {
    type: Boolean,
    default: false
  },
  position: {
    type: Number,
    default: null
  }
}, { timestamps: true });

contestParticipantSchema.index({ userId: 1, contestId: 1 }, { unique: true });

export default mongoose.model("ContestParticipant", contestParticipantSchema);