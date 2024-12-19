'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

const PUBLIC_PATHS = ['', 'pricing', 'signup', 'signin', 'terms', 'privacy']

interface ExpiredTrialOverlayProps {
  user: any | null
}

export default function ExpiredTrialOverlay({ user: initialUser }: ExpiredTrialOverlayProps) {
  const pathname = usePathname()
  const currentPath = pathname?.split('/')[1] || ''
  const { data: session } = useSession()
  
  // Fetch current user data
  const { data: user } = useQuery({
    queryKey: ['user', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      const response = await fetch(`/api/users/${session.user.id}`)
      if (!response.ok) throw new Error('Failed to fetch user')
      return response.json()
    },
    enabled: !!session?.user?.id,
    initialData: initialUser
  })
  
  // Modified condition to show overlay for both expired trial and ended subscription
  if (
    !user || 
    user.payment.hasAccess || 
    user.isTrial || 
    PUBLIC_PATHS.includes(currentPath)
  ) return null

  // Determine if this is an expired subscription or trial
  const isExpiredSubscription = user.payment?.paidAt && !user.hasAccess

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 z-40">
      {/* Blurred and semi-transparent backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Content wrapper with solid background */}
      <div className="relative h-full flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-4"
        >
          <div className="bg-background rounded-lg shadow-lg border border-border p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">
              {isExpiredSubscription ? 'Subscription Ended' : 'Trial Period Expired'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isExpiredSubscription ? (
                'Your subscription has ended. Renew now to continue accessing all features and keep track of your pet\'s achievements!'
              ) : (
                'Your free trial has ended. Upgrade now to continue accessing all features and keep track of your pet\'s achievements!'
              )}
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              View Pricing Plans
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 