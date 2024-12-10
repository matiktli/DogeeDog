'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface DogPillProps {
  dogId: string
  className?: string
}

interface BasicDogData {
  id: string
  name: string
  imageUrl: string
}

export default function DogPill({ dogId, className = '' }: DogPillProps) {
  const [dog, setDog] = useState<BasicDogData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDog = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/dogs/basic/${dogId}`)
        if (!response.ok) throw new Error('Failed to fetch dog')
        const data = await response.json()
        setDog(data)
      } catch (error) {
        console.error('Error fetching dog:', error)
        setError('Failed to load dog')
      } finally {
        setIsLoading(false)
      }
    }

    if (dogId) {
      fetchDog()
    }
  }, [dogId])

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 bg-white/50 dark:bg-black/20 rounded-full py-1 px-3 animate-pulse ${className}`}>
        <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    )
  }

  if (error || !dog) {
    return (
      <div className={`inline-flex items-center gap-2 bg-white/50 dark:bg-black/20 rounded-full py-1 px-3 text-sm text-gray-500 ${className}`}>
        Unknown Dog
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 bg-white/50 dark:bg-black/20 rounded-full py-1 px-3 ${className}`}>
      <div className="relative w-5 h-5 rounded-full overflow-hidden">
        <Image
          src={dog.imageUrl}
          alt={dog.name}
          fill
          className="object-cover"
        />
      </div>
      <span className="text-sm font-medium truncate">
        {dog.name}
      </span>
    </div>
  )
} 