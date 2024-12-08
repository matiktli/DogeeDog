'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function PricingCard() {
  const [isLifetime, setIsLifetime] = useState(false)
  const price = isLifetime ? 50 : 5

  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <h2 className="text-5xl font-[var(--font-anchor-jack)] text-[var(--accent)] mb-6">
        Transform your daily walks
      </h2>
      
      <div className="bg-white dark:bg-black/20 rounded-2xl p-8 shadow-lg mb-8">
        <div className="flex items-baseline justify-center mb-2">
          <span className="text-5xl font-bold text-[var(--foreground)]">${price}</span>
          <span className="text-lg text-[var(--foreground)]/60 ml-1">
            {isLifetime ? '' : '/month'}
          </span>
        </div>

        <div className="inline-flex items-center gap-3 mb-8">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isLifetime}
              onChange={(e) => setIsLifetime(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 
              peer-checked:after:translate-x-full after:content-[''] 
              after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full 
              after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]">
            </div>
          </label>
          <span className="text-[var(--foreground)]/80">
            Lifetime deal <span className="text-[var(--foreground)]/60">(yours forever)</span>
          </span>
        </div>

        <Link 
          href="/signup"
          className="block w-full py-4 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors text-xl mb-4"
        >
          START 7-DAY FREE TRIAL
        </Link>
        
        <p className="text-sm text-[var(--foreground)]/60">
          No credit card required
        </p>

        <ul className="mt-8 space-y-4 text-left">
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>Unlimited walk tracking and detailed statistics</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>Daily walk reminders and route planning</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>Track walks on any device (iOS, Android, web)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>Build your dog&apos;s walking achievements</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>Complete daily walking quests and earn rewards</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>Join community of 5,000+ happy dogs</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
} 