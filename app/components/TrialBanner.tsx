'use client'

import Link from 'next/link'

interface TrialBannerProps {
  user: any | null
}

export default function TrialBanner({ user }: TrialBannerProps) {
  if (!user || user.payment?.paidAt) return null

  const createdAt = new Date(user.createdAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - createdAt.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const daysLeft = Math.max(0, 7 - diffDays)

  // If trial has expired, show different message
  if (daysLeft === 0) {
    return (
      <div className="flex items-center justify-between gap-2 bg-red-500/10 px-3 py-1.5 rounded-md">
        <span className="text-xs text-red-500">Trial expired</span>
        <Link
          href="/pricing"
          className="px-2 py-0.5 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
        >
          Upgrade
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2 bg-[var(--accent)]/10 px-3 py-1.5 rounded-md">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-xs text-[var(--accent)]">{daysLeft} days of free trial</span>
        <div className="flex-1 h-1.5 bg-[var(--background)] rounded-full">
          <div 
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
            style={{ width: `${(daysLeft / 7) * 100}%` }}
          />
        </div>
      </div>
      <Link
        href="/pricing"
        className="px-2 py-0.5 bg-[var(--accent)] text-white text-xs rounded hover:bg-[var(--accent)]/90 transition-colors"
      >
        Upgrade
      </Link>
    </div>
  )
} 