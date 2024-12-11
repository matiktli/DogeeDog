'use client'

import { useSession } from 'next-auth/react'
import ActivityLog from '@/app/components/ActivityLog'

export default function ActivityPage() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="min-h-screen pt-16 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <p className="text-center text-gray-500">
            Please sign in to view activity
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 px-4">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Recent Activity</h1>
        <ActivityLog />
      </div>
    </div>
  )
} 