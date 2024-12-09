'use client'

import { useState, useRef, useEffect } from 'react'
import { Settings, Edit, Trash2, Cookie } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Challenge } from '@/app/types/challenge'
import { useRouter } from 'next/navigation'
import ChallengeViewModal from './ChallengeViewModal'
import UserPill from '@/app/components/UserPill'

interface ChallengeCardProps {
  challenge: Challenge
  editable?: boolean
  onDelete?: () => void
}

export default function ChallengeCard({ 
  challenge, 
  editable = false,
  onDelete 
}: ChallengeCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { data: session } = useSession()
  const [showViewModal, setShowViewModal] = useState(false)

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
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        setIsDeleting(true)
        const response = await fetch(`/api/challenges/${challenge._id}`, {
          method: 'DELETE',
        })

        if (!response.ok) throw new Error('Failed to delete')
        
        onDelete?.()
      } catch (error) {
        console.error('Error deleting challenge:', error)
      } finally {
        setIsDeleting(false)
        setIsMenuOpen(false)
      }
    }
  }

  return (
    <div className="relative">
      <Link 
        href="#"
        onClick={(e) => {
          e.preventDefault()
          setShowViewModal(true)
        }}
        className="block group/card h-[200px]"
      >
        <div className="relative bg-[#FF8551]/10 hover:bg-[#FF8551]/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-full">
          <div 
            className="absolute inset-0 bg-[#E49B0F]/30
              origin-left transform scale-x-0 
              transition-transform duration-1000 ease-in-out
              group-hover/card:scale-x-100"
            style={{ transformOrigin: 'left' }}
          />
          
          <div className="relative p-6 flex flex-col h-full">
            <div className="flex gap-4 h-full">
              {/* Left Column: Icon and Content */}
              <div className="flex-grow flex flex-col">
                {/* Icon */}
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/80 dark:bg-black/20 mb-4">
                  <span className="text-2xl">{challenge.icon}</span>
                </div>

                {/* Title and Description */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold mb-2 truncate">{challenge.title}</h3>
                  <p className="text-sm text-[var(--foreground)]/60 line-clamp-2">
                    {challenge.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Badges */}
              <div className="flex flex-col items-end justify-between">
                {/* Top Badges */}
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    challenge.period === 'DAY' 
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-purple-500/10 text-purple-500'
                  }`}>
                    {challenge.period === 'DAY' ? 'Daily' : 'Weekly'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Cookie className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-sm font-medium text-[var(--accent)]">
                      {challenge.reward} treats
                    </span>
                  </div>
                </div>

                {/* Bottom: User Pill */}
                {challenge.type === 'USER' && challenge.createdBy !== session?.user?.id && (
                  <div className="flex items-center gap-2 text-sm text-[var(--foreground)]/60">
                    <span>By:</span>
                    <UserPill userId={challenge.createdBy} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>

      {editable && (
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsMenuOpen(!isMenuOpen)
            }}
            className="p-1.5 rounded-lg bg-white/80 dark:bg-black/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity"
          >
            <Settings className="w-5 h-5 text-[var(--foreground)]" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 z-10">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  router.push(`/challenges/${challenge._id}/edit`)
                }}
                className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-[var(--accent)]/5"
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
                className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      )}

      <ChallengeViewModal
        challenge={challenge}
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
      />
    </div>
  )
} 