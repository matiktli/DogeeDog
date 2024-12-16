'use client'

import { useEffect, useState } from 'react'

interface Badge {
  icon: string
  count: number
}

interface BadgesListProps {
  userId: string
}

export function BadgesList({ userId }: BadgesListProps) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await fetch(`/api/badges/count?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          const sortedBadges = data.sort((a: Badge, b: Badge) => b.count - a.count)
          setBadges(sortedBadges)
        }
      } catch (error) {
        console.error('Error fetching badges:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBadges()
  }, [userId])

  if (isLoading) {
    return <div className="text-center">Loading badges...</div>
  }

  if (badges.length === 0) {
    return <div className="text-center text-[var(--foreground)]/60">No badges yet</div>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {badges.map((badge, index) => (
        <div 
          key={index}
          className="flex flex-col items-center justify-center p-4 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm"
        >
          <div className="relative mb-2">
            <span className="text-4xl">{badge.icon}</span>
            <span className="absolute -bottom-1 -right-1 bg-[var(--accent)] text-white text-sm rounded-full w-5 h-5 flex items-center justify-center">
              {badge.count}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
} 