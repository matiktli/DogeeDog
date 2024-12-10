import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { DogChallenge } from '@/app/models/DogChallenge'
import { Dog } from '@/app/models/Dog'
import dbConnect from '@/app/lib/mongodb'

export async function POST(req: Request) {
  try {
    // Connect to database first
    await dbConnect()

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // Get request body
    const body = await req.json()
    const { challengeId, dogIds } = body

    // Validate required fields
    if (!challengeId || !dogIds || !Array.isArray(dogIds) || dogIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Verify all dogs belong to the user
    const dogs = await Dog.find({
      _id: { $in: dogIds },
      userId: session.user.id
    })

    if (dogs.length !== dogIds.length) {
      return NextResponse.json(
        { error: 'Unauthorized access to one or more dogs' },
        { status: 403 }
      )
    }

    // Create dog challenges
    const dogChallenges = await Promise.all(
      dogIds.map(async (dogId) => {
        try {
          return await DogChallenge.create({
            dogId,
            challengeId,
            progress: {
              goal: 1,
              current: 0
            },
            createdBy: session.user.id
          })
        } catch (error: any) {
          // Handle duplicate entries gracefully
          if (error.code === 11000) {
            return null
          }
          throw error
        }
      })
    )

    // Filter out null values (duplicates)
    const createdChallenges = dogChallenges.filter(challenge => challenge !== null)

    return NextResponse.json({
      message: 'Challenges accepted successfully',
      created: createdChallenges.length,
      challenges: createdChallenges
    })

  } catch (error) {
    console.error('Error accepting challenges:', error)
    return NextResponse.json(
      { error: 'Failed to accept challenges' },
      { status: 500 }
    )
  }
} 