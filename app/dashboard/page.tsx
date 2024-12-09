'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import { PlusCircle } from 'lucide-react'
import LoadingScreen from '@/app/components/LoadingScreen'
import AddPetModal from '@/app/components/AddPetModal'
import DogCard from '@/app/components/DogCard'

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

  const fetchDogs = async () => {
    try {
      const response = await fetch(`/api/dogs?userId=${session?.user?.id}`)
      if (!response.ok) throw new Error('Failed to fetch dogs')
      const data = await response.json()
      setDogs(data)
    } catch (error) {
      console.error('Error fetching dogs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchDogs()
    }
  }, [session?.user?.id])

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
          
          {dogs.length === 0 ? (
            <div className="bg-white dark:bg-black/20 rounded-2xl p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="p-4 rounded-full bg-[var(--background)] hover:bg-[var(--background)]/80 transition-colors"
                >
                  <PlusCircle className="w-12 h-12 text-[#8B4513]" />
                </button>
                <h3 className="text-lg font-medium">Add Your First Pup</h3>
                <p className="text-[var(--foreground)]/60 max-w-md">
                  Start building your furry family by adding your first dog. 
                  Click the plus icon to get started!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {dogs.map((dog) => (
                <DogCard
                  key={dog._id}
                  id={dog._id}
                  name={dog.name}
                  breed={dog.breed}
                  gender={dog.gender}
                  imageUrl={dog.imageUrl}
                  userId={dog.userId}
                  onDelete={() => fetchDogs()}
                />
              ))}
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group bg-white/50 dark:bg-black/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-white/80 dark:hover:bg-black/20 transition-all border-2 border-dashed border-gray-200 dark:border-gray-800 min-h-[300px]"
              >
                <div className="p-4 rounded-full bg-[var(--background)] group-hover:bg-[var(--background)]/80 transition-colors">
                  <PlusCircle className="w-8 h-8 text-[#8B4513] opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[var(--foreground)]/60 group-hover:text-[var(--foreground)]/80 transition-colors text-center">
                  Add Another Pup
                </p>
              </button>
            </div>
          )}
        </section>
      </div>

      <AddPetModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          fetchDogs()
        }}
      />
    </div>
  )
} 