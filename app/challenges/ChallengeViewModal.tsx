'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Cookie } from 'lucide-react'
import { Challenge } from '@/app/types/challenge'
import GradientButton from '../components/GradientButton'
import DogSelectionModal from './DogSelectionModal'
import { Dog } from '@/app/types/dog'
import Portal from '../components/Portal'
import GoodLuckModal from './GoodLuckModal'
import SmallCardList from '../components/SmallCardList'
import CongratulationsModal from './CongratulationsModal'
import Loading from '../components/Loading'

interface ChallengeViewModalProps {
  challenge: Challenge
  isOpen: boolean
  onClose: () => void
}

interface DogChallenge {
  _id: string
  dogId: string
  challengeId: string
  progress: {
    current: number
    goal: number
  }
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
  const [selectedDogIds, setSelectedDogIds] = useState<string[]>([])
  const [isCompleting, setIsCompleting] = useState(false)
  const [completedDogIds, setCompletedDogIds] = useState<string[]>([])
  const [showCongratulations, setShowCongratulations] = useState(false)
  const progressTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const [completedDogs, setCompletedDogs] = useState<Dog[]>([])
  const [dogChallenges, setDogChallenges] = useState<DogChallenge[]>([])

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
        
        // Store dog challenges for later use
        setDogChallenges(data.dogChallenges)
        
        // Map participating dogs back to full dog objects
        const participatingDogIds = new Set(data.dogChallenges.map((dc: DogChallenge) => dc.dogId))
        const participatingDogsFull = userDogs.filter((dog: Dog) => participatingDogIds.has(dog._id))
        
        setParticipatingDogs(participatingDogsFull)
        
        // Set completed dog IDs - only if progress matches goal
        const completedDogIds = data.dogChallenges
          .filter((dc: DogChallenge) => dc.progress.current >= dc.progress.goal)
          .map((dc: DogChallenge) => dc.dogId)
        setCompletedDogIds(completedDogIds)
        
      } catch (error) {
        console.error('Error fetching participating dogs:', error)
      }
    }

    if (isOpen) {
      fetchDogs()
      fetchParticipatingDogs()
    }
  }, [isOpen, challenge._id])

  const handleDogClick = (dogId: string) => {
    setSelectedDogIds(prev => 
      prev.includes(dogId) 
        ? prev.filter(id => id !== dogId)
        : [...prev, dogId]
    )
  }

  const handleCompleteSelected = async () => {
    setIsCompleting(true)
    
    // Start the progress animation
    let progress = 0
    progressTimerRef.current = setInterval(() => {
      progress += 2
      if (progress > 100) {
        clearInterval(progressTimerRef.current)
        return
      }
    }, 20)

    try {
      const selectedChallenges = dogChallenges.filter(dc => 
        selectedDogIds.includes(dc.dogId)
      )

      // Make API calls to complete the challenges
      await Promise.all(selectedChallenges.map(dc => 
        fetch(`/api/challenges/dogs/${dc._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'set',
            progress: dc.progress.goal
          }),
        })
      ))

      // Find the completed dogs from the full dogs list
      const completedDogsList = dogs.filter(dog => 
        selectedDogIds.includes(dog._id)
      )
      setCompletedDogs(completedDogsList)

      // Update completed dog IDs
      setCompletedDogIds(prev => [...prev, ...selectedDogIds])

      // Clear the interval and set progress to 100%
      clearInterval(progressTimerRef.current)

      // Short delay before showing congratulations
      await new Promise(resolve => setTimeout(resolve, 500))
      setShowCongratulations(true)
    } catch (error) {
      console.error('Error completing challenges:', error)
    } finally {
      setIsCompleting(false)
      setSelectedDogIds([]) // Reset selected dogs after completion
    }
  }

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
      setSelectedDogIds([])
    }
  }, [isOpen])

  const getButtonText = () => {
    // If all user's dogs have completed the challenge
    if (dogs.length > 0 && 
        dogs.every(dog => completedDogIds.includes(dog._id))) {
      return '🎉 Your pack mastered this challenge!'
    }

    const count = selectedDogIds.length
    if (count === 0) return 'Accept Challenge'
    return `Complete ${count} Challenge${count === 1 ? '' : 's'}`
  }

  const isButtonDisabled = () => {
    return isLoadingDogs || 
           isCompleting || 
           (dogs.length > 0 && 
            dogs.every(dog => completedDogIds.includes(dog._id)))
  }

  // Add cleanup for the interval
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
      }
    }
  }, [])

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
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Your Pups Taking On This Challenge
                  </h3>
                  {isLoadingDogs ? (
                    <Loading height="h-20" containerClassName="rounded-xl" />
                  ) : participatingDogs.length > 0 ? (
                    <SmallCardList
                      dogs={participatingDogs}
                      maxEntriesInRow={5}
                      singleRow={true}
                      onDogClick={handleDogClick}
                      selectedDogIds={selectedDogIds}
                      completedDogIds={completedDogIds}
                      challengeIcon={challenge.icon}
                    />
                  ) : (
                    <div className="text-sm text-[var(--foreground)]/60 italic">
                      None of your pups are taking this challenge yet
                    </div>
                  )}
                </div>
              </div>

              {/* Footer with Button */}
              <div className="flex justify-end">
                <GradientButton
                  onClick={selectedDogIds.length > 0 ? handleCompleteSelected : () => setShowDogSelection(true)}
                  disabled={isButtonDisabled()}
                  className={`px-6 py-3 font-medium relative overflow-hidden
                    ${isButtonDisabled() && dogs.length > 0 && 
                      dogs.every(dog => completedDogIds.includes(dog._id)) 
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 dark:from-amber-600/20 dark:to-yellow-600/20 border-2 border-amber-500/30 dark:border-amber-400/30 text-amber-700 dark:text-amber-300 hover:opacity-100 cursor-default'
                      : ''
                    }`}
                  completitionLoadOnClick={selectedDogIds.length > 0}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {getButtonText()}
                  </span>
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

      <CongratulationsModal
        isOpen={showCongratulations}
        onClose={() => {
          setShowCongratulations(false)
          onClose()
        }}
        completedDogs={completedDogs}
        challengeIcon={challenge.icon}
        reward={challenge.reward}
      />
    </Portal>
  )
} 