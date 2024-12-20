import mongoose, { Schema, Document } from 'mongoose';

export interface IUserAchievementProgress extends Document {
  userId: string;
  achievement: {
    name: string;
    description: string;
    target: number;
    rewardIcon: string;
    reward: number;
    key: string;
  };
  progress: number;
}

const UserAchievementProgressSchema = new Schema<IUserAchievementProgress>({
  userId: { type: String, required: true },
  achievement: {
    name: { type: String, required: true },
    description: { type: String, required: true },
    target: { type: Number, required: true },
    rewardIcon: { type: String, required: true },
    reward: { type: Number, required: true },
    key: { type: String, required: true }
  },
  progress: { type: Number, required: true, default: 0 }
});

// Create compound index for userId and achievement.key to ensure unique combinations
UserAchievementProgressSchema.index({ userId: 1, 'achievement.key': 1 }, { unique: true });

export const UserAchievementProgress = mongoose.models.UserAchievementProgress || 
  mongoose.model<IUserAchievementProgress>('UserAchievementProgress', UserAchievementProgressSchema); 