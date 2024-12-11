'use client'

import { X } from 'lucide-react'
import Portal from '../components/Portal'

interface GoodLuckModalProps {
  isOpen: boolean
  onClose: () => void
  dogNames: string[]
}

export default function GoodLuckModal({ isOpen, onClose, dogNames }: GoodLuckModalProps) {
  if (!isOpen) return null

  const dogText = dogNames.length === 1 
    ? dogNames[0]
    : `${dogNames.slice(0, -1).join(', ')} and ${dogNames[dogNames.length - 1]}`

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6 relative text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-4xl mb-4">🌟 🐾 ✨</div>
          
          <h2 className="text-2xl font-bold mb-3">Adventure Awaits!</h2>
          
          <p className="text-[var(--foreground)]/80 mb-6">
            Good luck to you and {dogText} on this exciting challenge! 
            May your journey be filled with wagging tails and happy moments! 
          </p>
          
          <div className="text-3xl">🎯 🦮 💪</div>
        </div>
      </div>
    </Portal>
  )
} 