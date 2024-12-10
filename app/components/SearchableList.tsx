'use client'

import { ReactNode, useEffect, useRef } from 'react'
import SearchBar from './SearchBar'

interface SearchField {
  key: string
  label: string
  placeholder: string
}

interface Pagination {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

interface SearchableListProps {
  fields: SearchField[]
  onSearch: (searchParams: Record<string, string>) => void
  children: ReactNode
  className?: string
  pagination: Pagination
  isLoading: boolean
  onLoadMore: () => void
  hasMore: boolean
}

export default function SearchableList({
  fields,
  onSearch,
  children,
  className = '',
  isLoading,
  onLoadMore,
  hasMore
}: SearchableListProps) {
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, isLoading, onLoadMore])

  return (
    <div className={`space-y-6 ${className}`}>
      <SearchBar 
        fields={fields} 
        onSearch={onSearch}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {children}
      </div>
      
      {/* Loading indicator and observer target */}
      <div 
        ref={observerTarget} 
        className="w-full py-8 flex justify-center"
      >
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" />
          </div>
        )}
      </div>
    </div>
  )
} 