'use client'

import { useEffect, useState } from 'react'

interface BadgeCount {
  icon: string
  count: number
}

interface BadgeCounterProps {
  userId: string
  maxDisplay?: number
}

export function BadgeCounter({ userId, maxDisplay = 5 }: BadgeCounterProps) {
  const [badges, setBadges] = useState<BadgeCount[]>([])

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await fetch(`/api/badges/count?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          // Sort badges by count in descending order
          const sortedBadges = data.sort((a: BadgeCount, b: BadgeCount) => b.count - a.count)
          setBadges(sortedBadges)
        }
      } catch (error) {
        console.error('Error fetching badges:', error)
      }
    }

    fetchBadges()
  }, [userId])

  if (badges.length === 0) {
    return <span className="text-sm text-[var(--foreground)]/60">No badges yet</span>
  }

  const displayBadges = badges.slice(0, maxDisplay)
  const remainingCount = badges.length - maxDisplay

  return (
    <div className="flex items-center gap-1">
      {displayBadges.map((badge, index) => (
        <div key={index} className="relative">
          <span className="text-2xl">{badge.icon}</span>
          <span className="absolute -bottom-1 -left-1 bg-[var(--accent)] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {badge.count}
          </span>
        </div>
      ))}
      {remainingCount > 0 && (
        <span className="text-sm text-[var(--foreground)]/60 ml-1">
          +{remainingCount}
        </span>
      )}
    </div>
  )
} 