import mongoose from 'mongoose'

const userChallengeBadgeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
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

export const UserChallengeBadge = mongoose.models.UserChallengeBadge || 
  mongoose.model('UserChallengeBadge', userChallengeBadgeSchema) 