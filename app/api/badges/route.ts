import { NextRequest } from 'next/server'
import { UserChallengeBadge } from '@/app/models/UserChallengeBadge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const skip = (page - 1) * limit

    const [badges, total] = await Promise.all([
      UserChallengeBadge.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      UserChallengeBadge.countDocuments({ userId })
    ])

    return new Response(JSON.stringify({
      badges,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error fetching user badges:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 