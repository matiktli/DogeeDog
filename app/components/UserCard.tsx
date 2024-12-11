'use client'

import Image from 'next/image'
import Link from 'next/link'
import { User } from '@/app/types/user'
import { useSession } from 'next-auth/react'
import { AvatarGroup } from './AvatarGroup'
import { useEffect, useState } from 'react'

interface UserCardProps {
  user: User
}

type Dog = {
  _id: string
  imageUrl: string
  name: string
}

export default function UserCard({ user }: UserCardProps) {
  const { data: session } = useSession()
  const isCurrentUser = session?.user?.id === user._id
  const [dogs, setDogs] = useState<Dog[]>([])

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
    <Link 
      href={`/profile/${user._id}`}
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
                {isCurrentUser ? 'You' : 'Member'}
              </p>
            </div>
          </div>

          <div className="mt-auto">
            {dogs.length > 0 ? (
              <AvatarGroup
                items={dogs}
                getImageUrl={(dog) => dog.imageUrl}
                getId={(dog) => dog._id}
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
    </Link>
  )
} 