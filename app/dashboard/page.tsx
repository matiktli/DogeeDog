'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import Loading from '@/app/components/Loading'
import PetFormModal from '@/app/components/PetFormModal'
import DogList from '@/app/components/DogList'
import Breadcrumb from '@/app/components/Breadcrumb'
import Link from 'next/link'
import ChallengeList from '@/app/challenges/ChallengeList'
import { Challenge } from '@/app/types/challenge'
import ChallengeFormModal from '@/app/challenges/ChallengeFormModal'
import { useRouter } from 'next/navigation'
import UserFormModal from '@/app/components/UserFormModal'
import ActivityHeatMap from '@/app/components/ActivityHeatMap'
import UserProfileSection from '@/app/components/UserProfileSection'
import { DailyTipsSlider } from '@/app/components/DailyTipsSlider'

interface Dog {
  _id: string
  name: string
  breed: string
  gender: string
  imageUrl: string
  userId: string
}

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dogs, setDogs] = useState<Dog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([])

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

  useEffect(() => {
    const fetchActiveChallenges = async () => {
      if (!session?.user?.id) return

      try {
        // First fetch incomplete dog challenges
        const dogChallengesResponse = await fetch(`/api/challenges/dogs?createdBy=${session.user.id}&completed=false`)
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

    fetchActiveChallenges()
  }, [session?.user?.id])

  useEffect(() => {
    const fetchCompletedChallenges = async () => {
      if (!session?.user?.id) return

      try {
        // Fetch completed dog challenges
        const dogChallengesResponse = await fetch(`/api/challenges/dogs?createdBy=${session.user.id}&completed=true`)
        const dogChallengesData = await dogChallengesResponse.json()
        
        // Get unique challenge IDs
        const uniqueChallengeIds = Array.from(
          new Set(dogChallengesData.dogChallenges.map((dc: any) => dc.challengeId))
        )
        
        if (uniqueChallengeIds.length === 0) {
          setCompletedChallenges([])
          return
        }

        // Fetch the actual challenges
        const challengesPromises = uniqueChallengeIds.map(id =>
          fetch(`/api/challenges/${id}`).then(res => res.json())
        )
        const challenges = await Promise.all(challengesPromises)
        setCompletedChallenges(challenges)
      } catch (error) {
        console.error('Error fetching completed challenges:', error)
      }
    }

    fetchCompletedChallenges()
  }, [session?.user?.id])

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`)
          if (!response.ok) throw new Error('Failed to fetch user data')
          const data = await response.json()
          setUserData(data)
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }

    fetchUserData()
  }, [session?.user?.id])

  const handleScrollToCommunity = () => {
    router.push('/challenges#community-challenges')
  }

  return (
    <div className="min-h-screen p-6 pt-12 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-8">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Dashboard' }
          ]}
        />
        <div className="max-w-6xl mx-auto">
          {status === "loading" || isLoading ? (
            <Loading height="h-[50vh]" />
          ) : (
            <>
              <DailyTipsSlider />

              <h1 className="text-2xl font-bold mb-2">
                Hello, {session?.user?.name}!
              </h1>
              
              {userData ? (
                <UserProfileSection
                  user={userData}
                  isCurrentUser={true}
                  onEditClick={() => setShowEditModal(true)}
                />
              ) : (
                <div className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
                  <Loading height="h-[200px]" />
                </div>
              )}

              <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Activity</h2>
                </div>
                <div className="w-full">
                  <ActivityHeatMap userId={session.user.id} />
                </div>
              </section>

              <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Active Challenges</h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowChallengeModal(true)}
                      className="text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
                    >
                      Create New
                    </button>
                    <Link 
                      href="/challenges/filtered?type=active"
                      className="text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
                    >
                      View All
                    </Link>
                  </div>
                </div>
                {activeChallenges.length === 0 ? (
                  <div className="text-center py-12 bg-white/40 dark:bg-black/10 rounded-3xl backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-2">No Active Challenges</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Ready to push yourself? Take on a new challenge or explore what others are doing!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      onClick={() => setShowChallengeModal(true)}
                      className="px-6 py-3 font-medium border-2 border-[var(--accent)] text-[var(--accent)] 
                        rounded-xl hover:bg-[var(--accent)]/10 transition-colors"
                    >
                      Create Challenge
                    </button>
                    <button
                      onClick={handleScrollToCommunity}
                      className="px-6 py-3 font-medium border-2 border-[var(--accent)] text-[var(--accent)] 
                        rounded-xl hover:bg-[var(--accent)]/10 transition-colors"
                    >
                      View Community Challenges
                    </button>
                  </div>
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

              <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Completed Challenges</h2>
                  <Link 
                    href="/challenges/filtered?type=completed"
                    className="text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
                  >
                    View All
                  </Link>
                </div>
                {completedChallenges.length === 0 ? (
                  <div className="text-center py-12 bg-white/40 dark:bg-black/10 rounded-3xl backdrop-blur-sm">
                    <h3 className="text-xl font-semibold mb-2">No Completed Challenges Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Complete your active challenges to see them here!
                    </p>
                  </div>
                ) : (
                  <ChallengeList
                    challenges={completedChallenges}
                    title="Completed Challenges"
                    singleRow={true}
                    isLoading={isLoading}
                  />
                )}
              </section>

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
            </>
          )}
        </div>
      </div>

      <ChallengeFormModal
        isOpen={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
        onSuccess={async () => {
          if (session?.user?.id) {
            // Fetch active challenges
            const activeDogChallengesResponse = await fetch(`/api/challenges/dogs?createdBy=${session.user.id}&completed=false`)
            const activeDogChallengesData = await activeDogChallengesResponse.json()
            
            const activeUniqueIds = Array.from(
              new Set(activeDogChallengesData.dogChallenges.map((dc: any) => dc.challengeId))
            )
            
            if (activeUniqueIds.length > 0) {
              const activeChallengesPromises = activeUniqueIds.map(id =>
                fetch(`/api/challenges/${id}`).then(res => res.json())
              )
              const activeChallenges = await Promise.all(activeChallengesPromises)
              setActiveChallenges(activeChallenges)
            } else {
              setActiveChallenges([])
            }

            // Fetch completed challenges
            const completedDogChallengesResponse = await fetch(`/api/challenges/dogs?createdBy=${session.user.id}&completed=true`)
            const completedDogChallengesData = await completedDogChallengesResponse.json()
            
            const completedUniqueIds = Array.from(
              new Set(completedDogChallengesData.dogChallenges.map((dc: any) => dc.challengeId))
            )
            
            if (completedUniqueIds.length > 0) {
              const completedChallengesPromises = completedUniqueIds.map(id =>
                fetch(`/api/challenges/${id}`).then(res => res.json())
              )
              const completedChallenges = await Promise.all(completedChallengesPromises)
              setCompletedChallenges(completedChallenges)
            } else {
              setCompletedChallenges([])
            }
          }
        }}
      />

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

      <UserFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
        }}
        initialData={{
          id: session?.user?.id || '',
          name: userData?.name || '',
          email: userData?.email || '',
          imageUrl: userData?.image,
          description: userData?.description
        }}
        onUpdate={() => {
          // Refresh user data after update
          if (session?.user?.id) {
            fetch(`/api/users/${session.user.id}`)
              .then(res => res.json())
              .then(data => setUserData(data))
              .catch(error => console.error('Error fetching user data:', error))
          }
        }}
      />
    </div>
  )
} 