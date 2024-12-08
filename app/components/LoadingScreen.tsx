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
    <div className="fixed inset-0 bg-[var(--background)]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="animate-bounce">
        <div className="w-16 h-16">
          <Image
            src="/loading.svg"
            alt="Loading"
            width={64}
            height={64}
            className="opacity-80"
          />
        </div>
      </div>
      <div className="mt-4 font-mono text-xl text-[var(--foreground)]/80">
        <span className="inline-block w-12 text-center">{dots}</span>
      </div>
    </div>
  )
} 