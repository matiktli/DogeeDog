'use client'

import LoadingScreen from '@/app/components/LoadingScreen'

export default function LoadingPage() {
  return (
    <div className="min-h-screen">
      <LoadingScreen />
      {/* Adding some content behind the loading screen to demonstrate the blur effect */}
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4">Background Content</h1>
        <p className="mb-4">
          This content should be visible but blurred when the loading screen is active.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div 
              key={i}
              className="bg-[var(--accent)]/10 p-6 rounded-lg"
            >
              Card {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 