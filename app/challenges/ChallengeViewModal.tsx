'use client'

import { useState, useEffect } from 'react'
import { X, Cookie } from 'lucide-react'
import { Challenge } from '@/app/types/challenge'
import GradientButton from '../components/GradientButton'
import DogSelectionModal from './DogSelectionModal'
import { Dog } from '@/app/types/dog'
import Portal from '../components/Portal'
import GoodLuckModal from './GoodLuckModal'
import SmallCardList from '../components/SmallCardList'

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
  const [showGoodLuck, setShowGoodLuck] = useState(false)
  const [selectedDogNames, setSelectedDogNames] = useState<string[]>([])
  const [dogs, setDogs] = useState<Dog[]>([])
  const [isLoadingDogs, setIsLoadingDogs] = useState(true)
  const [participatingDogs, setParticipatingDogs] = useState<Dog[]>([])

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

    const fetchParticipatingDogs = async () => {
      try {
        // First get all user's dogs
        const dogsResponse = await fetch('/api/dogs')
        const userDogs = await dogsResponse.json()
        
        // Then fetch participating dogs for this challenge
        const dogIds = userDogs.map((dog: Dog) => dog._id).join(',')
        const response = await fetch(`/api/challenges/dogs?challengeIds=${challenge._id}&dogIds=${dogIds}`)
        const data = await response.json()
        
        // Map participating dogs back to full dog objects
        const participatingDogIds = new Set(data.dogChallenges.map((dc: any) => dc.dogId))
        const participatingDogsFull = userDogs.filter((dog: Dog) => participatingDogIds.has(dog._id))
        
        setParticipatingDogs(participatingDogsFull)
      } catch (error) {
        console.error('Error fetching participating dogs:', error)
      } finally {
      }
    }

    if (isOpen) {
      fetchDogs()
      fetchParticipatingDogs()
    }
  }, [isOpen, challenge._id])

  const handleChallengeAccepted = (dogNames: string[]) => {
    setShowDogSelection(false)
    setSelectedDogNames(dogNames)
    setShowGoodLuck(true)
  }

  const handleGoodLuckClose = () => {
    setShowGoodLuck(false)
    onClose()
  }

  // When the modal is closed, reset all states
  useEffect(() => {
    if (!isOpen) {
      setShowDogSelection(false)
      setShowGoodLuck(false)
      setSelectedDogNames([])
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <Portal>
      {!showGoodLuck && (
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
                <p className="text-[var(--foreground)]/60 mb-6">
                  {challenge.description}
                </p>

                {/* Participating Dogs Section */}
                {participatingDogs.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      🐾 Your Pups Taking On This Challenge
                    </h3>
                    <SmallCardList
                      dogs={participatingDogs}
                      maxEntriesInRow={5}
                      singleRow={true}
                    />
                  </div>
                )}
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
      )}

      <DogSelectionModal
        isOpen={showDogSelection}
        onClose={() => setShowDogSelection(false)}
        challenge={challenge}
        preloadedDogs={dogs}
        onChallengeAccepted={handleChallengeAccepted}
      />

      <GoodLuckModal
        isOpen={showGoodLuck}
        onClose={handleGoodLuckClose}
        dogNames={selectedDogNames}
      />
    </Portal>
  )
} 