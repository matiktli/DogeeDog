import Link from 'next/link'

export default function PricingCard() {
  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <h2 className="text-5xl font-[var(--font-anchor-jack)] text-[var(--accent)] mb-6">
        Become the best version of yourself
      </h2>
      
      <div className="bg-white dark:bg-black/20 rounded-2xl p-8 shadow-lg mb-8">
        <div className="flex items-baseline justify-center gap-1 mb-4">
          <span className="text-4xl font-bold">$5</span>
          <span className="text-[var(--foreground)]/60">/month</span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="relative inline-block">
            <input 
              type="checkbox" 
              id="lifetime" 
              className="peer sr-only" 
            />
            <label 
              htmlFor="lifetime"
              className="block w-12 h-6 bg-[var(--foreground)]/20 rounded-full cursor-pointer peer-checked:bg-[var(--accent)] transition-colors"
            >
              <span className="absolute left-1 top-1 block w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
            </label>
          </div>
          <span className="text-[var(--foreground)]/80">
            Lifetime deal (yours forever)
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
            <span>Unlimited habits, simple stats, and Habit Grid</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>Daily reminders</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>Track anywhere (iOS, Android, web)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>Grow your garden</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>Achieve daily quests and loot random rewards</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon />
            <span>Play with 7,000+ users</span>
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