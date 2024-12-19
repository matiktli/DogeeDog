'use client'

import Link from 'next/link'

interface TrialBannerProps {
  user: any | null
  onUpgradeClick?: () => void
}

export default function TrialBanner({ user, onUpgradeClick }: TrialBannerProps) {
  if (!user || user.payment?.paidAt) return null

  const createdAt = new Date(user.createdAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - createdAt.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const daysLeft = Math.max(0, 7 - diffDays)

  // If trial has expired, show different message
  if (daysLeft === 0) {
    return (
      <div className="flex items-center justify-between gap-2 bg-[var(--secondary)]/10 px-3 py-1.5 rounded-md">
        <span className="text-xs text-[var(--secondary)]">Trial expired</span>
        <Link
          href="/pricing"
          onClick={onUpgradeClick}
          className="px-2 py-0.5 bg-[var(--secondary)] text-white text-xs rounded hover:bg-[var(--secondary)]/90 transition-colors"
        >
          Upgrade
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2 bg-[var(--secondary)]/10 px-3 py-1.5 rounded-md">
      <div className="flex flex-col gap-1 flex-1">
        <span className="text-xs text-[var(--secondary)]">{daysLeft} days of free trial left</span>
        <div className="w-full h-2 bg-[var(--foreground)]/10 rounded-full">
          <div 
            className="h-full bg-[var(--secondary)] rounded-full transition-all duration-300"
            style={{ width: `${(daysLeft / 7) * 100}%` }}
          />
        </div>
      </div>
      <Link
        href="/pricing"
        onClick={onUpgradeClick}
        className="px-2 py-0.5 bg-[var(--secondary)] text-white text-xs rounded hover:bg-[var(--secondary)]/90 transition-colors"
      >
        Upgrade
      </Link>
    </div>
  )
} 