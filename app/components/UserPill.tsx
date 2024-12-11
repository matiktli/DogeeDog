'use client'

interface UserPillProps {
  userId: string
  className?: string
}

import Pill from './Pill'

export default function UserPill({ userId, className }: UserPillProps) {
  return (
    <Pill
      id={userId}
      fetchPath="/api/users"
      className={className}
    />
  )
} 