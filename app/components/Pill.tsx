'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '../lib/utils'

interface PillData {
  id: string
  name: string
  imageUrl?: string
  type?: string
}

interface PillProps {
  id: string
  fetchPath: string
  className?: string
}

export default function Pill({ id, fetchPath, className = '' }: PillProps) {
  const router = useRouter()
  const [data, setData] = useState<PillData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${fetchPath}/${id}`)
        if (!response.ok) throw new Error('Failed to fetch data')
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id, fetchPath])

  const getPath = () => {
    if (!data) return '/'
    
    if (fetchPath.includes('/dogs')) {
      return `/dogs/${id}`
    }
    if (fetchPath.includes('/users')) {
      return `/profile/${id}`
    }
    return '/'
  }

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 bg-white/50 dark:bg-black/20 rounded-full py-1 px-3 animate-pulse ${className}`}>
        <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className={`inline-flex items-center gap-2 bg-white/50 dark:bg-black/20 rounded-full py-1 px-3 text-sm text-gray-500 ${className}`}>
        Unknown Item
      </div>
    )
  }

  return (
    <div 
      data-pill 
      onClick={() => router.push(getPath())}
      className={cn(
        "inline-flex items-center gap-2 bg-white/50 dark:bg-black/20 rounded-full py-1 px-3",
        "cursor-pointer transform transition-all duration-300",
        "hover:scale-105 hover:shadow-md",
        className
      )}
    >
      {data.imageUrl ? (
        <div className="relative w-5 h-5 rounded-full overflow-hidden group">
          <Image
            src={data.imageUrl}
            alt={data.name}
            fill
            className={cn(
              "object-cover",
              "transition-transform duration-300",
              "group-hover:scale-110"
            )}
          />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs">
          {data.name[0].toUpperCase()}
        </div>
      )}
      <span className="text-sm font-medium truncate">
        {data.name}
      </span>
    </div>
  )
} 