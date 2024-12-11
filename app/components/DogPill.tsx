'use client'

interface DogPillProps {
  dogId: string
  className?: string
}

import Pill from './Pill'

export default function DogPill({ dogId, className }: DogPillProps) {
  return (
    <Pill
      id={dogId}
      fetchPath="/api/dogs"
      className={className}
    />
  )
} 