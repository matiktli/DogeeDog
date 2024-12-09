'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface UserPillProps {
  userId: string
  className?: string
}

interface BasicUserData {
  id: string
  name: string
  imageUrl?: string
}

export default function UserPill({ userId, className = '' }: UserPillProps) {
  const [user, setUser] = useState<BasicUserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/users/basic/${userId}`)
        if (!response.ok) throw new Error('Failed to fetch user')
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Error fetching user:', error)
        setError('Failed to load user')
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 bg-white/50 dark:bg-black/20 rounded-full py-1 px-3 animate-pulse ${className}`}>
        <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className={`inline-flex items-center gap-2 bg-white/50 dark:bg-black/20 rounded-full py-1 px-3 text-sm text-gray-500 ${className}`}>
        Unknown User
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 bg-white/50 dark:bg-black/20 rounded-full py-1 px-3 ${className}`}>
      {user.imageUrl ? (
        <div className="relative w-5 h-5 rounded-full overflow-hidden">
          <Image
            src={user.imageUrl}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs">
          {user.name[0].toUpperCase()}
        </div>
      )}
      <span className="text-sm font-medium truncate">
        {user.name}
      </span>
    </div>
  )
} 