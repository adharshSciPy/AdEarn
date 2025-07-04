import mongoose, { Schema } from "mongoose";

const contestEntrySchema = new Schema({
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
        return val.length <= 5;
      },
      message: "You can upload a maximum of 5 prize images"
    },
    default: []
  },
  winnerSelectionType: {
    type: String,
    enum: ["Automatic", "Manual"],
    default: "Manual"
  },
  winners: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      position: Number,
      stars: Number // ✅ store star value each winner receives
    }
  ],
  manuallyStopped: {
    type: Boolean,
    default: false
  },

  // ✅ New field for per-position reward tier
  rewardStructure: [
    {
      position: { type: Number, required: true },
      stars: { type: Number, required: true }
    }
  ],

  contestEntryWallet: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

export default mongoose.model("ContestEntry", contestEntrySchema);
