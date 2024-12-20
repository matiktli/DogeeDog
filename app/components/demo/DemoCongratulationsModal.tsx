'use client'

import { X } from 'lucide-react'
import Portal from '../Portal'
import Image from 'next/image'

interface DemoCongratulationsModalProps {
  isOpen: boolean
  onClose: () => void
  dog: {
    name: string
    imageUrl: string
  }
  challenge: {
    icon: string
    reward: number
  }
  onClaim: () => void
}

export default function DemoCongratulationsModal({
  isOpen,
  onClose,
  dog,
  challenge,
  onClaim
}: DemoCongratulationsModalProps) {
  if (!isOpen) return null

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Amazing Job!</h2>
            <p className="text-[var(--foreground)]/60 mb-6">
              {dog.name} completed the challenge!
            </p>

            <div className="mb-6">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden relative">
                <Image
                  src={dog.imageUrl}
                  alt={dog.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-6 text-[var(--accent)]">
              <span className="text-2xl">🍬</span>
              <span className="text-sm font-medium">
                +{challenge.reward} treats earned
              </span>
            </div>

            <button
              onClick={onClaim}
              className="px-6 py-3 bg-[#FF8551] text-white rounded-xl hover:bg-[#FF8551]/90 transition-colors font-medium w-full"
            >
              Claim Your Reward! 🎁
            </button>
          </div>
        </div>
      </div>
    </Portal>
  )
} 