'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Portal from '../Portal'

interface DemoClaimRewardModalProps {
  isOpen: boolean
  onClose: () => void
  challengeIcon: string
}

export default function DemoClaimRewardModal({
  isOpen,
  onClose,
  challengeIcon
}: DemoClaimRewardModalProps) {
  const [clicks, setClicks] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isWiggling, setIsWiggling] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const requiredClicks = 5
  const clickTimeWindow = 3000 // 3 seconds

  useEffect(() => {
    if (clicks > 0) {
      const timer = setTimeout(() => {
        setClicks(0)
      }, clickTimeWindow)
      return () => clearTimeout(timer)
    }
  }, [clicks])

  useEffect(() => {
    if (isCompleted) return

    const wiggleInterval = setInterval(() => {
      setIsWiggling(true)
      setTimeout(() => setIsWiggling(false), 200)
    }, 2000)

    return () => clearInterval(wiggleInterval)
  }, [isCompleted])

  const handleIconClick = () => {
    setIsWiggling(true)
    setTimeout(() => setIsWiggling(false), 200)
    
    setClicks(prev => {
      const newClicks = prev + 1
      if (newClicks >= requiredClicks) {
        setIsCompleted(true)
        setTimeout(() => {
          setShowReward(true)
        }, 100)
      }
      return newClicks
    })
  }

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
            <h2 className="text-2xl font-bold mb-4">Claim Your Reward!</h2>
            <p className="text-[var(--foreground)]/60 mb-6">
              Tap the gift {requiredClicks} times quickly to reveal your reward!
            </p>

            <div className="mb-6 relative">
              <button
                onClick={handleIconClick}
                className={`text-7xl p-4 transition-transform active:scale-95 ${
                  isWiggling && !isCompleted ? 'animate-wiggle' : ''
                } ${isCompleted ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
              >
                <span>🎁</span>
              </button>

              {isCompleted && (
                <div 
                  className={`absolute inset-0 flex items-center justify-center ${
                    showReward ? 'animate-jumpOut' : 'opacity-0'
                  }`}
                >
                  <span className="text-6xl">{challengeIcon}</span>
                </div>
              )}

              {!isCompleted && (
                <div className="mt-2 text-sm text-[var(--foreground)]/60">
                  {clicks} / {requiredClicks} taps
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#FF8551] text-white rounded-xl hover:bg-[#FF8551]/90 transition-colors font-medium w-full"
              disabled={!isCompleted}
            >
              {isCompleted ? "Keep Going!" : "Tap Faster!"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  )
} 