import Image from 'next/image'
import { cn } from '../lib/utils'
import { useState } from 'react'

interface AvatarGroupProps<T> {
  items: T[]
  getImageUrl: (item: T) => string
  getId: (item: T) => string | number
  maxDisplay?: number
  expandTo?: number
  className?: string
}

export function AvatarGroup<T>({
  items,
  getImageUrl,
  getId,
  maxDisplay = 3,
  expandTo = 5,
  className
}: AvatarGroupProps<T>) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const displayCount = isExpanded ? Math.min(items.length, expandTo) : maxDisplay
  const displayItems = items.slice(0, displayCount)
  const remainingCount = items.length - displayCount

  // Width calculation
  const baseWidth = 24 // w-6 = 24px
  const overlap = 8   // -space-x-2 = -8px
  const padding = 12  // px-1.5 = 6px * 2
  const counterSpace = 24 // Approximate space for counter
  
  const width = displayItems.length * baseWidth - 
                (displayItems.length - 1) * overlap + 
                padding +
                (remainingCount > 0 ? counterSpace : 0)

  return (
    <div 
      className={cn(
        "inline-flex items-center bg-gray-100 rounded-full py-1 px-1.5",
        "transition-all duration-500 ease-in-out",
        "hover:delay-100",
        className
      )}
      style={{ width: `${width}px` }}
      onClick={(e) => {
        e.preventDefault()
        setIsExpanded(!isExpanded)
      }}
      onMouseEnter={() => {
        const timer = setTimeout(() => {
          setIsExpanded(true)
        }, 100)
        return () => clearTimeout(timer)
      }}
      onMouseLeave={() => {
        setIsExpanded(false)
      }}
    >
      <div className={cn(
        "flex -space-x-2",
        "transition-all duration-500 ease-in-out"
      )}>
        {displayItems.map((item, index) => (
          <div
            key={getId(item)}
            className={cn(
              "relative w-6 h-6 rounded-full border-2 border-white overflow-hidden flex-shrink-0",
              "transform transition-all duration-500",
              isExpanded ? [
                "hover:scale-110",
                "animate-in fade-in slide-in-from-left",
                index > 0 && `delay-[${index * 100}ms]`
              ] : [
                "animate-in fade-in slide-in-from-right",
                index > 0 && `delay-[${(displayItems.length - index - 1) * 50}ms]`
              ]
            )}
            style={{
              zIndex: isExpanded ? index : displayItems.length - index,
            }}
          >
            <Image
              src={getImageUrl(item)}
              alt=""
              fill
              className={cn(
                "object-cover",
                "transition-transform duration-300",
                isExpanded && "hover:scale-110"
              )}
            />
          </div>
        ))}
      </div>
      
      {remainingCount > 0 && (
        <span className={cn(
          "ml-2 text-xs text-gray-600 font-medium",
          "transition-opacity duration-300",
          isExpanded ? "opacity-100 delay-300" : "opacity-100"
        )}>
          +{remainingCount}
        </span>
      )}
    </div>
  )
} 