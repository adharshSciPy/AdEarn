
import mongoose, { Schema } from "mongoose";

const userContestEntrySchema = new Schema({
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
  entryStars: {
    type: Number,
    required: true
  },
  entryDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("UserContestEntry", userContestEntrySchema);