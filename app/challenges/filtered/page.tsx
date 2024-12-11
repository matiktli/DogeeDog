'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Challenge } from '@/app/types/challenge'
import ChallengeList from '../ChallengeList'
import Loading from '@/app/components/Loading'
import { useLoading } from '@/app/hooks/useLoading'
import ChallengeFormModal from '../ChallengeFormModal'
import Breadcrumb from '@/app/components/Breadcrumb'

function FilteredChallengesContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const { isLoading, withLoading } = useLoading()
  const [showModal, setShowModal] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | undefined>(undefined)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const getTitleByType = (type: string | null) => {
    switch (type) {
      case 'daily':
        return 'Daily Challenges'
      case 'weekly':
        return 'Weekly Challenges'
      case 'user':
        return 'Your Challenges'
      case 'community':
        return 'Community Challenges'
      default:
        return 'All Challenges'
    }
  }

  const fetchChallenges = async () => {
    try {
      let url = '/api/challenges?'
      switch (type) {
        case 'daily':
          url += 'type=SYSTEM&period=DAY'
          break
        case 'weekly':
          url += 'type=SYSTEM&period=WEEK'
          break
        case 'user':
          url += `type=USER&createdBy=${session?.user?.id}`
          break
        case 'community':
          url += 'type=USER&createdBy=notme'
          break
      }

      const response = await fetch(url)
      const data = await response.json()
      setChallenges(data)
    } catch (error) {
      console.error('Error fetching challenges:', error)
    }
  }

  useEffect(() => {
    if ((type !== 'user' && type !== undefined) || session?.user?.id) {
      withLoading(fetchChallenges)
    }
  }, [type, session?.user?.id])

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
    <div className="min-h-screen p-6 pt-12 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-8">
        <Breadcrumb 
          items={[
            { label: 'All Challenges', href: '/challenges' },
            { label: getTitleByType(type) }
          ]}
        />

        <h1 className="text-3xl font-bold mb-8">{getTitleByType(type)}</h1>
        
        {isLoading ? (
          <Loading height="h-[50vh]" />
        ) : (
          <ChallengeList
            challenges={challenges}
            title={getTitleByType(type)}
            emptyStateType={type === 'user' ? 'user' : 'system'}
            singleRow={false}
            showAddButton={type === 'user'}
            onAddClick={handleCreateChallenge}
            onChallengeDelete={handleModalSuccess}
          />
        )}

        <ChallengeFormModal
          isOpen={showModal}
          onClose={handleModalClose}
          initialData={selectedChallenge}
          onSuccess={handleModalSuccess}
        />
      </div>
    </div>
  )
}

export default function FilteredChallengesPage() {
  return (
    <Suspense fallback={<Loading height="h-screen" />}>
      <FilteredChallengesContent />
    </Suspense>
  )
} 