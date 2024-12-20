import { NextRequest } from 'next/server'
import { DogChallenge } from '@/app/models/DogChallenge'
import { UserChallengeBadge } from '@/app/models/UserChallengeBadge'
import { revalidateActivityCache } from '@/app/lib/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { Challenge } from '@/app/models/Challenge';
import { AchievementCalculator } from '@/app/lib/AchievementCalculator';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    const url = request.nextUrl;
    const dogChallengeId = url.pathname.split('/').pop();
    
    const body = await request.json()
    const { progress } = body

    // First, get the current challenge to check the goal
    const dogChallenge = await DogChallenge.findById(dogChallengeId)
    const challenge = await Challenge.findById(dogChallenge.challengeId)

    if (!dogChallenge) {
      return new Response(JSON.stringify({ error: 'Challenge not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Prepare update object
    const updateObj: any = {
      'progress.current': progress
    }

    // If the new progress meets or exceeds the goal and it wasn't completed before,
    // set the completedDate and create a badge
    if (progress >= dogChallenge.progress.goal && !dogChallenge.completedDate) {
      updateObj.completedDate = new Date()
      
      // Create new badge
      await UserChallengeBadge.create({
        userId: session?.user.id,
        icon: challenge.icon
      })
    }

    // Update the challenge progress using Mongoose model
    const updatedDogChallenge = await DogChallenge.findByIdAndUpdate(
      dogChallengeId,
      {
        $set: updateObj
      },
      { new: true }
    )

    // Update achievements based on challenge progress
    await AchievementCalculator.updateAchievementProgress(
      session?.user.id as string,
      updatedDogChallenge
    );

    // After successfully updating the challenge
    revalidateActivityCache()

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error updating dog challenge:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}