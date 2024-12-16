import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import User from '@/app/models/User'
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

    const { searchParams } = new URL(request.url)
    
    // Handle both specific user IDs and paginated search
    const userIds = searchParams.get('ids')?.split(',') || []
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('name') || ''

    const skip = (page - 1) * limit

    let query = {}
    
    if (userIds.length) {
      query = { _id: { $in: userIds } }
    } else if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .skip(skip)
        .limit(limit)
        .select('name email image'),
      User.countDocuments(query)
    ])

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    })
  } catch (error) {
    console.error('Error listing users:', error)
    return NextResponse.json(
      { error: 'Failed to list users' },
      { status: 500 }
    )
  }
} 