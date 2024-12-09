import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import dbConnect from '@/app/lib/mongodb'
import { Dog } from '@/app/models/Dog'

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const dog = await Dog.findById(context.params.id)
    
    if (!dog) {
      return NextResponse.json(
        { error: 'Dog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(dog)
  } catch (error) {
    console.error('Error fetching dog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dog' },
      { status: 500 }
    )
  }
} 

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dogId = await context.params.id
    const dog = await Dog.findById(dogId)
    
    if (!dog) {
      return NextResponse.json({ error: 'Dog not found' }, { status: 404 })
    }

    // Verify ownership
    if (dog.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Handle FormData instead of JSON
    const formData = await request.formData()
    const name = formData.get('name') as string
    const breed = formData.get('breed') as string
    const gender = formData.get('gender') as string
    const image = formData.get('image') as File | null

    const updateData: {
      name: string;
      breed: string;
      gender: string;
      imageUrl?: string;
    } = {
      name,
      breed,
      gender
    }

    // Handle image upload if provided
    if (image) {
      const randomId = uuidv4()
      const key = `${process.env.NODE_ENV}/${randomId}/${image.name}`

      const buffer = Buffer.from(await image.arrayBuffer())
      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: image.type,
      }))

      updateData.imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    }

    const updatedDog = await Dog.findByIdAndUpdate(
      dogId,
      updateData,
      { new: true }
    )

    return NextResponse.json(updatedDog)
  } catch (error) {
    console.error('Error updating dog:', error)
    return NextResponse.json(
      { error: 'Failed to update dog' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dog = await Dog.findById(context.params.id)
    if (!dog) {
      return NextResponse.json({ error: 'Dog not found' }, { status: 404 })
    }

    // Verify ownership
    if (dog.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await Dog.findByIdAndDelete(context.params.id)

    return NextResponse.json({ message: 'Dog deleted successfully' })
  } catch (error) {
    console.error('Error deleting dog:', error)
    return NextResponse.json(
      { error: 'Failed to delete dog' },
      { status: 500 }
    )
  }
} 