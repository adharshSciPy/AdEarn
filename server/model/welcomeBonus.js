import mongoose from 'mongoose';

const bonusTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  starsGiven: {
    type: Number,
    required: true,
  },
  givenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The superadmin
    required: true,
  },
  reason: {
    type: String,
    default: 'Welcome Bonus',
  },
}, { timestamps: true });

export default('BonusTransaction', bonusTransactionSchema);
