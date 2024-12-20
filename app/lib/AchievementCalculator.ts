import { DogChallenge } from '../models/DogChallenge';
import { AchievementManager } from './AchievementManager';
import { Achievement } from '../models/Achievement';

export class AchievementCalculator {
  /**
   * Updates achievement progress based on challenge completion
   */
  static async updateAchievementProgress(
    userId: string,
    dogChallenge: any
  ): Promise<void> {
    try {
      const achievements = await Achievement.find();
      
      for (const achievement of achievements) {
        try {
          switch (achievement.key) {
            case 'COMPLETE_1_CHALLENGES':
            case 'COMPLETE_3_CHALLENGES':
            case 'COMPLETE_5_CHALLENGES':
            case 'COMPLETE_10_CHALLENGES':
            case 'COMPLETE_25_CHALLENGES':
            case 'COMPLETE_50_CHALLENGES':
              if (dogChallenge.completedDate) {
                try {
                  const completedCount = await DogChallenge.countDocuments({
                    userId,
                    completedDate: { $exists: true }
                  });
                  await AchievementManager.updateUserAchievementProgress(
                    achievement._id,
                    userId,
                    completedCount
                  );
                } catch (error) {
                  console.error(`Error calculating completed challenges for user ${userId}, achievement ${achievement.key}:`, error);
                }
              }
              break;

            case 'STREAK_3_DAYS':
            case 'STREAK_7_DAYS':
            case 'STREAK_14_DAYS':
            case 'STREAK_30_DAYS':
            case 'STREAK_60_DAYS':
              if (dogChallenge.completedDate) {
                try {
                  const streak = await this.calculateStreak(userId);
                  await AchievementManager.updateUserAchievementProgress(
                    achievement._id,
                    userId,
                    streak
                  );
                } catch (error) {
                  console.error(`Error calculating streak for user ${userId}, achievement ${achievement.key}:`, error);
                }
              }
              break;

            case 'COLLECT_10_BADGES':
              if (dogChallenge.completedDate) {
                try {
                  const uniqueBadgesCount = await this.countUniqueBadges(userId);
                  await AchievementManager.updateUserAchievementProgress(
                    achievement._id,
                    userId,
                    uniqueBadgesCount
                  );
                } catch (error) {
                  console.error(`Error counting badges for user ${userId}, achievement ${achievement.key}:`, error);
                }
              }
              break;

            case 'WEEKEND_10_CONSECUTIVE':
            case 'WEEKEND_5_EXPLORE':
              if (dogChallenge.completedDate && this.isWeekend()) {
                try {
                  await this.updateWeekendProgress(userId, achievement._id);
                } catch (error) {
                  console.error(`Error updating weekend progress for user ${userId}, achievement ${achievement.key}:`, error);
                }
              }
              break;

            case 'EARLY_RISER_5_DAYS':
              if (dogChallenge.completedDate && this.isEarlyMorning()) {
                try {
                  await this.updateEarlyRiserProgress(userId, achievement._id);
                } catch (error) {
                  console.error(`Error updating early riser progress for user ${userId}, achievement ${achievement.key}:`, error);
                }
              }
              break;

            case 'NIGHT_OWL_3_DAYS':
            case 'NIGHT_OWL_6_DAYS':
            case 'NIGHT_OWL_9_DAYS':
              if (dogChallenge.completedDate && this.isNightTime()) {
                try {
                  await this.updateNightOwlProgress(userId, achievement._id);
                } catch (error) {
                  console.error(`Error updating night owl progress for user ${userId}, achievement ${achievement.key}:`, error);
                }
              }
              break;

            case 'TWO_CHALLENGES_ONE_DAY':
              if (dogChallenge.completedDate) {
                try {
                  const challengesCompletedToday = await this.countChallengesCompletedToday(userId);
                  await AchievementManager.updateUserAchievementProgress(
                    achievement._id,
                    userId,
                    challengesCompletedToday
                  );
                } catch (error) {
                  console.error(`Error counting daily challenges for user ${userId}, achievement ${achievement.key}:`, error);
                }
              }
              break;
          }
        } catch (error) {
          console.error(`Error processing achievement ${achievement.key} for user ${userId}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error in achievement calculation for user ${userId}:`, error);
    }
  }

  private static async countChallengesCompletedToday(userId: string): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completedToday = await DogChallenge.countDocuments({
        userId,
        completedDate: {
          $gte: today,
          $lt: tomorrow
        }
      });

      return completedToday;
    } catch (error) {
      console.error(`Error counting challenges completed today for user ${userId}:`, error);
      return 0;
    }
  }

  private static isWeekend(): boolean {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  }

  private static isEarlyMorning(): boolean {
    const hour = new Date().getHours();
    return hour < 8;
  }

  private static isNightTime(): boolean {
    const hour = new Date().getHours();
    return hour >= 21;
  }

  private static async calculateStreak(userId: string): Promise<number> {
    try {
      // Implementation pending
      return 0;
    } catch (error) {
      console.error(`Error calculating streak for user ${userId}:`, error);
      return 0;
    }
  }

  private static async countUniqueBadges(userId: string): Promise<number> {
    try {
      // Implementation pending
      return 0;
    } catch (error) {
      console.error(`Error counting unique badges for user ${userId}:`, error);
      return 0;
    }
  }

  private static async updateWeekendProgress(userId: string, achievementId: string): Promise<void> {
    try {
      // Implementation pending
    } catch (error) {
      console.error(`Error updating weekend progress for user ${userId}, achievement ${achievementId}:`, error);
    }
  }

  private static async updateEarlyRiserProgress(userId: string, achievementId: string): Promise<void> {
    try {
      // Implementation pending
    } catch (error) {
      console.error(`Error updating early riser progress for user ${userId}, achievement ${achievementId}:`, error);
    }
  }

  private static async updateNightOwlProgress(userId: string, achievementId: string): Promise<void> {
    try {
      // Implementation pending
    } catch (error) {
      console.error(`Error updating night owl progress for user ${userId}, achievement ${achievementId}:`, error);
    }
  }
} 