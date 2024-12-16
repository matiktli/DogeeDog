import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { DailyTip } from '@/app/models/DailyTip'
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
    const { title, description, icon } = body

    // Validate required fields
    if (!title || !description || !icon) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    try {
      // Create tip record
      const tip = await DailyTip.create({
        title,
        description,
        icon,
        createdAt: new Date()
      })

      return NextResponse.json(tip)
    } catch (error) {
      console.error('Error processing request:', error)
      return NextResponse.json(
        { error: 'Failed to process request' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error connecting to database:', error)
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 