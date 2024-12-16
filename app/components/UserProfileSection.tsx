'use client'

import Image from 'next/image'
import { BadgeCounter } from './BadgeCounter'
import { useState } from 'react'
import { BadgesModal } from './BadgesModal'

interface UserProfileSectionProps {
  user: {
    _id: string
    name: string
    email?: string
    imageUrl?: string
    image?: string
    description?: string
    createdAt: string
  }
  isCurrentUser: boolean
  onEditClick: () => void
}

export default function UserProfileSection({
  user,
  isCurrentUser,
  onEditClick
}: UserProfileSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const profileImage = user.imageUrl

  return (
    <>
      <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {profileImage ? (
              <div className="relative w-20 h-20">
                <Image
                  src={profileImage}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-2xl">
                {user.name[0].toUpperCase()}
              </div>
            )}
            <div className="space-y-2 text-[var(--foreground)]/80">
              {isCurrentUser && user.email && (
                <p className="text-[var(--foreground)]/60">{user.email}</p>
              )}
              <p><span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">About</h3>
          <p className="text-[var(--foreground)]/70">
            {user.description || (isCurrentUser ? 
              'Add a description to tell others about yourself and your pets!' : 
              'No description available.')}
          </p>
          {isCurrentUser && !user.description && (
            <button
              onClick={onEditClick}
              className="mt-2 text-sm text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
            >
              Add description
            </button>
          )}
        </div>

        <div className="mt-6 md:hidden">
          <h4 className="text-sm font-medium mb-1 text-[var(--foreground)]/70">Achievement Badges</h4>
          <div 
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <BadgeCounter userId={user._id} />
          </div>
        </div>

        <div className="hidden md:block absolute md:top-6 md:right-6">
          <h4 className="text-sm font-medium mb-1 text-[var(--foreground)]/70">Achievement Badges</h4>
          <div 
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <BadgeCounter userId={user._id} />
          </div>
        </div>
      </section>

      <BadgesModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={user._id}
      />
    </>
  )
} 