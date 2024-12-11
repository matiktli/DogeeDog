import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import User from '@/app/models/User'
import { Dog } from '@/app/models/Dog'
import { Challenge } from '@/app/models/Challenge'
import { DogChallenge } from '@/app/models/DogChallenge'
import connectDB from '@/app/lib/mongodb'

export async function GET(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const url = new URL(request.url)
    const searchParams = url.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('size') || '10')
    const type = searchParams.get('type')
    const userId = searchParams.get('userId')
    const challengeId = searchParams.get('challengeId')

    const skip = (page - 1) * limit

    let activities = []
    let total = 0

    switch (type) {
      case 'NEW_DOG': {
        // Fetch new dog creations
        const query = userId ? { userId } : {}
        const [dogs, count] = await Promise.all([
          Dog.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
          Dog.countDocuments(query)
        ])

        // Get user details for each dog
        const userIds = [...new Set(dogs.map(dog => dog.userId))]
        const users = await User.find({ _id: { $in: userIds } })
          .select('-passwordHash -email')
          .select('name imageUrl')
          .lean()
        
        const usersMap = new Map(users.map((user: any) => [user._id.toString(), user]))

        activities = dogs.map(dog => ({
          type: 'NEW_DOG',
          user: usersMap.get(dog.userId),
          dog,
          createdAt: dog.createdAt
        }))
        total = count
        break
      }

      case 'NEW_CHALLENGE': {
        // Fetch new challenge creations
        const query = userId ? { createdBy: userId } : {}
        const [challenges, count] = await Promise.all([
          Challenge.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
          Challenge.countDocuments(query)
        ])

        // Get user details for each challenge
        const userIds = [...new Set(challenges.map(challenge => challenge.createdBy))]
        const users = await User.find({ _id: { $in: userIds } })
          .select('-passwordHash -email')
          .select('name imageUrl')
          .lean()
        
        const usersMap = new Map(users.map((user: any) => [user._id.toString(), user]))

        activities = challenges.map(challenge => ({
          type: 'NEW_CHALLENGE',
          user: usersMap.get(challenge.createdBy),
          challenge,
          createdAt: challenge.createdAt
        }))
        total = count
        break
      }

      case 'CHALLENGE_ACCEPTED': {
        // Build query for dog challenges
        const query: any = {}
        if (userId) query.createdBy = userId
        if (challengeId) query.challengeId = challengeId

        const [dogChallenges, count] = await Promise.all([
          DogChallenge.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
          DogChallenge.countDocuments(query)
        ])

        // Get user details
        const userIds = [...new Set(dogChallenges.map(dc => dc.createdBy))]
        const users = await User.find({ _id: { $in: userIds } })
          .select('-passwordHash -email')
          .select('name imageUrl')
          .lean()
        
        const usersMap = new Map(users.map((user: any) => [user._id.toString(), user]))

        // Get dogs and challenges details
        const dogIds = dogChallenges.map(dc => dc.dogId)
        const challengeIds = dogChallenges.map(dc => dc.challengeId)

        const [dogs, challenges] = await Promise.all([
          Dog.find({ _id: { $in: dogIds } })
            .select('name imageUrl')
            .lean(),
          Challenge.find({ _id: { $in: challengeIds } })
            .select('title icon')
            .lean()
        ])

        const dogsMap = new Map(dogs.map((dog: any) => [dog._id.toString(), dog]))
        const challengesMap = new Map(challenges.map((challenge: any) => [challenge._id.toString(), challenge]))

        activities = dogChallenges.map(dogChallenge => ({
          type: 'CHALLENGE_ACCEPTED',
          user: usersMap.get(dogChallenge.createdBy),
          dogChallenge,
          dog: dogsMap.get(dogChallenge.dogId),
          challenge: challengesMap.get(dogChallenge.challengeId),
          createdAt: dogChallenge.createdAt
        }))
        total = count
        break
      }

      default:
        return NextResponse.json(
          { error: 'Invalid activity type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      activities,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    )
  }
} 