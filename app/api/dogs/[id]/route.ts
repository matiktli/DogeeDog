import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/app/lib/mongodb'
import { Dog } from '@/app/models/Dog'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
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

    const dog = await Dog.findById(params.id)
    
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dog = await Dog.findById(params.id)
    if (!dog) {
      return NextResponse.json({ error: 'Dog not found' }, { status: 404 })
    }

    // Verify ownership
    if (dog.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await req.json()
    const updatedDog = await Dog.findByIdAndUpdate(
      params.id,
      { 
        name: data.name,
        breed: data.breed,
        gender: data.gender
      },
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dog = await Dog.findById(params.id)
    if (!dog) {
      return NextResponse.json({ error: 'Dog not found' }, { status: 404 })
    }

    // Verify ownership
    if (dog.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await Dog.findByIdAndDelete(params.id)

    return NextResponse.json({ message: 'Dog deleted successfully' })
  } catch (error) {
    console.error('Error deleting dog:', error)
    return NextResponse.json(
      { error: 'Failed to delete dog' },
      { status: 500 }
    )
  }
} 