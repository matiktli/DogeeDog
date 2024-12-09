'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Dog, Settings, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface DogCardProps {
  id: string
  name: string
  breed: string
  gender: string
  imageUrl: string
  userId: string
  onDelete?: () => void
}

export default function DogCard({ 
  id, 
  name, 
  breed, 
  gender, 
  imageUrl, 
  userId,
  onDelete 
}: DogCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { data: session } = useSession()

  const isOwner = session?.user?.id === userId

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this pet?')) {
      try {
        setIsDeleting(true)
        const response = await fetch(`/api/dogs/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) throw new Error('Failed to delete')
        
        onDelete?.()
      } catch (error) {
        console.error('Error deleting dog:', error)
      } finally {
        setIsDeleting(false)
        setIsMenuOpen(false)
      }
    }
  }

  return (
    <div className="relative group">
      <Link href={`/dogs/${id}`} className="block">
        <div className="bg-white dark:bg-black/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <div className="relative h-48 w-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <Dog className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{breed}</p>
            <div className="mt-2 flex items-center">
              <span className={`text-sm ${gender === 'male' ? 'text-blue-500' : 'text-pink-500'}`}>
                {gender === 'male' ? '♂️ Male' : '♀️ Female'}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {isOwner && (
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsMenuOpen(!isMenuOpen)
            }}
            className="p-1 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  router.push(`/dogs/${id}/edit`)
                }}
                className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleDelete()
                }}
                disabled={isDeleting}
                className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Removing...' : 'Remove'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 