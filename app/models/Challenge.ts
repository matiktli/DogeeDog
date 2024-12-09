import mongoose from 'mongoose'

const challengeSchema = new mongoose.Schema({
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
  reward: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['SYSTEM', 'USER']
  },
  period: {
    type: String,
    required: true,
    enum: ['DAY', 'WEEK']
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema) 