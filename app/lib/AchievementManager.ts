import { Achievement, IAchievement } from '../models/Achievement';
import { UserAchievementProgress, IUserAchievementProgress } from '../models/UserAchievementProgress';

export class AchievementManager {
  /**
   * Creates a new achievement in the database
   */
  static async createAchievement(achievementData: Omit<IAchievement, '_id'>): Promise<IAchievement> {
    try {
      const achievement = new Achievement(achievementData);
      await achievement.save();
      return achievement;
    } catch (error) {
      console.error('Error creating achievement:', error);
      throw error;
    }
  }

  /**
   * Creates a user achievement progress entry
   */
  static async createUserAchievementProgress(
    achievementId: string,
    userId: string
  ): Promise<IUserAchievementProgress> {
    try {
      const achievement = await Achievement.findById(achievementId);
      if (!achievement) {
        throw new Error('Achievement not found');
      }

      const userProgress = new UserAchievementProgress({
        userId,
        achievement: {
          name: achievement.name,
          description: achievement.description,
          target: achievement.target,
          rewardIcon: achievement.rewardIcon,
          reward: achievement.reward,
          key: achievement.key
        },
        progress: 0
      });

      await userProgress.save();
      return userProgress;
    } catch (error) {
      console.error('Error creating user achievement progress:', error);
      throw error;
    }
  }

  /**
   * Updates the progress of a user's achievement
   */
  static async updateUserAchievementProgress(
    achievement: any,
    userId: string,
    progress: number
  ): Promise<IUserAchievementProgress> {
    try {
      console.log("Attempting to update achievement progress for user", userId, "with achievement", achievement.key, "and progress", progress);

      const userProgress = await UserAchievementProgress.findOneAndUpdate(
        { userId, 'achievement.key': achievement.key },
        { progress },
        { new: true }
      );

      if (!userProgress) {
        throw new Error('User achievement progress not found');
      }

      return userProgress;
    } catch (error) {
      console.error('Error updating user achievement progress:', error);
      throw error;
    }
  }

  /**
   * Increments the progress of a user's achievement
   */
  static async incrementUserAchievementProgress(
    achievementId: string,
    userId: string
  ): Promise<IUserAchievementProgress> {
    try {
      const achievement = await Achievement.findById(achievementId);
      if (!achievement) {
        throw new Error('Achievement not found');
      }

      const userProgress = await UserAchievementProgress.findOneAndUpdate(
        { userId, 'achievement.key': achievement.key },
        { progress: { $inc: 1 } },
        { new: true }
      );

      if (!userProgress) {
        throw new Error('User achievement progress not found');
      }

      return userProgress;
    } catch (error) {
      console.error('Error updating user achievement progress:', error);
      throw error;
    }
  }

  /**
   * Fetches all achievement progress entries for a user
   */
  static async fetchUserAchievementProgressList(
    userId: string
  ): Promise<IUserAchievementProgress[]> {
    try {
      return await UserAchievementProgress.find({ userId });
    } catch (error) {
      console.error('Error fetching user achievement progress list:', error);
      throw error;
    }
  }

  /**
   * Creates achievement progress entries for all existing achievements for a new user
   */
  static async createUserAchievementProgressesForNewUser(
    userId: string
  ): Promise<IUserAchievementProgress[]> {
    try {
      const achievements = await Achievement.find();
      const progressEntries = await Promise.all(
        achievements.map(async (achievement) => {
          try {
            return await this.createUserAchievementProgress(achievement._id, userId);
          } catch (error) {
            console.error(`Error creating progress for achievement ${achievement._id}:`, error);
            return null;
          }
        })
      );

      return progressEntries.filter((entry): entry is IUserAchievementProgress => entry !== null);
    } catch (error) {
      console.error('Error creating user achievement progresses:', error);
      throw error;
    }
  }
} 