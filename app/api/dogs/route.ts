import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { Dog } from '@/app/models/Dog'
import dbConnect from '@/app/lib/mongodb'

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

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

    // Get form data
    const formData = await req.formData()
    const name = formData.get('name') as string
    const breed = formData.get('breed') as string
    const gender = formData.get('gender') as string
    const image = formData.get('image') as File

    // Validate required fields
    if (!name || !breed || !gender || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    try {
      // Upload image to S3
      const randomId = uuidv4()
      const key = `${process.env.NODE_ENV}/${randomId}/${image.name}`

      const buffer = Buffer.from(await image.arrayBuffer())
      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: image.type,
      }))

      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

      // Create dog record
      const dog = await Dog.create({
        userId: session.user.id,
        name,
        breed,
        gender,
        imageUrl,
        createdAt: new Date()
      })

      return NextResponse.json(dog)
    } catch (error) {
      console.error('Error processing request:', error)
      return NextResponse.json(
        { error: 'Failed to process request' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error connecting to database:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
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

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const name = searchParams.get('name')
    const breeds = searchParams.get('breeds')?.split(',')
    const gender = searchParams.get('gender')

    // Build query
    const query: {
      userId?: string;
      name?: RegExp;
      breed?: { $in: string[] };
      gender?: string;
    } = {}
    
    if (userId) query.userId = userId
    if (name) query.name = new RegExp(name, 'i')
    if (breeds?.length) query.breed = { $in: breeds }
    if (gender) query.gender = gender

    // Fetch dogs
    const dogs = await Dog.find(query).sort({ createdAt: -1 })

    return NextResponse.json(dogs)
  } catch (error) {
    console.error('Error fetching dogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dogs' },
      { status: 500 }
    )
  }
}