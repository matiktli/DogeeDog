'use client'

import { IUserAchievementProgress } from '../models/UserAchievementProgress'

interface AchievementProgressCardProps {
  progress: IUserAchievementProgress
}

export function AchievementProgressCard({ progress }: AchievementProgressCardProps) {
  const progressPercentage = Math.min((progress.progress / progress.achievement.target) * 100, 100)
  const isCompleted = progress.progress >= progress.achievement.target
  
  return (
    <div className="relative group">
      <div 
        className={`w-full aspect-square bg-white/40 dark:bg-black/20 rounded-2xl flex items-center 
          justify-center text-4xl backdrop-blur-sm transition-all transform hover:scale-105
          ${!isCompleted ? 'grayscale opacity-50' : ''}`}
      >
        {progress.achievement.rewardIcon}
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-2xl p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-semibold">{progress.achievement.name}</h3>
            {isCompleted && (
              <span className="text-xs text-[var(--accent)] font-medium px-2 py-1 bg-[var(--accent)]/20 rounded-full">
                Completed
              </span>
            )}
          </div>
          <p className="text-white/80 text-sm">{progress.achievement.description}</p>
        </div>
        
        <div className="w-full">
          <div className="flex justify-between text-xs text-white/80 mb-1">
            <span>Progress</span>
            <span>{progress.progress} / {progress.achievement.target}</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isCompleted ? 'bg-[var(--accent)]' : 'bg-white/40'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 