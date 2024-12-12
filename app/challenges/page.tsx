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

  useEffect(() => {
    if (session?.user?.id) {
      withLoading(fetchChallenges)
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

  return (
    <div className="min-h-screen p-6 pt-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-8">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Challenges' }
          ]}
        />
        {/* System Daily Challenges */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Daily Challenges</h2>
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
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Weekly Challenges</h2>
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
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Challenges</h2>
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
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Community Challenges</h2>
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