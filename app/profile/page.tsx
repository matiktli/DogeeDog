'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function ProfileRedirectPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    },
  })

  if (session?.user?.id) {
    redirect(`/profile/${session.user.id}`)
  }

  return null
} 