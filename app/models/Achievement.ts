import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  name: string;
  description: string;
  target: number;
  rewardIcon: string;
  reward: number;
  key: string;
}

const AchievementSchema = new Schema<IAchievement>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  target: { type: Number, required: true },
  rewardIcon: { type: String, required: true },
  reward: { type: Number, required: true },
  key: { type: String, required: true, unique: true, uppercase: true }
});

export const Achievement = mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema); 