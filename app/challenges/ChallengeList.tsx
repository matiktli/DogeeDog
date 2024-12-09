'use client'

import { useState, useRef, useEffect } from 'react'
import { PlusCircle, Trophy, ChevronLeft, ChevronRight } from 'lucide-react'
import ChallengeCard from './ChallengeCard'
import { Challenge } from '@/app/types/challenge'
import GradientButton from '@/app/components/GradientButton'

interface ChallengeListProps {
  challenges: Challenge[]
  title: string
  emptyStateType?: 'user' | 'system'
  showAddButton?: boolean
  onAddClick?: () => void
  onChallengeDelete?: () => void
  singleRow?: boolean
}

export default function ChallengeList({ 
  challenges, 
  emptyStateType = 'system',
  showAddButton = false, 
  onAddClick, 
  onChallengeDelete,
  singleRow = false
}: ChallengeListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setShowLeftArrow(scrollLeft > 1)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5 && scrollWidth > clientWidth)
  }

  useEffect(() => {
    if (singleRow) {
      const container = scrollContainerRef.current
      if (container) {
        container.scrollLeft = -10
        
        setTimeout(() => {
          const { scrollWidth, clientWidth } = container
          setShowRightArrow(scrollWidth > clientWidth)
          setShowLeftArrow(false)
        }, 100)

        container?.addEventListener('scroll', handleScroll)
        return () => container?.removeEventListener('scroll', handleScroll)
      }
    }
  }, [singleRow, challenges])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const isMobile = window.innerWidth < 640 // sm breakpoint in Tailwind
    const cardWidth = isMobile ? 
      scrollContainerRef.current.clientWidth : // Full viewport width on mobile
      300 + 16 // 300px card + 16px gap on desktop
    const scrollAmount = direction === 'left' ? 
      -cardWidth * (isMobile ? 1 : 3) : 
      cardWidth * (isMobile ? 1 : 3)

    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }

  if (challenges.length === 0) {
    if (emptyStateType === 'user') {
      return (
        <div className="text-center py-12 bg-white/40 dark:bg-black/10 rounded-3xl backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-2">No Challenges Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first challenge and start inspiring others!
          </p>
          <GradientButton 
            onClick={onAddClick}
            className="px-6 py-3 font-medium"
          >
            Create Your First Challenge
          </GradientButton>
        </div>
      )
    }

    return (
      <div className="bg-white/40 dark:bg-black/10 rounded-3xl backdrop-blur-sm p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-[var(--background)]">
            <Trophy className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">No Challenges Available</h3>
          <p className="text-[var(--foreground)]/60 max-w-md">
            Check back later for new challenges!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {singleRow && showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center z-10 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      )}
      {singleRow && showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center z-10 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      )}

      <div className={singleRow ? '-mx-4' : ''}>
        <div
          ref={scrollContainerRef}
          className={`
            ${singleRow 
              ? 'flex overflow-x-auto scrollbar-hide gap-4 px-4'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            }
          `}
          onScroll={singleRow ? handleScroll : undefined}
          style={singleRow ? {
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          } : undefined}
        >
          {challenges.map((challenge) => (
            <div 
              key={challenge._id} 
              className={singleRow ? 'flex-shrink-0 w-[calc(100vw-3rem)] scale-90 sm:scale-100 sm:w-[300px] scroll-snap-align-start' : ''}
              style={singleRow ? { scrollSnapAlign: 'start' } : undefined}
            >
              <ChallengeCard
                challenge={challenge}
                editable={showAddButton}
                onDelete={onChallengeDelete}
              />
            </div>
          ))}
          
          {showAddButton && (
            <div 
              className={singleRow ? 'flex-shrink-0 w-[calc(100vw-3rem)] scale-90 sm:scale-100 sm:w-[300px] scroll-snap-align-start' : ''}
              style={singleRow ? { scrollSnapAlign: 'start' } : undefined}
            >
              <button 
                onClick={onAddClick}
                className="group relative bg-white/50 dark:bg-black/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-full"
              >
                <div className="p-6 flex flex-col items-center justify-center h-full min-h-[160px]">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--accent)]/10 mb-3 group-hover:scale-110 transition-transform">
                    <PlusCircle className="w-6 h-6 text-[var(--accent)]" />
                  </div>
                  <p className="text-[var(--foreground)]/60 font-medium group-hover:text-[var(--foreground)] transition-colors">
                    Create New Challenge
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}