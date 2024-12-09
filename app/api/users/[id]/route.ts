import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import User from '@/app/models/User'
import connectDB from '@/app/lib/mongodb'

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(id).select('-passwordHash')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.id !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await req.formData()
    const name = formData.get('name') as string
    const image = formData.get('image') as File | null

    // First, verify the user exists
    const existingUser = await User.findById(id)
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create update object
    const updateData = {
      name: name,
      imageUrl: existingUser.imageUrl
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