import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { AchievementManager } from '@/app/lib/AchievementManager';
import { initializeServer } from '@/app/lib/init';

export async function GET() {
  try {
    await initializeServer();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const progressList = await AchievementManager.fetchUserAchievementProgressList(
      session.user.id
    );

    return NextResponse.json(progressList);
  } catch (error) {
    console.error('Error fetching achievement progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievement progress' },
      { status: 500 }
    );
  }
} 