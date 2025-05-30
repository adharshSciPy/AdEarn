// import mongoose from 'mongoose';

// const videoAdSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   videoUrl: {
//     type: String,
//     required: true,
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: false,
//   },
// }, { timestamps: true });

// export const VideoAd = mongoose.model('VideoAd', videoAdSchema);
import mongoose from "mongoose";
import { type } from "os";

const videoAd = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    isAdVerified: {
      type: Boolean,
      default: false,
    },
    totalViewCount: {
      type: Number,
      default: 0,
    },
    userViewsNeeded: {
      type: Number,
      required: true,
    },
    // to check if the views reached or not
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
            type: [Number], // [longitude, latitude]
            required: true,
          },
        },
        radius: {
          type: Number,
          required: true,
        },
      }
    ],

  },
  { timestamps: true }
);
videoAd.index({ 'targetRegions.location': '2dsphere' });

export const VideoAd = mongoose.model("VideoAd", videoAd);
