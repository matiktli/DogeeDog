'use client'

import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { useState, useEffect, use } from 'react'
import PetFormModal from '@/app/components/PetFormModal'
import LoadingScreen from '@/app/components/LoadingScreen'

interface PageProps {
  params: Promise<{ id: string }>
}

interface Dog {
  _id: string;
  name: string;
  breed: string;
  gender: string;
  imageUrl: string;
  userId: string;
}

export default function EditDogPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const [dog, setDog] = useState<Dog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    },
  })

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const response = await fetch(`/api/dogs/${resolvedParams.id}`)
        if (!response.ok) throw new Error('Failed to fetch dog')
        const data = await response.json()
        setDog(data)
      } catch (error) {
        console.error('Error fetching dog:', error)
        router.replace('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchDog()
    }
  }, [resolvedParams.id, session?.user?.id, router])

  const handleClose = () => {
    // Replace the current URL instead of adding to history
    router.replace('/dashboard')
  }

  if (status === "loading" || isLoading) {
    return <LoadingScreen />
  }

  if (!dog) return null

  return (
    <PetFormModal
      isOpen={true}
      onClose={handleClose}
      initialData={{
        id: dog._id,
        name: dog.name,
        breed: dog.breed,
        gender: dog.gender,
        imageUrl: dog.imageUrl
      }}
    />
  )
} 