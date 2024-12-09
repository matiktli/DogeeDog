'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'
import { Challenge } from '@/app/types/challenge'
import { Dog } from '@/app/types/dog'
import GradientButton from '../components/GradientButton'

interface DogSelectionModalProps {
  challenge: Challenge
  isOpen: boolean
  onClose: () => void
  preloadedDogs: Dog[]
}

export default function DogSelectionModal({
  challenge,
  isOpen,
  onClose,
  preloadedDogs
}: DogSelectionModalProps) {
  const [selectedDogs, setSelectedDogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleDogSelect = (dogId: string) => {
    setSelectedDogs(prev => 
      prev.includes(dogId) 
        ? prev.filter(id => id !== dogId)
        : [...prev, dogId]
    )
  }

  const handleSubmit = async () => {
    if (selectedDogs.length === 0) return

    setIsLoading(true)
    try {
      await fetch('/api/challenges/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: challenge._id,
          dogIds: selectedDogs
        }),
      })

      onClose()
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
          
          <div className="grid grid-cols-3 gap-3 mb-6 max-h-[300px] overflow-y-auto">
            {preloadedDogs.map(dog => (
              <button
                key={dog._id}
                onClick={() => handleDogSelect(dog._id)}
                className={`p-2 rounded-xl border-2 transition-all ${
                  selectedDogs.includes(dog._id)
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[var(--accent)]'
                }`}
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-1">
                  <Image
                    src={dog.imageUrl}
                    alt={dog.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-medium truncate text-center">
                  {dog.name}
                </p>
              </button>
            ))}
          </div>

          <GradientButton
            onClick={handleSubmit}
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