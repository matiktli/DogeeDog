import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { DogChallenge } from '@/app/models/DogChallenge'
import dbConnect from '@/app/lib/mongodb'

export async function GET(req: Request) {
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

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const dogIds = searchParams.get('dogIds')?.split(',')
    const challengeIds = searchParams.get('challengeIds')?.split(',')
    const createdBy = searchParams.get('createdBy')
    const completed = searchParams.get('completed')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')

    // Build query
    const query: any = {}

    if (dogIds?.length) {
      query.dogId = { $in: dogIds }
    }

    if (challengeIds?.length) {
      query.challengeId = { $in: challengeIds }
    }

    if (createdBy) {
      query.createdBy = createdBy
    }

    if (completed !== null) {
      const isCompleted = completed === 'true'
      if (isCompleted) {
        query.$expr = { $eq: ['$progress.current', '$progress.goal'] }
      } else {
        query.$expr = { $lt: ['$progress.current', '$progress.goal'] }
      }
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize

    // Fetch dog challenges with pagination
    const [dogChallenges, total] = await Promise.all([
      DogChallenge.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      DogChallenge.countDocuments(query)
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / pageSize)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return NextResponse.json({
      dogChallenges,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems: total,
        hasNextPage,
        hasPreviousPage
      }
    })

  } catch (error) {
    console.error('Error fetching dog challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dog challenges' },
      { status: 500 }
    )
  }
} 