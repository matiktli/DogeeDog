'use client'

import Image from 'next/image'
import Link from 'next/link'
import { User } from '@/app/types/user'

interface UserCardProps {
  user: User
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link 
      href={`/users/${user._id}`}
      className="block group/card"
    >
      <div className="relative bg-[#FF8551]/10 hover:bg-[#FF8551]/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-[200px]">
        <div 
          className="absolute inset-0 bg-[#E49B0F]/30
            origin-left transform scale-x-0 
            transition-transform duration-1000 ease-in-out
            group-hover/card:scale-x-100"
          style={{ transformOrigin: 'left' }}
        />
        
        <div className="relative p-6 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            {user.imageUrl ? (
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={user.imageUrl}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center text-2xl text-white">
                {user.name[0].toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold truncate">
                {user.name}
              </h3>
              <p className="text-sm text-[var(--foreground)]/60">
                Member
              </p>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2 text-sm text-[var(--foreground)]/60">
              <span>View Profile</span>
              <svg
                className="w-4 h-4 transform transition-transform group-hover/card:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 