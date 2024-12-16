import { NextRequest } from 'next/server'
import { UserChallengeBadge } from '@/app/models/UserChallengeBadge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('userId')

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const badgeCounts = await UserChallengeBadge.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$icon',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          icon: '$_id',
          count: 1
        }
      }
    ])

    return new Response(JSON.stringify(badgeCounts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error fetching badge counts:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 