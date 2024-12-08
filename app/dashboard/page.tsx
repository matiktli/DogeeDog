'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import LoadingScreen from '@/app/components/LoadingScreen'

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    },
  })

  if (status === "loading") {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--background)]">
      <div className="w-full max-w-md bg-white dark:bg-black/20 rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">
          Hello, {session?.user?.name}!
        </h1>
        <p className="text-[var(--foreground)]/60">
          Welcome to your dashboard.
        </p>
      </div>
    </div>
  )
} 