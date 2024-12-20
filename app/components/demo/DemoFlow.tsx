'use client'

import { useState } from 'react'
import DemoChallengeCard from './DemoChallengeCard'
import DemoChallengeViewModal from './DemoChallengeViewModal'
import DemoCongratulationsModal from './DemoCongratulationsModal'
import DemoClaimRewardModal from './DemoClaimRewardModal'
import { motion, AnimatePresence } from 'framer-motion'

const DEMO_CHALLENGE = {
  _id: 'demo-challenge',
  title: 'Morning Walk Challenge',
  description: 'Take your dog for a refreshing morning walk',
  icon: '🌅',
  reward: 50,
  period: 'DAY',
  type: 'SYSTEM'
}

const DEMO_DOGS = [
  {
    _id: 'demo-dog-1',
    name: 'Luna',
    breed: 'Golden Retriever',
    icon: '🐕',
    age: 3,
  },
  {
    _id: 'demo-dog-2',
    name: 'Max',
    breed: 'German Shepherd',
    icon: '🦮',
    age: 2,
  },
  {
    _id: 'demo-dog-3',
    name: 'Bella',
    breed: 'French Bulldog',
    icon: '🐶',
    age: 1,
  }
]

export default function DemoFlow() {
  const [step, setStep] = useState(1)
  const [showTip, setShowTip] = useState(true)
  const [demoDog, setDemoDog] = useState<any>(null)
  const [showChallengeView, setShowChallengeView] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [showClaimReward, setShowClaimReward] = useState(false)

  const tips = {
    1: "👋 Let's start by selecting your demo dog!",
    2: "Great! Now let's try a challenge. Click on the challenge card!",
    3: "Click on your dog's icon to complete the challenge!",
    4: "Amazing! Time to celebrate your achievement!",
    5: "Last step - claim your reward by tapping the gift! 🎁"
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          See How It Works
        </h2>

        <AnimatePresence>
          {showTip && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#FF8551]/10 p-4 rounded-xl mb-8 text-center"
            >
              {tips[step as keyof typeof tips]}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-8">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              {DEMO_DOGS.map((dog) => (
                <button
                  key={dog._id}
                  onClick={() => {
                    setDemoDog(dog);
                    setStep(2);
                    setShowTip(true);
                  }}
                  className="flex flex-col items-center gap-2 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <span className="text-4xl">{dog.icon}</span>
                  <h3 className="font-bold text-lg">{dog.name}</h3>
                  <p className="text-gray-600 text-sm">{dog.breed}</p>
                </button>
              ))}
            </div>
          )}

          {step >= 2 && demoDog && (
            <div className="w-full max-w-sm">
              <DemoChallengeCard
                challenge={DEMO_CHALLENGE}
                onClick={() => {
                  setShowChallengeView(true)
                  setStep(3)
                  setShowTip(true)
                }}
              />
            </div>
          )}
        </div>

        <DemoChallengeViewModal
          isOpen={showChallengeView}
          onClose={() => setShowChallengeView(false)}
          challenge={DEMO_CHALLENGE}
          dog={demoDog}
          onComplete={() => {
            setShowChallengeView(false)
            setShowCongrats(true)
            setStep(4)
            setShowTip(true)
          }}
        />

        <DemoCongratulationsModal
          isOpen={showCongrats}
          onClose={() => setShowCongrats(false)}
          dog={demoDog}
          challenge={DEMO_CHALLENGE}
          onClaim={() => {
            setShowCongrats(false)
            setShowClaimReward(true)
            setStep(5)
            setShowTip(true)
          }}
        />

        <DemoClaimRewardModal
          isOpen={showClaimReward}
          onClose={() => {
            setShowClaimReward(false)
            setStep(1)
            setDemoDog(null)
          }}
          challengeIcon={DEMO_CHALLENGE.icon}
        />
      </div>
    </div>
  )
} 