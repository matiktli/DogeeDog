'use client'

import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { useState, useEffect, useRef, use } from 'react'
import Image from 'next/image'
import { Settings, Edit, Trash2 } from 'lucide-react'
import LoadingScreen from '@/app/components/LoadingScreen'
import Breadcrumb from '@/app/components/Breadcrumb'
import DogChallengeList from '@/app/components/DogChallengeList'
import { DogChallenge } from '@/app/types/dogchallenge'
import { DEFAULT_DOG_AVATAR } from '@/app/config/constants'
import DogProfile from '@/components/DogProfile'

interface DogData {
  _id: string
  name: string
  breed: string
  gender: "male" | "female"
  imageUrl: string
  createdAt: string
  userId: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function DogPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const dogId = resolvedParams.id
  
  const [dog, setDog] = useState<DogData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [dogChallenges, setDogChallenges] = useState<DogChallenge[]>([])
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(true)

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    },
  })

  const isOwner = session?.user?.id === dog?.userId

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const response = await fetch(`/api/dogs/${dogId}`)
        if (!response.ok) throw new Error('Failed to fetch dog')
        const data = await response.json()
        setDog(data)
      } catch (error) {
        console.error('Error fetching dog:', error)
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchDog()
    }
  }, [dogId, session?.user?.id, router])

  useEffect(() => {
    const fetchDogChallenges = async () => {
      try {
        setIsLoadingChallenges(true)
        const response = await fetch(`/api/challenges/dogs?dogIds=${dogId}`)
        if (!response.ok) throw new Error('Failed to fetch challenges')
        const data = await response.json()
        setDogChallenges(data.dogChallenges)
      } catch (error) {
        console.error('Error fetching dog challenges:', error)
      } finally {
        setIsLoadingChallenges(false)
      }
    }

    if (dogId) {
      fetchDogChallenges()
    }
  }, [dogId])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this pet?')) {
      try {
        setIsDeleting(true)
        const response = await fetch(`/api/dogs/${dogId}`, {
          method: 'DELETE',
        })

        if (!response.ok) throw new Error('Failed to delete')
        
        router.push('/dashboard')
      } catch (error) {
        console.error('Error deleting dog:', error)
      } finally {
        setIsDeleting(false)
        setIsMenuOpen(false)
      }
    }
  }

  if (status === "loading" || isLoading) {
    return <LoadingScreen />
  }

  if (!dog) return null

  return (
    <div className="min-h-screen p-6 pt-12 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-8">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Dashboard', href: '/dashboard' },
            { label: dog?.name || 'Dog Profile' }
          ]}
        />
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-6">
            {isOwner && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={() => router.push(`/dogs/${dogId}/edit`)}
                      className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dog Profile Section */}
          <div className="bg-white dark:bg-black/20 rounded-2xl overflow-hidden shadow-lg">
            <div className="relative h-64 w-full">
              <Image
                src={dog.imageUrl || DEFAULT_DOG_AVATAR}
                alt={dog.name}
                fill
                className={`object-${dog.imageUrl ? 'cover' : 'contain'} p-8`}
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">{dog.name}</h1>
                <span className={`px-4 py-2 rounded-full text-sm ${
                  dog.gender === 'male' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' 
                    : 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300'
                }`}>
                  {dog.gender === 'male' ? '♂️ Male' : '♀️ Female'}
                </span>
              </div>
              
              <div className="space-y-2 text-[var(--foreground)]/80">
                <p><span className="font-medium">Breed:</span> {dog.breed}</p>
                <p><span className="font-medium">Joined:</span> {new Date(dog.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-black/20 rounded-2xl overflow-hidden shadow-lg mt-6 p-6">
            <DogProfile dog={dog} />
          </div>

          {/* Challenges Section */}
          <section className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Challenges</h2>
            </div>
            {isLoadingChallenges ? (
                <div className="flex justify-center items-center py-8">
                  <LoadingScreen />
                </div>
              ) : (
                <DogChallengeList dogChallenges={dogChallenges} singleRow={true} />
              )}
            
          </section>
        </div>
      </div>
    </div>
  )
} 