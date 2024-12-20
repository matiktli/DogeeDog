'use client'

import { useEffect, useState } from 'react'
import { MiniAchievementCard } from './MiniAchievementCard'
import { IUserAchievementProgress } from '../models/UserAchievementProgress'
import Loading from './Loading'

interface MiniAchievementListProps {
  userId: string
}

export function MiniAchievementList({ userId }: MiniAchievementListProps) {
  const [achievements, setAchievements] = useState<IUserAchievementProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch(`/api/achievements/progress?userId=${userId}`)
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
  }, [userId])

  if (isLoading) {
    return (
      <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        <Loading height="h-8" />
      </section>
    )
  }

  if (achievements.length === 0) {
    return (
      <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        <div className="text-center py-12 bg-white/40 dark:bg-black/10 rounded-3xl backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-2">No Achievements Yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Complete challenges and activities to earn achievements!
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-4">Achievements</h2>
      <div className="flex flex-wrap gap-3">
        {achievements.map((progress) => (
          <MiniAchievementCard key={progress._id as string} progress={progress} />
        ))}
      </div>
    </section>
  )
} 