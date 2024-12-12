import { NextRequest } from 'next/server'
import { DogChallenge } from '@/app/models/DogChallenge'

export async function PATCH(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const dogChallengeId = url.pathname.split('/').pop();

    
    const body = await request.json()
    const { progress } = body

    // Update the challenge progress using Mongoose model
    const result = await DogChallenge.findByIdAndUpdate(
      dogChallengeId,
      {
        $set: {
          'progress.current': progress
        }
      },
      { new: true }
    )

    if (!result) {
      return new Response(JSON.stringify({ error: 'Challenge not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

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