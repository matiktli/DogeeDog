import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { DailyTip } from '@/app/models/DailyTip'
import dbConnect from '@/app/lib/mongodb'

export async function GET() {
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

    const tips = await DailyTip.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    return NextResponse.json(tips)
  } catch (error: any) {
    console.error('Error fetching tips:', error)
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 