'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { Challenge } from '@/app/types/challenge'
import ChallengeList from './ChallengeList'
import { useLoading } from '@/app/hooks/useLoading'
import ChallengeFormModal from './ChallengeFormModal'
import Link from 'next/link'
import Breadcrumb from '@/app/components/Breadcrumb'
import { useSearchParams } from 'next/navigation'
import ChallengeViewModal from './ChallengeViewModal'
import Loading from '@/app/components/Loading'

function ChallengesContent() {
  const { data: session } = useSession()
  const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>([])
  const [weeklyChallenges, setWeeklyChallenges] = useState<Challenge[]>([])
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([])
  const [communityChallenges, setCommunityChallenges] = useState<Challenge[]>([])
  const { isLoading, withLoading } = useLoading()
  const [showModal, setShowModal] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | undefined>(undefined)
  const searchParams = useSearchParams()
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewChallenge, setViewChallenge] = useState<Challenge | undefined>(undefined)
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])

  const fetchChallenges = async () => {
    try {
      const [dailyData, weeklyData, userData, communityData] = await Promise.all([
        // System daily challenges
        fetch('/api/challenges?type=SYSTEM&period=DAY').then(res => res.json()),
        // System weekly challenges
        fetch('/api/challenges?type=SYSTEM&period=WEEK').then(res => res.json()),
        // User's own challenges
        fetch(`/api/challenges?type=USER&createdBy=${session?.user?.id}`).then(res => res.json()),
        // Community challenges (all USER type challenges except current user's)
        fetch('/api/challenges?type=USER&createdBy=notme').then(res => res.json())
      ])

      setDailyChallenges(dailyData)
      setWeeklyChallenges(weeklyData)
      setUserChallenges(userData)
      // Remove the filter since the backend will handle it
      setCommunityChallenges(communityData)
    } catch (error) {
      console.error('Error fetching challenges:', error)
    }
  }

  const fetchActiveChallenges = async () => {
    try {
      // First fetch incomplete dog challenges
      const dogChallengesResponse = await fetch(`/api/challenges/dogs?createdBy=${session?.user?.id}&completed=false`)
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

  useEffect(() => {
    if (session?.user?.id) {
      withLoading(async () => {
        await Promise.all([
          fetchActiveChallenges(),
          fetchChallenges()
        ])
      })
    }
  }, [session?.user?.id, withLoading])

  useEffect(() => {
    const challengeId = searchParams.get('challengeId')
    if (challengeId) {
      const fetchChallenge = async () => {
        try {
          const response = await fetch(`/api/challenges/${challengeId}`)
          if (!response.ok) throw new Error('Failed to fetch challenge')
          const challenge = await response.json()
          setViewChallenge(challenge)
          setViewModalOpen(true)
        } catch (error) {
          console.error('Error fetching challenge:', error)
        }
      }
      fetchChallenge()
    }
  }, [searchParams])

  const handleCreateChallenge = () => {
    setSelectedChallenge(undefined)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedChallenge(undefined)
  }

  const handleModalSuccess = () => {
    withLoading(fetchChallenges)
  }

  const handleScrollToCommunity = () => {
    const communitySection = document.querySelector('#community-challenges')
    if (communitySection) {
      communitySection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen p-6 pt-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-8">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Challenges' }
          ]}
        />
        
        {/* Active Challenges */}
        <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Active Challenges</h2>
            <Link 
              href="/challenges/filtered?type=active"
              className="text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
            >
              View All
            </Link>
          </div>
          <ChallengeList
            challenges={activeChallenges}
            title="Active Challenges"
            emptyStateType="active"
            singleRow={true}
            isLoading={isLoading}
            onAddClick={handleCreateChallenge}
            onViewCommunity={handleScrollToCommunity}
          />
        </section>

        {/* System Daily Challenges */}
        <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Daily Challenges</h2>
            <Link 
              href="/challenges/filtered?type=daily"
              className="text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
            >
              View All
            </Link>
          </div>
          <ChallengeList
            challenges={dailyChallenges}
            title="Daily Challenges"
            emptyStateType="system"
            singleRow={true}
            isLoading={isLoading}
          />
        </section>

        {/* System Weekly Challenges */}
        <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Weekly Challenges</h2>
            <Link 
              href="/challenges/filtered?type=weekly"
              className="text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
            >
              View All
            </Link>
          </div>
          <ChallengeList
            challenges={weeklyChallenges}
            title="Weekly Challenges"
            emptyStateType="system"
            singleRow={true}
            isLoading={isLoading}
          />
        </section>

        {/* User's Own Challenges */}
        {session?.user && (
          <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Challenges</h2>
              <Link 
                href="/challenges/filtered?type=user"
                className="text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
              >
                View All
              </Link>
            </div>
            <ChallengeList
              challenges={userChallenges}
              title="Your Challenges"
              emptyStateType="user"
              showAddButton={true}
              onAddClick={handleCreateChallenge}
              onChallengeDelete={handleModalSuccess}
              singleRow={true}
              isLoading={isLoading}
            />
          </section>
        )}

        {/* Community Challenges */}
        <section id="community-challenges" className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Community Challenges</h2>
            <Link 
              href="/challenges/filtered?type=community"
              className="text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
            >
              View All
            </Link>
          </div>
          <ChallengeList
            challenges={communityChallenges}
            title="Community Challenges"
            emptyStateType="system"
            singleRow={true}
            isLoading={isLoading}
          />
        </section>

        <ChallengeFormModal
          isOpen={showModal}
          onClose={handleModalClose}
          initialData={selectedChallenge}
          onSuccess={handleModalSuccess}
        />

        {/* Separate ChallengeViewModal */}
        {viewChallenge && (
          <ChallengeViewModal
            isOpen={viewModalOpen}
            onClose={() => {
              setViewModalOpen(false)
              setViewChallenge(undefined)
              // Clear the URL parameter when closing the modal
              if (window.history.pushState) {
                const newurl = window.location.pathname
                window.history.pushState({ path: newurl }, '', newurl)
              }
            }}
            challenge={viewChallenge}
          />
        )}
      </div>
    </div>
  )
}

export default function ChallengesPage() {
  return (
    <div>
      <Suspense fallback={<Loading height="h-screen" containerClassName="fixed inset-0" />}>
        <ChallengesContent />
      </Suspense>
    </div>
  )
} 