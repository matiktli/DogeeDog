'use client'

import { BadgesList } from './BadgesList'

interface BadgesModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function BadgesModal({ isOpen, onClose, userId }: BadgesModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
        >
          ✕
        </button>
        
        <h2 className="text-xl font-semibold mb-6">Badges Collection</h2>
        
        <BadgesList userId={userId} />
      </div>
    </div>
  )
} 