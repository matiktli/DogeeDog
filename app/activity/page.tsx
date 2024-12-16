'use client'

import { useSession } from 'next-auth/react'
import ActivityLog from '@/app/components/ActivityLog'
import ActivityHeatMap from '../components/ActivityHeatMap'

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
      <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold mb-6">Activity</h1>
                </div>
                <div className="w-full">
                  <ActivityHeatMap />
                </div>
              </section>
              <section className="mt-8 bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-6">Recent Activity</h1>
        <ActivityLog />
        </section>
      </div>
    </div>
  )
} 