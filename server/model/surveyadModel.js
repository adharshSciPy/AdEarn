import mongoose from "mongoose";

const surveyAdSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    questions: [
      {
        questionText: {
          type: String,
          required: true,
        },
        questionType: {
          type: String,
          enum: ["yesno", "multiple"],
          required: true,
        },
        options: {
          type: [String],
          required: true,
          validate: {
            validator: function (val) {
              if (this.questionType === "yesno") {
                return (
                  val.length === 2 && val.includes("Yes") && val.includes("No")
                );
              }
              if (this.questionType === "multiple") {
                return val.length >= 2;
              }
              return false;
            },
            message: "Invalid options for the question type.",
          },
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
    audioUrl: {
      type: String,
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
    },
    targetStates: [String],
    targetDistricts: [String],
    isAdOn: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

surveyAdSchema.index({ "targetRegions.location": "2dsphere" });

export const SurveyAd = mongoose.model("SurveyAd", surveyAdSchema);
