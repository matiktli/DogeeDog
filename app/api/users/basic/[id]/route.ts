import { NextResponse } from 'next/server'
import User from '@/app/models/User'
import connectDB from '@/app/lib/mongodb'

export async function GET(
  request: Request
): Promise<NextResponse> {
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop()

  try {
    await connectDB()

    const user = await User.findById(id).select('name imageUrl')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      imageUrl: user.imageUrl
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
} 