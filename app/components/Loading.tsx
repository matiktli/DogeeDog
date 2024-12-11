'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type LoadingProps = {
  height?: string
  containerClassName?: string
}

export default function Loading({ height = "h-32", containerClassName }: LoadingProps) {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative ${height} ${containerClassName}`}>
      <div className="absolute inset-0 bg-[var(--background)]/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
        <div className="animate-bounce">
          <div className="w-8 h-8">
            <Image
              src="/loading.svg"
              alt="Loading"
              width={32}
              height={32}
              className="opacity-80"
            />
          </div>
        </div>
        <div className="mt-1 font-mono text-sm text-[var(--foreground)]/80">
          <span className="inline-block w-6 text-center">{dots}</span>
        </div>
      </div>
    </div>
  )
} 