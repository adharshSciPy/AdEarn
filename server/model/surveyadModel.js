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
        validate: [arr => arr.length >= 3, 'Each question must have at least 3 options'],
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export const SurveyAd = mongoose.model('SurveyAd', surveyAdSchema);
