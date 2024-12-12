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
}

export default function DogSelectionModal({
  challenge,
  isOpen,
  onClose,
  preloadedDogs,
  onChallengeAccepted
}: DogSelectionModalProps) {
  const [selectedDogs, setSelectedDogs] = useState<Dog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [participatingDogIds, setParticipatingDogIds] = useState<string[]>([])

  useEffect(() => {
    const fetchParticipatingDogs = async () => {
      try {
        const response = await fetch(`/api/challenges/dogs?challengeIds=${challenge._id}`)
        const data = await response.json()
        const participatingIds = data.dogChallenges.map((dc: any) => dc.dogId)
        setParticipatingDogIds(participatingIds)
      } catch (error) {
        console.error('Error fetching participating dogs:', error)
      }
    }

    if (isOpen) {
      fetchParticipatingDogs()
    }
  }, [isOpen, challenge._id])

  const handleDogSelect = (dog: Dog) => {
    if (participatingDogIds.includes(dog._id)) return
    
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
          
          <div className="grid grid-cols-4 gap-4 mb-6 h-[90px] content-start overflow-y-auto px-2">
            {preloadedDogs.map(dog => (
              <div key={dog._id} className="h-fit">
                <SmallDogCard
                  imageUrl={dog.imageUrl}
                  name={dog.name}
                  onClick={() => handleDogSelect(dog)}
                  isSelected={selectedDogs.includes(dog)}
                  isCompleted={participatingDogIds.includes(dog._id)}
                  challengeIcon={challenge.icon}
                />
              </div>
            ))}
          </div>

          <GradientButton
            onClick={handleAcceptChallenge}
            disabled={selectedDogs.length === 0 || isLoading}
            className="w-full px-6 py-3 font-medium"
          >
            {isLoading ? 'Accepting Challenge...' : 'Accept Challenge'}
          </GradientButton>
        </div>
      </div>
    </div>
  )
} 