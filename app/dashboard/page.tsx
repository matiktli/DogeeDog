'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import LoadingScreen from '@/app/components/LoadingScreen'
import PetFormModal from '@/app/components/PetFormModal'
import DogList from '@/app/components/DogList'

interface Dog {
  _id: string
  name: string
  breed: string
  gender: string
  imageUrl: string
  userId: string
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dogs, setDogs] = useState<Dog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    },
  })

  useEffect(() => {
    if (session?.user?.id) {
      const fetchDogs = async () => {
        try {
          const response = await fetch(`/api/dogs?userId=${session.user.id}`)
          if (!response.ok) throw new Error('Failed to fetch dogs')
          const data = await response.json()
          setDogs(data)
        } catch (error) {
          console.error('Error fetching dogs:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchDogs();
    }
  }, [session?.user?.id]);

  if (status === "loading" || isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen p-6 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">
          Hello, {session?.user?.name}!
        </h1>
        
        <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">Your Furry Family</h2>
          
          <DogList 
            dogs={dogs}
            showAddButton={true}
            onAddClick={() => setIsModalOpen(true)}
            onDogDelete={async () => {
              if (session?.user?.id) {
                const response = await fetch(`/api/dogs?userId=${session.user.id}`)
                if (!response.ok) throw new Error('Failed to fetch dogs')
                const data = await response.json()
                setDogs(data)
              }
            }}
          />
        </section>
      </div>

      <PetFormModal 
        isOpen={isModalOpen}
        onClose={async () => {
          setIsModalOpen(false)
          if (session?.user?.id) {
            const response = await fetch(`/api/dogs?userId=${session.user.id}`)
            if (!response.ok) throw new Error('Failed to fetch dogs')
            const data = await response.json()
            setDogs(data)
          }
        }}
      />
    </div>
  )
} 