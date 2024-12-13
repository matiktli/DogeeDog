import { NextRequest } from 'next/server'
import { DogChallenge } from '@/app/models/DogChallenge'
import { revalidateActivityCache } from '../../../activity/route'

export async function PATCH(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const dogChallengeId = url.pathname.split('/').pop();
    
    const body = await request.json()
    const { progress } = body

    // First, get the current challenge to check the goal
    const challenge = await DogChallenge.findById(dogChallengeId)
    
    if (!challenge) {
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
    // set the completedDate
    if (progress >= challenge.progress.goal && !challenge.completedDate) {
      updateObj.completedDate = new Date()
    }

    // Update the challenge progress using Mongoose model
    await DogChallenge.findByIdAndUpdate(
      dogChallengeId,
      {
        $set: updateObj
      },
      { new: true }
    )

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