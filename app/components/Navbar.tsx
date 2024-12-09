'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
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
    <nav className="fixed top-0 w-full px-6 py-4 flex justify-between items-center bg-[var(--background)] border-b border-[var(--foreground)]/10">
      <div className="flex items-center gap-2">
        <Image 
          src="/icon.svg" 
          alt="DogeeDog Logo" 
          width={32} 
          height={32}
          className="text-[var(--accent)]"
        />
        <span className="text-xl font-[var(--font-anchor-jack)] text-[var(--accent)]">
          DogeeDog
        </span>
      </div>
      
      <div className="flex gap-4 items-center">
        {session ? (
          <div 
            className="relative"
            ref={dropdownRef}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className="flex items-center gap-2 px-4 py-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              onMouseEnter={handleMouseEnter}
            >
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white">
                {session.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span>Hey, {session.user?.name?.split(' ')[0]}</span>
            </div>

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
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--accent)]/10 transition-colors"
                  >
                    Dashboard
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