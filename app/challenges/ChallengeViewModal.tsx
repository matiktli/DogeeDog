'use client'

import { useState, useEffect } from 'react'
import { X, Cookie } from 'lucide-react'
import { Challenge } from '@/app/types/challenge'
import GradientButton from '../components/GradientButton'
import DogSelectionModal from './DogSelectionModal'
import { Dog } from '@/app/types/dog'

interface ChallengeViewModalProps {
  challenge: Challenge
  isOpen: boolean
  onClose: () => void
}

export default function ChallengeViewModal({
  challenge,
  isOpen,
  onClose
}: ChallengeViewModalProps) {
  const [showDogSelection, setShowDogSelection] = useState(false)
  const [dogs, setDogs] = useState<Dog[]>([])
  const [isLoadingDogs, setIsLoadingDogs] = useState(true)

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setIsLoadingDogs(true)
        const response = await fetch('/api/dogs')
        const data = await response.json()
        setDogs(data)
      } catch (error) {
        console.error('Error fetching dogs:', error)
      } finally {
        setIsLoadingDogs(false)
      }
    }

    if (isOpen) {
      fetchDogs()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start mb-6">
              <div className="flex items-center gap-4 w-full pr-12">
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/80 dark:bg-black/20">
                  <span className="text-4xl">{challenge.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold mb-1 truncate">{challenge.title}</h2>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      challenge.period === 'DAY' 
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-purple-500/10 text-purple-500'
                    }`}>
                      {challenge.period === 'DAY' ? 'Daily' : 'Weekly'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Cookie className="w-4 h-4 text-[var(--accent)]" />
                      <span className="text-sm font-medium text-[var(--accent)]">
                        {challenge.reward} treats
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 mb-8">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-[var(--foreground)]/60">
                {challenge.description}
              </p>
            </div>

            {/* Footer with Accept Button */}
            <div className="flex justify-end">
              <GradientButton
                onClick={() => setShowDogSelection(true)}
                disabled={isLoadingDogs}
                className="px-6 py-3 font-medium"
              >
                {isLoadingDogs ? 'Loading Dogs...' : 'Accept Challenge'}
              </GradientButton>
            </div>
          </div>
        </div>
      </div>

      <DogSelectionModal
        isOpen={showDogSelection}
        onClose={() => setShowDogSelection(false)}
        challenge={challenge}
        preloadedDogs={dogs}
      />
    </>
  )
} 