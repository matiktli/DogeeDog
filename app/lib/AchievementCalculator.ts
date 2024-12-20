import { DogChallenge } from '../types/dogchallenge';
import { AchievementManager } from './AchievementManager';
import { Achievement } from '../models/Achievement';
import { DogChallenge as DogChallengeDb } from '../models/DogChallenge';
import { UserChallengeBadge } from '../models/UserChallengeBadge';

export class AchievementCalculator {
  /**
   * Updates achievement progress based on challenge completion
   */
  static async updateAchievementProgress(
    userId: string,
    dogChallenge: DogChallenge
  ): Promise<void> {
    try {
      const achievements = await Achievement.find();
      
      console.log("Attempting to update achievements for user", userId, "with challenge", dogChallenge);
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
                  const completedCount = await DogChallengeDb.countDocuments({
                    userId,
                    completedDate: { $exists: true }
                  });
                  await AchievementManager.updateUserAchievementProgress(
                    achievement,
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
                    achievement,
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
                    achievement,
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
                  await this.updateWeekendProgress(userId, achievement);
                } catch (error) {
                  console.error(`Error updating weekend progress for user ${userId}, achievement ${achievement.key}:`, error);
                }
              }
              break;

            case 'EARLY_RISER_5_DAYS':
              if (dogChallenge.completedDate && this.isEarlyMorning()) {
                try {
                  await this.updateEarlyRiserProgress(userId, achievement);
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
                    achievement,
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

      const completedToday = await DogChallengeDb.countDocuments({
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
      const challenges = await DogChallengeDb.find({
        userId,
        completedDate: { $exists: true }
      }).sort({ completedDate: -1 });

      if (challenges.length === 0) return 0;

      let currentStreak = 1;
      let lastDate = new Date(challenges[0].completedDate!);
      lastDate.setHours(0, 0, 0, 0);

      for (let i = 1; i < challenges.length; i++) {
        const currentDate = new Date(challenges[i].completedDate!);
        currentDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak++;
          lastDate = currentDate;
        } else {
          break;
        }
      }

      return currentStreak;
    } catch (error) {
      console.error(`Error calculating streak for user ${userId}:`, error);
      return 0;
    }
  }

  private static async countUniqueBadges(userId: string): Promise<number> {
    try {
      const uniqueBadges = await UserChallengeBadge.distinct('icon', { userId });
      return uniqueBadges.length;
    } catch (error) {
      console.error(`Error counting unique badges for user ${userId}:`, error);
      return 0;
    }
  }

  private static async updateWeekendProgress(userId: string, achievement: any): Promise<void> {
    try {
      // Get all completed weekend challenges
      const weekendChallenges = await DogChallengeDb.find({
        userId,
        completedDate: { $exists: true }
      });

      // Filter and count challenges completed on weekends
      const weekendCount = weekendChallenges.filter(challenge => {
        const completedDate = new Date(challenge.completedDate!);
        const day = completedDate.getDay();
        return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
      }).length;

      await AchievementManager.updateUserAchievementProgress(
        achievement._id,
        userId,
        weekendCount
      );
    } catch (error) {
      console.error(`Error updating weekend progress for user ${userId}, achievement ${achievement._id}:`, error);
    }
  }

  private static async updateEarlyRiserProgress(userId: string, achievement: any): Promise<void> {
    try {
      // Get all completed challenges
      const challenges = await DogChallengeDb.find({
        userId,
        completedDate: { $exists: true }
      });

      // Count early morning completions
      const earlyMorningCount = challenges.filter(challenge => {
        const completedDate = new Date(challenge.completedDate!);
        return completedDate.getHours() < 8;
      }).length;

      await AchievementManager.updateUserAchievementProgress(
        achievement._id,
        userId,
        earlyMorningCount
      );
    } catch (error) {
      console.error(`Error updating early riser progress for user ${userId}, achievement ${achievement._id}:`, error);
    }
  }

  private static async updateNightOwlProgress(userId: string, achievement: any): Promise<void> {
    try {
      // Get all completed challenges
      const challenges = await DogChallengeDb.find({
        userId,
        completedDate: { $exists: true }
      });

      // Count night time completions
      const nightTimeCount = challenges.filter(challenge => {
        const completedDate = new Date(challenge.completedDate!);
        return completedDate.getHours() >= 21;
      }).length;

      await AchievementManager.updateUserAchievementProgress(
        achievement._id,
        userId,
        nightTimeCount
      );
    } catch (error) {
      console.error(`Error updating night owl progress for user ${userId}, achievement ${achievement._id}:`, error);
    }
  }
} 