'use client'

import { useEffect, useState } from 'react'
import { AchievementProgressCard } from './AchievementProgressCard'
import { IUserAchievementProgress } from '../models/UserAchievementProgress'
import Loading from './Loading'

export function AchievementProgressList() {
  const [achievements, setAchievements] = useState<IUserAchievementProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements/progress')
        if (!response.ok) throw new Error('Failed to fetch achievements')
        const data = await response.json()
        setAchievements(data)
      } catch (error) {
        console.error('Error fetching achievements:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  if (isLoading) {
    return <Loading height="h-[200px]" />
  }

  if (achievements.length === 0) {
    return (
      <div className="text-center py-8 bg-white/40 dark:bg-black/10 rounded-3xl backdrop-blur-sm">
        <p className="text-gray-600 dark:text-gray-400">No achievements yet. Keep playing to unlock them!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {achievements.map((progress) => (
        <AchievementProgressCard key={progress._id as string} progress={progress} />
      ))}
    </div>
  )
} 