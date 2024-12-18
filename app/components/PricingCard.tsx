'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { prices } from '@/app/resources/config/prices'

export default function PricingCard() {
  const { data: session } = useSession()
  const [isLifetime, setIsLifetime] = useState(false)
  
  const selectedPrice = prices.find(p => {
    const result = isLifetime ? p.key === 'ONE_TIME' : p.key === 'MONTHLY'
    return result
  })

  const getButtonText = () => {
    if (!session) {
      return "START 7-DAY FREE TRIAL"
    }
    return isLifetime 
      ? "🌟 UNLOCK LIFETIME ACCESS" 
      : "🚀 UPGRADE YOUR JOURNEY"
  }

  const getButtonLink = () => {
    if (!session) {
      return '/signup'
    }
    return selectedPrice?.link || '/pricing'
  }

  const isPaymentLinkMissing = session && selectedPrice && !selectedPrice.link

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (session && selectedPrice?.link) {
      e.preventDefault()
      const email = encodeURIComponent(session.user?.email || '')
      const paymentUrl = `${selectedPrice.link}${email ? `?prefilled_email=${email}` : ''}`
      
      window.open(
        paymentUrl,
        'StripePayment',
        'width=600,height=800,menubar=no,toolbar=no,location=no'
      )
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <h2 className="text-5xl font-[var(--font-anchor-jack)] text-[var(--accent)] mb-6">
        Transform your daily walks
      </h2>
      
      <div className="bg-white dark:bg-black/20 rounded-2xl p-8 shadow-lg mb-8">
        <div className="flex items-baseline justify-center mb-2">
          <span className="text-5xl font-bold text-[var(--foreground)]">${selectedPrice?.price}</span>
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

        {isPaymentLinkMissing ? (
          <button 
            disabled
            className="block w-full py-4 bg-[var(--accent)]/50 text-white rounded-lg text-xl mb-4 cursor-not-allowed"
          >
            Payment link unavailable
          </button>
        ) : (
          <Link 
            href={getButtonLink()}
            onClick={handleClick}
            className="block w-full py-4 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors text-xl mb-4"
          >
            {getButtonText()}
          </Link>
        )}
        
        {!session && (
          <p className="text-sm text-[var(--foreground)]/60">
            No credit card required
          </p>
        )}

        <ul className="mt-8 space-y-4 text-left">
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>🎯 Daily & weekly challenges to keep you and your pup motivated</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>✨ Create custom challenges for your unique dog journey</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>🏆 Earn badges, treats, and exclusive rewards for completed challenges</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>📊 Addictive activity charts that visualize your progress</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>🌟 Join other dog lovers sharing tips and celebrating wins</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>💪 Level up your dog&apos;s fitness with personalized goals</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>🤝 Connect with nearby dog owners for group challenges</span>
          </li>
        </ul>
      </div>

      {session && (
        <p className="text-sm text-[var(--foreground)]/60 mt-4">
          🔒 Secure payment powered by Stripe
        </p>
      )}
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