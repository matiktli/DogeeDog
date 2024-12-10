'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ScrollableListProps {
  items: any[]
  renderItem: (item: any) => ReactNode
  renderAddButton?: () => ReactNode
  showAddButton?: boolean
  singleRow?: boolean
}

export default function ScrollableList({
  items,
  renderItem,
  renderAddButton,
  showAddButton = false,
  singleRow = false
}: ScrollableListProps) {
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
  }, [singleRow, items])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const isMobile = window.innerWidth < 640
    const cardWidth = isMobile ? 
      scrollContainerRef.current.clientWidth :
      300 + 16
    const scrollAmount = direction === 'left' ? 
      -cardWidth * (isMobile ? 1 : 3) : 
      cardWidth * (isMobile ? 1 : 3)

    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
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
          {items.map((item) => (
            <div 
              key={item._id} 
              className={singleRow ? 'flex-shrink-0 w-[calc(100vw-3rem)] scale-90 sm:scale-100 sm:w-[300px] scroll-snap-align-start' : ''}
              style={singleRow ? { scrollSnapAlign: 'start' } : undefined}
            >
              {renderItem(item)}
            </div>
          ))}
          
          {showAddButton && renderAddButton && (
            <div 
              className={singleRow ? 'flex-shrink-0 w-[calc(100vw-3rem)] scale-90 sm:scale-100 sm:w-[300px] scroll-snap-align-start' : ''}
              style={singleRow ? { scrollSnapAlign: 'start' } : undefined}
            >
              {renderAddButton()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 