'use client'

import Image from 'next/image'
import { User } from '@/app/types/user'
import { useEffect, useState } from 'react'
import { AvatarGroup } from './AvatarGroup'
import { useRouter } from 'next/navigation'
import { BadgeCounter } from './BadgeCounter'

interface UserCardProps {
  user: User
}

type Dog = {
  _id: string
  imageUrl: string
  name: string
}

export default function UserCard({ user }: UserCardProps) {
  const [dogs, setDogs] = useState<Dog[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await fetch(`/api/dogs?userId=${user._id}`)
        if (response.ok) {
          const dogsData = await response.json()
          setDogs(dogsData)
        }
      } catch (error) {
        console.error('Error fetching dogs:', error)
      }
    }

    fetchDogs()
  }, [user._id])

  return (
    <div 
      onClick={(e) => {
        // Get the clicked element
        const target = e.target as HTMLElement
        // Check if the click is on the AvatarGroup
        const isAvatarGroupClick = target.closest('[data-avatar-group]') !== null
        
        if (!isAvatarGroupClick) {
          router.push(`/profile/${user._id}`)
        }
      }}
      className="block group/card cursor-pointer"
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
              <BadgeCounter userId={user._id} />
            </div>
          </div>

          <div className="mt-auto">
            {dogs.length > 0 ? (
              <AvatarGroup
                items={dogs}
                getImageUrl={(dog) => dog.imageUrl}
                getId={(dog) => dog._id}
                getName={(dog) => dog.name}
                getPath={(dog) => `/dogs/${dog._id}`}
                maxDisplay={3}
                expandTo={10}
                className="hover:bg-gray-200 transition-colors"
              />
            ) : (
              <p className="text-sm text-[var(--foreground)]/60">No dogs yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 