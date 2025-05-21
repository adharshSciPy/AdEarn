import mongoose from 'mongoose';

const imageAd = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  isAdVerified:{
    type:Boolean,
    default:false
  }
}, { timestamps: true });

export const ImageAd = mongoose.model('ImageAd', imageAd);
