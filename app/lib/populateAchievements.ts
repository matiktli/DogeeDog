import { Achievement } from '../models/Achievement';
import achievements from '@/public/data/achievements.json';

export async function populateAchievements() {
  try {
    // Check if we already have achievements in the database
    const existingCount = await Achievement.countDocuments();
    if (existingCount > 0) {
      return;
    }

    // Insert all achievements
    await Achievement.insertMany(achievements);
    console.log('Successfully populated achievements');
  } catch (error) {
    console.error('Error populating achievements:', error);
    throw error;
  }
} 