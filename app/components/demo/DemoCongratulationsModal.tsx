'use client'

import { X } from 'lucide-react'
import Portal from '../Portal'
import { motion } from 'framer-motion'

interface DemoCongratulationsModalProps {
  isOpen: boolean
  onClose: () => void
  dog: {
    name: string
    icon: string
  }
  challenge: {
    title: string
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
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md relative"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#FF8551]/10 flex items-center justify-center">
              <span className="text-5xl">{dog.icon}</span>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">
              Congratulations!
            </h2>
            <p className="text-center text-[var(--foreground)]/60 mb-8">
              {dog.name} completed the {challenge.title.toLowerCase()}!
            </p>

            <button
              onClick={onClaim}
              className="w-full py-3 bg-[#FF8551] text-white rounded-xl hover:bg-[#FF8551]/90 transition-colors"
            >
              Claim {challenge.reward} Points
            </button>
          </div>
        </motion.div>
      </div>
    </Portal>
  )
} 