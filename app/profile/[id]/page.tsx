'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import { use } from 'react'
import Image from 'next/image'
import { Settings } from 'lucide-react'
import LoadingScreen from '@/app/components/LoadingScreen'
import UserFormModal from '@/app/components/UserFormModal'
import Breadcrumb from '@/app/components/Breadcrumb'
import Link from 'next/link'
import ChallengeList from '@/app/challenges/ChallengeList'
import { Challenge } from '@/app/types/challenge'
import DogCard from '@/app/components/DogCard'

interface UserData {
  _id: string
  name: string
  email?: string
  createdAt: string
  imageUrl?: string
  description?: string
}

interface Dog {
  _id: string
  name: string
  breed?: string
  imageUrl?: string
  gender?: string
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [user, setUser] = useState<UserData | null>(null)
  const [dogs, setDogs] = useState<Dog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    },
  })

  const isCurrentUser = session?.user?.id === resolvedParams.id

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${resolvedParams.id}?includeDogs=true`)
        if (!response.ok) throw new Error('Failed to fetch user')
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (resolvedParams.id) {
      fetchUser()
    }
  }, [resolvedParams.id])

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await fetch(`/api/dogs?userId=${resolvedParams.id}`)
        if (!response.ok) throw new Error('Failed to fetch dogs')
        const dogsData = await response.json()
        setDogs(dogsData)
      } catch (error) {
        console.error('Error fetching dogs:', error)
      }
    }

    if (resolvedParams.id) {
      fetchDogs()
    }
  }, [resolvedParams.id])

  useEffect(() => {
    const fetchActiveChallenges = async () => {
      try {
        // First fetch incomplete dog challenges for the profile user
        const dogChallengesResponse = await fetch(`/api/challenges/dogs?createdBy=${resolvedParams.id}&completed=false`)
        const dogChallengesData = await dogChallengesResponse.json()
        
        // Get unique challenge IDs
        const uniqueChallengeIds = Array.from(
          new Set(dogChallengesData.dogChallenges.map((dc: any) => dc.challengeId))
        )
        
        if (uniqueChallengeIds.length === 0) {
          setActiveChallenges([])
          return
        }

        // Fetch the actual challenges
        const challengesPromises = uniqueChallengeIds.map(id =>
          fetch(`/api/challenges/${id}`).then(res => res.json())
        )
        const challenges = await Promise.all(challengesPromises)
        setActiveChallenges(challenges)
      } catch (error) {
        console.error('Error fetching active challenges:', error)
      }
    }

    if (resolvedParams.id) {
      fetchActiveChallenges()
    }
  }, [resolvedParams.id])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!user) return null

  return (
    <div className="min-h-screen p-6 pt-12 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-8">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Community', href: '/community' },
            { label: isCurrentUser ? 'My Profile' : user.name }
          ]}
        />
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <LoadingScreen />
          ) : !user ? null : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold">
                  {isCurrentUser ? `Hello, ${user.name}!` : user.name}
                </h1>
                {isCurrentUser && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                )}
              </div>

              {/* User Profile Section */}
              <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  {user.imageUrl ? (
                    <div className="relative w-20 h-20">
                      <Image
                        src={user.imageUrl}
                        alt={user.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-2xl">
                      {user.name[0].toUpperCase()}
                    </div>
                  )}
                  <div className="space-y-2 text-[var(--foreground)]/80">
                    {isCurrentUser && user.email && (
                      <p className="text-[var(--foreground)]/60">{user.email}</p>
                    )}
                    <p><span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {/* Add About section */}
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">About</h3>
                  <p className="text-[var(--foreground)]/70">
                    {user.description || (isCurrentUser ? 
                      'Add a description to tell others about yourself and your pets!' : 
                      'No description available.')}
                  </p>
                  {isCurrentUser && !user.description && (
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="mt-2 text-sm text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
                    >
                      Add description
                    </button>
                  )}
                </div>
              </section>

              {/* Active Challenges Section */}
              <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Active Challenges</h2>
                  <Link 
                    href={`/challenges/filtered?type=active&userId=${resolvedParams.id}`}
                    className="text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
                  >
                    View All
                  </Link>
                </div>
                {activeChallenges.length === 0 ? (
                  <div className="text-center py-12 bg-white/40 dark:bg-black/10 rounded-3xl backdrop-blur-sm">
                    <h3 className="text-xl font-semibold mb-2">
                      {isCurrentUser ? 'No Active Challenges' : `${user.name} has no active challenges`}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {isCurrentUser 
                        ? 'Ready to push yourself? Take on a new challenge or explore what others are doing!'
                        : 'Check back later to see what challenges they take on.'}
                    </p>
                    {isCurrentUser && (
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button 
                          onClick={() => setShowEditModal(true)}
                          className="px-6 py-3 font-medium border-2 border-[var(--accent)] text-[var(--accent)] 
                            rounded-xl hover:bg-[var(--accent)]/10 transition-colors"
                        >
                          Create Challenge
                        </button>
                        <Link
                          href="/challenges#community-challenges"
                          className="px-6 py-3 font-medium border-2 border-[var(--accent)] text-[var(--accent)] 
                            rounded-xl hover:bg-[var(--accent)]/10 transition-colors"
                        >
                          View Community Challenges
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <ChallengeList
                    challenges={activeChallenges}
                    title="Active Challenges"
                    emptyStateType="active"
                    singleRow={true}
                    isLoading={isLoading}
                  />
                )}
              </section>

              {/* Furry Family Section */}
              <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-4">Furry Family</h2>
                {dogs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dogs.map((dog) => (
                      <DogCard
                        key={dog._id}
                        id={dog._id}
                        name={dog.name}
                        breed={dog.breed}
                        gender={dog.gender}
                        imageUrl={dog.imageUrl}
                        userId={user._id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/40 dark:bg-black/10 rounded-3xl backdrop-blur-sm">
                    <h3 className="text-xl font-semibold mb-2">
                      {isCurrentUser ? 'No Pets Added Yet' : `${user.name} hasn't added any pets yet`}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {isCurrentUser 
                        ? 'Add your furry family members to get started!'
                        : 'Check back later to meet their pets.'}
                    </p>
                  </div>
                )}
              </section>

              {/* Pet Statistics Section */}
              <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-4">Pet Statistics</h2>
                <p className="text-[var(--foreground)]/60">
                  Pet statistics coming soon...
                </p>
              </section>
            </>
          )}
        </div>
      </div>

      {showEditModal && isCurrentUser && (
        <UserFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          initialData={{
            id: user._id,
            name: user.name,
            email: user.email || '',
            imageUrl: user.imageUrl,
            description: user.description
          }}
          onUpdate={async () => {
            const response = await fetch(`/api/users/${resolvedParams.id}`)
            if (!response.ok) throw new Error('Failed to fetch user')
            const data = await response.json()
            setUser(data)
          }}
        />
      )}
    </div>
  )
} 