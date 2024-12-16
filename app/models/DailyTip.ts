import mongoose from 'mongoose'

const dailyTipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const DailyTip = mongoose.models.DailyTip || mongoose.model('DailyTip', dailyTipSchema) 