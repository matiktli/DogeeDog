import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import User from '@/app/models/User'
import connectDB from '@/app/lib/mongodb'
import { revalidateTag } from 'next/cache'

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const CACHE_TAG_USER = 'user'
const CACHE_TAG_USERS = 'users'

export async function GET(
  request: NextRequest
): Promise<NextResponse> {
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop()

  if (id && id !== 'users') {
    try {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      await connectDB()

      const user = await User.findById(id)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Only include email if the user is requesting their own profile
      const userResponse = {
        ...user.toObject(),
        passwordHash: undefined,
        email: session.user.id === id ? user.email : undefined
      }

      // Return cached response
      return NextResponse.json(userResponse, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'Tags': CACHE_TAG_USER
        },
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      )
    }
  }

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const searchParams = url.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('size') || '20')
    const name = searchParams.get('name') || ''

    const skip = (page - 1) * limit

    const query: any = {}
    if (name) {
      query.name = { $regex: name, $options: 'i' }
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-passwordHash')
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 }),
      User.countDocuments(query)
    ])

    // Return cached response for users list
    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit)
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=150',
        'Tags': CACHE_TAG_USERS
      },
    })
  } catch (error) {
    console.error('Error listing users:', error)
    return NextResponse.json(
      { error: 'Failed to list users' },
      { status: 500 }
    )
  }
}

export async function PUT(
    request: Request
) {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
  
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.id !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const name = formData.get('name') as string
    const image = formData.get('image') as File | null
    const description = formData.get('description') as string | null

    // First, verify the user exists
    const existingUser = await User.findById(id)
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create update object
    const updateData = {
      name: name,
      imageUrl: existingUser.imageUrl,
      description: description ? description : existingUser.description
    }

    if (image) {
      const randomId = uuidv4()
      const key = `${process.env.NODE_ENV}/users/${randomId}/${image.name}`

      const buffer = Buffer.from(await image.arrayBuffer())
      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: image.type,
      }))

      updateData.imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    }

    console.log('Existing user:', existingUser)
    console.log('Update data:', updateData)

    // Use updateOne instead of findByIdAndUpdate
    const result = await User.updateOne(
      { _id: id },
      { $set: updateData }
    )

    console.log('Update result:', result)

    // Fetch the updated user
    const updatedUser = await User.findById(id).select('-passwordHash')
    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    // After successful update, revalidate the cache
    revalidateTag(CACHE_TAG_USER)
    revalidateTag(CACHE_TAG_USERS)

    console.log('Updated user:', updatedUser)
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
} 