import Portal from '../components/Portal'
import { X } from 'lucide-react'
import GradientButton from '../components/GradientButton'
import Confetti from '../components/Confetti'
import SmallCardList from '../components/SmallCardList'
import { Dog } from '../types/dog'

interface CongratulationsModalProps {
  isOpen: boolean
  onClose: () => void
  completedDogs: Dog[]
  challengeIcon: string
  reward: number
}

export default function CongratulationsModal({
  isOpen,
  onClose,
  completedDogs,
  challengeIcon,
  reward
}: CongratulationsModalProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const totalReward = reward * completedDogs.length

  return (
    <Portal>
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <Confetti 
          colors={['#FF8551', '#E49B0F', '#FFB84C', '#F16767', '#A459D1', '#4477CE']}
        />
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Amazing Job!</h2>
            <p className="text-[var(--foreground)]/60 mb-6">
              You&apos;ve completed {completedDogs.length} challenge{completedDogs.length !== 1 ? 's' : ''}! 
              Your pups are getting stronger every day.
            </p>

            <div className="mb-3 flex justify-center">
              <div className="inline-flex justify-center">
                <SmallCardList
                  dogs={completedDogs}
                  maxEntriesInRow={5}
                  singleRow={false}
                  completedDogIds={completedDogs.map(dog => dog._id)}
                  challengeIcon={challengeIcon}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-6 text-[var(--accent)]">
                {//make emoji larger
}
              <span className="text-2xl">🍬</span>
              <span className="text-sm font-medium">
                +{totalReward} treats earned
              </span>
            </div>

            <GradientButton
              onClick={onClose}
              className="px-6 py-3 font-medium w-full"
              variant="solid"
            >
              Keep Going!
            </GradientButton>
          </div>
        </div>
      </div>
    </Portal>
  )
} 