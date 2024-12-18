'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Challenge } from '@/app/types/challenge'
import { Dog } from '@/app/types/dog'
import GradientButton from '../components/GradientButton'
import SmallDogCard from '../components/SmallDogCard'

interface DogSelectionModalProps {
  challenge: Challenge
  isOpen: boolean
  onClose: () => void
  preloadedDogs: Dog[]
  onChallengeAccepted: (dogNames: string[]) => void
  onAddNewPet: (fromEmptyState?: boolean) => void
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

export default function DogSelectionModal({
  challenge,
  isOpen,
  onClose,
  preloadedDogs,
  onChallengeAccepted,
  onAddNewPet
}: DogSelectionModalProps) {
  const [selectedDogs, setSelectedDogs] = useState<Dog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [dogChallenges, setDogChallenges] = useState<DogChallenge[]>([])

  useEffect(() => {
    const fetchDogChallenges = async () => {
      if (!isOpen || !preloadedDogs.length) return
      
      try {
        const dogIds = preloadedDogs.map(dog => dog._id).join(',')
        const response = await fetch(`/api/challenges/dogs?challengeIds=${challenge._id}&dogIds=${dogIds}`)
        const data = await response.json()
        setDogChallenges(data.dogChallenges || [])
      } catch (error) {
        console.error('Error fetching dog challenges:', error)
      }
    }

    fetchDogChallenges()
  }, [isOpen, challenge._id, preloadedDogs])

  const getDogChallengeState = (dogId: string): 'none' | 'in_progress' | 'completed' => {
    const dogChallenge = dogChallenges.find(dc => dc.dogId === dogId)
    if (!dogChallenge) return 'none'
    return dogChallenge.progress.current >= dogChallenge.progress.goal 
      ? 'completed' 
      : 'in_progress'
  }

  const getAvailableDogCount = () => {
    return preloadedDogs.filter(dog => getDogChallengeState(dog._id) === 'none').length
  }

  const handleDogSelect = (dog: Dog) => {
    if (getDogChallengeState(dog._id) !== 'none') return
    
    setSelectedDogs(prev => 
      prev.includes(dog) 
        ? prev.filter(d => d._id !== dog._id)
        : [...prev, dog]
    )
  }

  const handleAcceptChallenge = async () => {
    if (selectedDogs.length === 0) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/challenges/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: challenge._id,
          dogIds: selectedDogs.map(dog => dog._id)
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        if (data.existingDogIds) {
          // Handle case where some dogs are already participating
          const availableDogs = selectedDogs.filter(
            dog => !data.existingDogIds.includes(dog._id)
          )
          setSelectedDogs(availableDogs)
          return
        }
        throw new Error(data.error)
      }

      onChallengeAccepted(selectedDogs.map(dog => dog.name))
    } catch (error) {
      console.error('Error accepting challenge:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    if (preloadedDogs.length === 0) {
      return 'Add New Puppy'
    }

    if (isLoading) return 'Accepting Challenge...'
    
    const availableDogs = getAvailableDogCount()
    if (availableDogs === 0) {
      const allCompleted = preloadedDogs.every(
        dog => getDogChallengeState(dog._id) === 'completed'
      )
      return allCompleted 
        ? '🎉 All your pups mastered this challenge!'
        : '⏳ Your pups are working on it!'
    }
    
    return 'Accept Challenge'
  }

  const handleButtonClick = () => {
    if (preloadedDogs.length === 0) {
      onClose()
      onAddNewPet(true)
      return
    }
    handleAcceptChallenge()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Select Your Dogs</h2>
          
          {preloadedDogs.length === 0 ? (
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🐕</div>
              <p className="text-lg mb-2">No Pups Found!</p>
              <p className="text-[var(--foreground)]/60">
                Add your first furry friend to start taking on challenges together!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 mb-6 h-[90px] content-start overflow-y-auto px-2">
              {preloadedDogs.map(dog => {
                const state = getDogChallengeState(dog._id)
                return (
                  <div key={dog._id} className="h-fit">
                    <SmallDogCard
                      imageUrl={dog.imageUrl}
                      name={dog.name}
                      onClick={() => handleDogSelect(dog)}
                      isSelected={selectedDogs.includes(dog)}
                      isCompleted={state === 'completed'}
                      isInProgress={state === 'in_progress'}
                      challengeIcon={challenge.icon}
                    />
                  </div>
                )
              })}
            </div>
          )}

          <GradientButton
            onClick={handleButtonClick}
            disabled={
              (preloadedDogs.length > 0 && (selectedDogs.length === 0 || isLoading || getAvailableDogCount() === 0))
            }
            className={`w-full px-6 py-3 font-medium ${
              preloadedDogs.length > 0 && getAvailableDogCount() === 0 ? 'bg-gray-500/20 cursor-default' : ''
            }`}
          >
            {getButtonText()}
          </GradientButton>
        </div>
      </div>
    </div>
  )
} 