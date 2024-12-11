'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 bg-[var(--background)]/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
      <div className="animate-bounce">
        <div className="w-12 h-12">
          <Image
            src="/loading.svg"
            alt="Loading"
            width={48}
            height={48}
            className="opacity-80"
          />
        </div>
      </div>
      <div className="mt-2 font-mono text-base text-[var(--foreground)]/80">
        <span className="inline-block w-8 text-center">{dots}</span>
      </div>
    </div>
  )
} 