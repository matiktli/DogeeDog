import { connectToDatabase } from './db';
import { populateAchievements } from './populateAchievements';

let initialized = false;

export async function initializeServer() {
  if (initialized) return;
  
  try {
    await connectToDatabase();
    await populateAchievements();
    initialized = true;
  } catch (error) {
    console.error('Server initialization error:', error);
    // Don't throw to prevent app from crashing
  }
} 