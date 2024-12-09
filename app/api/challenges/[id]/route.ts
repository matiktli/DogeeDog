import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import dbConnect from '@/app/lib/mongodb'
import { Challenge } from '@/app/models/Challenge'

export async function GET(request: Request): Promise<NextResponse> {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    const challenge = await Challenge.findById(id)

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error fetching challenge:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenge' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    const challenge = await Challenge.findById(id)
    
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Only allow updates to user-created challenges
    if (challenge.type === 'SYSTEM' || challenge.createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()
    const updatedChallenge = await Challenge.findByIdAndUpdate(
      id,
      {
        title: data.title,
        description: data.description,
        icon: data.icon,
        reward: data.reward,
        period: data.period,
        type: 'USER'
      },
      { new: true }
    )

    return NextResponse.json(updatedChallenge)
  } catch (error) {
    console.error('Error updating challenge:', error)
    return NextResponse.json(
      { error: 'Failed to update challenge' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    const challenge = await Challenge.findById(id)
    
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Only allow deletion of user-created challenges
    if (challenge.type === 'SYSTEM' || challenge.createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await Challenge.findByIdAndDelete(id)

    return NextResponse.json({ message: 'Challenge deleted successfully' })
  } catch (error) {
    console.error('Error deleting challenge:', error)
    return NextResponse.json(
      { error: 'Failed to delete challenge' },
      { status: 500 }
    )
  }
} 