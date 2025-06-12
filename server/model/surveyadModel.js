import mongoose from "mongoose";

const surveyAdSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questions: [
      {
        questionText: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          required: true,
          validate: [
            (arr) => arr.length >= 2,
            "Each question must have at least 2 options",
          ],
        },
      },
    ],
    userViewsNeeded: {
      type: Number,
      required: true,
    },
    isViewsReached: {
      type: Boolean,
      default: false,
    },
    isAdVisible: {
      type: Boolean,
      default: true,
    },
    isAdVerified: {
      type: Boolean,
      default: false,
    },
    // Added ad rejection fields
    isAdRejected: {
      type: Boolean,
      default: false,
    },
    adRejectionReason: {
      type: String,
    },
    adRejectedTime: {
      type: Date,
    },
    adVerifiedTime: {
      type: Date,
    },
    adExpirationTime: {
      type: Date,
    },
    adPeriod: {
      type: Number,
    },
    adRepetition: {
      type: Boolean,
      default: false,
    },
    adRepeatSchedule: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        viewsRepatitionCount: {
          type: Number,
          default: 0,
        },
        nextScheduledAt: {
          type: Date,
        },
      },
    ],
    totalStarsAllocated: {
      type: Number,
      required: true,
    },
    starPayoutPlan: {
      type: [Number],
      default: [],
    },
    // Added audioUrl field for consistency
    audioUrl: {
      type: String,
      required: false,
    },
    viewersRewarded: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        starsGiven: Number,
      },
    ],
    targetRegions: [
      {
        location: {
          type: {
            type: String,
            enum: ["Point"],
            default: "Point",
          },
          coordinates: {
            type: [Number], // [lng, lat]
            required: true,
          },
        },
        radius: {
          type: Number,
          required: true,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    targetStates: [
      {
        type: String,
      },
    ],
    targetDistricts: [
      {
        type: String,
      },
    ],
    isAdOn: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

surveyAdSchema.index({ "targetRegions.location": "2dsphere" });

export const SurveyAd = mongoose.model("SurveyAd", surveyAdSchema);
