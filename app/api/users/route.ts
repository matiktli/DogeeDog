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

    const url = new URL(request.url)
    const searchParams = url.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('size') || '4')
    const name = searchParams.get('name') || ''

    const skip = (page - 1) * limit

    // Build the query
    const query: any = {}
    if (name) {
      query.name = { $regex: name, $options: 'i' }
    }

    // Execute query with pagination
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-passwordHash')
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 }),
      User.countDocuments(query)
    ])

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit)
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