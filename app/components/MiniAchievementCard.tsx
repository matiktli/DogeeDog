import { IUserAchievementProgress } from '../models/UserAchievementProgress'

interface MiniAchievementCardProps {
  progress: IUserAchievementProgress
}

export function MiniAchievementCard({ progress }: MiniAchievementCardProps) {
  const isCompleted = progress.progress >= progress.achievement.target
  
  // Handle different possible icon formats
  const getIcons = () => {
    const icon = progress.achievement.rewardIcon
    if (!icon) return []
    
    // If it's already an array
    if (Array.isArray(icon)) return icon
    
    // If it's a string containing multiple emojis, split them
    if (typeof icon === 'string' && icon.length > 2) {
      return icon.match(/\p{Emoji}/gu) || [icon]
    }
    
    // Single icon case
    return [icon]
  }
  
  const icons = getIcons()
  
  return (
    <div className="relative group">
      <div className={`
        w-20 h-20  /* Fixed size for all cards */
        bg-white/40 dark:bg-black/20 rounded-lg 
        backdrop-blur-sm transition-all transform hover:scale-105
        ${!isCompleted ? 'grayscale opacity-50' : ''}
      `}>
        <div className={`
          w-full h-full
          ${icons.length === 1 ? 'flex justify-center items-center' : 
            icons.length === 2 ? 'grid grid-cols-2' :
            'grid grid-cols-2 grid-rows-2'}
          text-2xl
        `}>
          {icons.map((icon, index) => (
            <div
              key={index}
              className={`
                flex items-center justify-center
                ${icons.length === 3 && index === 0 ? 'col-span-2' : ''}
                ${icons.length === 1 ? 'text-3xl' : 'text-2xl'}
              `}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
      
      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 
        opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div className="bg-black/90 rounded-lg p-3 text-sm shadow-lg">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-white text-xs font-semibold">{progress.achievement.name}</h3>
            {isCompleted && (
              <span className="text-[0.65rem] text-[var(--accent)] font-medium px-1.5 
                py-0.5 bg-[var(--accent)]/20 rounded-full">
                ✓
              </span>
            )}
          </div>
          <p className="text-white/80 text-xs mb-2">{progress.achievement.description}</p>
          <div className="text-[0.65rem] text-white/80">
            {progress.progress} / {progress.achievement.target}
          </div>
        </div>
      </div>
    </div>
  )
} 