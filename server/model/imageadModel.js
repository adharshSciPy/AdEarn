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
  },
  totalViewCount:{
    type:Number,
    default:0
  },
  userViewNeeded:{
    
  }
}, { timestamps: true });

export const ImageAd = mongoose.model('ImageAd', imageAd);
