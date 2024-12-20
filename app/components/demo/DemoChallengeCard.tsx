'use client'

import { Cookie } from 'lucide-react'

interface DemoChallengeCardProps {
  challenge: {
    title: string
    description: string
    icon: string
    reward: number
    period: string
  }
  onClick: () => void
}

export default function DemoChallengeCard({ challenge, onClick }: DemoChallengeCardProps) {
  return (
    <div 
      onClick={onClick}
      className="block group/card cursor-pointer"
    >
      <div className="relative bg-[#FF8551]/10 hover:bg-[#FF8551]/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
        <div 
          className="absolute inset-0 bg-[#E49B0F]/30
            origin-left transform scale-x-0 
            transition-transform duration-1000 ease-in-out
            group-hover/card:scale-x-100"
          style={{ transformOrigin: 'left' }}
        />
        
        <div className="relative p-6">
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

          <div>
            <h3 className="text-lg font-semibold mb-2">
              {challenge.title}
            </h3>
            <p className="text-sm text-[var(--foreground)]/60">
              {challenge.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 