'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import Portal from '../Portal'

interface DemoChallengeViewModalProps {
  isOpen: boolean
  onClose: () => void
  challenge: {
    title: string
    description: string
    icon: string
    reward: number
  }
  dog: {
    name: string
    icon: string
  }
  onComplete: () => void
}

export default function DemoChallengeViewModal({
  isOpen,
  onClose,
  challenge,
  dog,
  onComplete
}: DemoChallengeViewModalProps) {
  const [isWiggling, setIsWiggling] = useState(false)

  if (!isOpen) return null

  const handleDogClick = () => {
    setIsWiggling(true)
    setTimeout(() => {
      setIsWiggling(false)
      onComplete()
    }, 500)
  }

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-6">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl bg-[#FF8551]/10">
              <span className="text-3xl">{challenge.icon}</span>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">
              {challenge.title}
            </h2>
            <p className="text-center text-[var(--foreground)]/60 mb-8">
              {challenge.description}
            </p>

            <div className="flex justify-center mb-8">
              <button
                onClick={handleDogClick}
                className={`relative group ${isWiggling ? 'animate-wiggle' : ''}`}
              >
                <div className="w-24 h-24 rounded-full bg-[#FF8551]/10 flex items-center justify-center">
                  <span className="text-5xl">{dog.icon}</span>
                </div>
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <p className="text-center text-sm text-[var(--foreground)]/60 mb-4">
              Click on {dog.name} to complete the challenge!
            </p>
          </div>
        </div>
      </div>
    </Portal>
  )
} 