import mongoose from 'mongoose';

const surveyAdSchema = new mongoose.Schema({
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
        validate: [arr => arr.length >= 2, 'Each question must have at least 2 options'],
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
    // boolean state to check to display ads to user .(only if isViewsReached : false&&isAdsVisible :true &&isAdsVerified:true)
    isAdVisible: {
      type: Boolean,
      default: true,
    },
    adVerifiedTime: {
      type: Date,
      // required:true
    },
    adExpirationTime: {
      type: Date,
      // required:true
    },
    adPeriod: {
      type: Number,
      // required: true,
    },
    adRepetition: {
      type: Boolean,
      default:false
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
adPeriod: {
  type: Number,
},
adRepetition: {
  type: Boolean,
  default: false,
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
        enum: ['Point'],
        default: 'Point',
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
  }
],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
}, { timestamps: true });

surveyAdSchema.index({ 'targetRegions.location': '2dsphere' });

export const SurveyAd = mongoose.model('SurveyAd', surveyAdSchema);
