import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { Challenge } from '@/app/models/Challenge'
import dbConnect from '@/app/lib/mongodb'

export async function GET(req: Request) {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const period = searchParams.get('period')
    const createdBy = searchParams.get('createdBy')

    // Build query
    const query: {
      type?: string
      period?: string
      createdBy?: string |object
    } = {}

    if (type) query.type = type
    if (period) query.period = period
    if (createdBy) {
      // Handle the 'notme' special case
      if (createdBy === 'notme') {
        query.createdBy = { $ne: session.user.id }
      } else {
        query.createdBy = createdBy
      }
    }

    const challenges = await Challenge.find(query).sort({ createdAt: -1 })

    return NextResponse.json(challenges)
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await req.json()
    
    // Create challenge with the correct fields
    const challenge = await Challenge.create({
      title: data.title,           // Changed from name to title
      description: data.description,
      icon: data.icon,
      reward: data.reward,         // Make sure we're using reward
      type: 'USER',                // Always USER for user-created challenges
      period: data.period,         // Make sure period is included
      createdBy: session.user.id
    })

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error creating challenge:', error)
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    )
  }
} 