import { useState, useEffect } from 'react'
import Portal from '../components/Portal'
import { X } from 'lucide-react'
import GradientButton from '../components/GradientButton'

interface ClaimRewardModalProps {
  isOpen: boolean
  onClose: () => void
  challengeIcon: string
}

export default function ClaimRewardModal({
  isOpen,
  onClose,
  challengeIcon
}: ClaimRewardModalProps) {
  const [clicks, setClicks] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isWiggling, setIsWiggling] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const requiredClicks = 5
  const clickTimeWindow = 3000 // 3 seconds

  // Reset clicks after time window
  useEffect(() => {
    if (clicks > 0) {
      const timer = setTimeout(() => {
        setClicks(0)
      }, clickTimeWindow)
      return () => clearTimeout(timer)
    }
  }, [clicks])

  // Periodic wiggle effect
  useEffect(() => {
    if (isCompleted) return // Don't wiggle after completion

    // Wiggle every 2 seconds
    const wiggleInterval = setInterval(() => {
      setIsWiggling(true)
      // Reset wiggle after animation duration
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
        // Small delay before showing the reward
        setTimeout(() => {
          setShowReward(true)
        }, 100)
      }
      return newClicks
    })
  }

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <Portal>
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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

            <GradientButton
              onClick={onClose}
              className="px-6 py-3 font-medium w-full"
              variant="solid"
              disabled={!isCompleted}
            >
              {isCompleted ? "Keep Going!" : "Tap Faster!"}
            </GradientButton>
          </div>
        </div>
      </div>
    </Portal>
  )
} 