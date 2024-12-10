'use client'

import { useState, useEffect } from 'react'
import { Check, Cookie } from 'lucide-react'
import Link from 'next/link'
import { DogChallenge } from '@/app/types/dogchallenge'
import ChallengeViewModal from '@/app/challenges/ChallengeViewModal'
import { Challenge } from '../types/challenge'

interface DogChallengeCardProps {
    dogChallenge: DogChallenge;
}

export default function DogChallengeCard({ 
  dogChallenge
}: DogChallengeCardProps) {
  const [showViewModal, setShowViewModal] = useState(false)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const isCompleted = dogChallenge?.progress?.current >= dogChallenge?.progress?.goal
  const progressPercentage = Math.min((dogChallenge?.progress?.current / dogChallenge?.progress?.goal) * 100, 100)

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/challenges/${dogChallenge.challengeId}`)
        if (!response.ok) throw new Error('Failed to fetch challenge')
        const data = await response.json()
        setChallenge(data)
      } catch (error) {
        console.error('Error fetching challenge:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (dogChallenge.challengeId) {
      fetchChallenge()
    }
  }, [dogChallenge.challengeId])

  if (isLoading || !challenge) {
    return (
      <div className="relative w-full sm:w-[300px] h-[220px] animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-full">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl" />
              <div className="space-y-2">
                <div className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-3/4 h-6 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="w-full h-4 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="w-2/3 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full sm:w-[300px]">
      <Link 
        href="#"
        onClick={(e) => {
          e.preventDefault()
          setShowViewModal(true)
        }}
        className="block group/card h-[220px]"
      >
        <div className={`relative bg-[#FF8551]/10 hover:bg-[#FF8551]/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-full
          ${isCompleted ? 'blur-[1px]' : ''}`}
        >
          {/* Hover effect background */}
          <div 
            className="absolute inset-0 bg-[#E49B0F]/30
              origin-left transform scale-x-0 
              transition-transform duration-1000 ease-in-out
              group-hover/card:scale-x-100"
            style={{ transformOrigin: 'left' }}
          />
          
          <div className="relative p-6 flex flex-col h-full">
            {/* Header section */}
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/80 dark:bg-black/20">
                <span className="text-2xl">{challenge.icon}</span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                  challenge.period === 'DAY' 
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'bg-purple-500/10 text-purple-500'
                }`}>
                  {challenge.period === 'DAY' ? 'Daily' : 'Weekly'}
                </span>
                <div className="flex items-center gap-1.5">
                  <Cookie className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-sm font-medium text-[var(--accent)]">
                    {challenge.reward} treats
                  </span>
                </div>
              </div>
            </div>

            {/* Content section */}
            <div className="flex-grow">
              <h3 className="text-lg font-semibold mb-2 truncate">
                {challenge.title}
              </h3>
              <p className="text-sm text-[var(--foreground)]/60 line-clamp-2">
                {challenge.description}
              </p>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#8B4513] to-[#D2691E] transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-[var(--foreground)]/60 text-right">
                {dogChallenge.progress?.current} / {dogChallenge.progress?.goal}
              </div>
            </div>
          </div>
        </div>

        {/* Completion overlay */}
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </Link>

      {challenge && (
        <ChallengeViewModal
          challenge={challenge}
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  )
} 