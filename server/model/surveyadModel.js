import mongoose from "mongoose";

const surveyAdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    audioUrl: { type: String },

    questions: [
      {
        questionText: { type: String, required: true },
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
                return val.length === 2 && val.includes("Yes") && val.includes("No");
              }
              return val.length >= 2;
            },
            message: "Invalid options for the question type.",
          },
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    userViewsNeeded: { type: Number, required: true },
    totalViewCount: { type: Number, default: 0 },
    isViewsReached: { type: Boolean, default: false },

    isAdVerified: { type: Boolean, default: false },
    isAdRejected: { type: Boolean, default: false },
    adRejectionReason: { type: String },
    adRejectedTime: { type: Date },
    adVerifiedTime: { type: Date },
    adExpirationTime: { type: Date },

    isAdVisible: { type: Boolean, default: true },
    isAdOn: { type: Boolean, default: true },

    adPeriod: { type: Number },
    adRepetition: { type: Boolean, default: false },
    adRepeatSchedule: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        viewsRepatitionCount: { type: Number, default: 0 },
        nextScheduledAt: { type: Date },
      },
    ],

    viewersRewarded: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        starsGiven: Number,
      },
    ],

    totalStarsAllocated: { type: Number, required: true },
    starPayoutPlan: { type: [Number], default: [] },

    targetRegions: [
      {
        location: {
          type: {
            type: String,
            enum: ["Point"],
            default: "Point",
          },
          coordinates: { type: [Number], required: true }, // [lng, lat]
        },
        radius: { type: Number, required: true },
      },
    ],
    targetStates: [String],
    targetDistricts: [String],

    assignedAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    assignmentTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

surveyAdSchema.index({ "targetRegions.location": "2dsphere" });

export const SurveyAd = mongoose.model("SurveyAd", surveyAdSchema);
