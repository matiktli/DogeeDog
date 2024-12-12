import mongoose from 'mongoose'

const dogChallengeSchema = new mongoose.Schema({
  dogId: {
    type: String,
    required: true,
    index: true
  },
  challengeId: {
    type: String,
    required: true,
    index: true
  },
  progress: {
    goal: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true,
      default: 0
    }
  },
  completedDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    required: true,
    index: true
  }
})

// Create compound index for unique dog-challenge combinations
dogChallengeSchema.index({ dogId: 1, challengeId: 1 }, { unique: true })

export const DogChallenge = mongoose.models.DogChallenge || mongoose.model('DogChallenge', dogChallengeSchema) 