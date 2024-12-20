'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Breadcrumb from '@/app/components/Breadcrumb'
import { AchievementProgressList } from '@/app/components/AchievementProgressList'

export default function MissionsPage() {
  const { } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    },
  })

  return (
    <div className="min-h-screen p-6 pt-12 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-8">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Missions' }
          ]}
        />
        
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Missions</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete challenges and unlock achievements to earn rewards for you and your furry friends!
            </p>
          </div>

          <section className="bg-white/40 dark:bg-black/10 rounded-3xl p-6 backdrop-blur-sm">
            <AchievementProgressList />
          </section>
        </div>
      </div>
    </div>
  )
} 