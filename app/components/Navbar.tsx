'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { useUser } from '@/app/hooks/useUser'

export default function Navbar() {
  const { data: session } = useSession()
  const { user } = useUser(session?.user?.id)
  const [showDropdown, setShowDropdown] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleShowDropdown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    setShowDropdown(true)
  }

  const handleHideDropdown = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false)
    }, 150) // Small delay before closing
  }

  // Handle mouse enter
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      handleShowDropdown()
    }, 500)
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    handleHideDropdown()
  }

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="fixed top-0 w-full px-6 py-4 flex justify-between items-center bg-[var(--background)] border-b border-[var(--foreground)]/10 z-50">
      <div className="flex items-center gap-2">
        <Link 
          href={session ? "/dashboard" : "/"} 
          className="flex items-center gap-2"
        >
          <Image 
            src="/icon.svg" 
            alt="DogeeDog Logo" 
            width={32} 
            height={32}
            className="text-[var(--accent)]"
          />
          <span className="text-xl font-[var(--font-anchor-jack)] text-[var(--accent)] [text-shadow:_2px_2px_2px_rgb(0_0_0_/_20%)]">
            DogeeDog
          </span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 mr-4">
          <Link 
            href="/challenges" 
            className="px-4 py-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
          >
            Challenges
          </Link>
        </div>

        {session ? (
          <div 
            className="relative"
            ref={dropdownRef}
            onMouseLeave={handleMouseLeave}
          >
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              onMouseEnter={handleMouseEnter}
            >
              {user?.imageUrl ? (
                <div className="relative w-8 h-8 [box-shadow:_2px_2px_4px_rgb(0_0_0_/_20%)] rounded-full">
                  <Image
                    src={user.imageUrl}
                    alt={user.name || ''}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white [box-shadow:_2px_2px_4px_rgb(0_0_0_/_20%)]">
                  {session.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <span>Hey, {session.user?.name?.split(' ')[0]}</span>
            </Link>

            {/* Safe zone and dropdown */}
            {showDropdown && (
              <>
                {/* Invisible safe zone to prevent unwanted closing */}
                <div 
                  className="absolute w-full h-2 bottom-0 translate-y-full"
                  onMouseEnter={handleShowDropdown}
                />
                <div 
                  className="absolute right-0 mt-2 bg-white dark:bg-black/90 rounded-md shadow-lg py-1 z-50 border border-[var(--foreground)]/10"
                  style={{ width: 'calc(100%)' }}
                  onMouseEnter={handleShowDropdown}
                >
                  <Link 
                    href="/profile"
                    className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--accent)]/10 transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--accent)]/10 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Link 
              href="/signin" 
              className="px-4 py-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
            >
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent)]/90 transition-colors"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
} 