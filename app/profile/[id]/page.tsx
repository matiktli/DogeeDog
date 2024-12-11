'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import { use } from 'react'
import Image from 'next/image'
import { Settings } from 'lucide-react'
import LoadingScreen from '@/app/components/LoadingScreen'
import UserFormModal from '@/app/components/UserFormModal'
import Breadcrumb from '@/app/components/Breadcrumb'

interface UserData {
  _id: string
  name: string
  email?: string
  createdAt: string
  imageUrl?: string
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    },
  })

  const isCurrentUser = session?.user?.id === resolvedParams.id

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${resolvedParams.id}`)
        if (!response.ok) throw new Error('Failed to fetch user')
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (resolvedParams.id) {
      fetchUser()
    }
  }, [resolvedParams.id])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!user) return null

  return (
    <div className="min-h-screen p-6 pt-12 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-8">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Community', href: '/community' },
            { label: isCurrentUser ? 'My Profile' : user.name }
          ]}
        />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-end mb-6">
            {isCurrentUser && (
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>

          {/* User Profile Section */}
          <div className="bg-white dark:bg-black/20 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                {user.imageUrl ? (
                  <div className="relative w-20 h-20">
                    <Image
                      src={user.imageUrl}
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
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  {isCurrentUser && user.email && (
                    <p className="text-[var(--foreground)]/60">{user.email}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 text-[var(--foreground)]/80">
                <p><span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Pet Statistics Section */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Pet Statistics</h2>
            <div className="bg-white dark:bg-black/20 rounded-2xl p-6 shadow-lg">
              <p className="text-[var(--foreground)]/60">
                Pet statistics coming soon...
              </p>
            </div>
          </section>
        </div>
      </div>

      {showEditModal && isCurrentUser && (
        <UserFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          initialData={{
            id: user._id,
            name: user.name,
            email: user.email || '',
            imageUrl: user.imageUrl
          }}
          onUpdate={async () => {
            // Refresh user data
            const response = await fetch(`/api/users/${resolvedParams.id}`)
            if (!response.ok) throw new Error('Failed to fetch user')
            const data = await response.json()
            setUser(data)
          }}
        />
      )}
    </div>
  )
} 