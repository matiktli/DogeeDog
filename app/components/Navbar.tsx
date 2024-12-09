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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-4 mr-4">
          <Link 
            href="/dashboard" 
            className="px-4 py-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
          >
            Dashboard
          </Link>
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
            <button 
              className="flex items-center gap-2 px-4 py-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              onClick={handleShowDropdown}
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
            </button>

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

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu Slide-out */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[var(--background)] shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button at the top */}
        <button
          className="absolute top-4 right-4 p-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col h-full px-4">
          {/* User greeting for mobile */}
          {session && (
            <div className="flex items-center gap-3 py-6 mt-4 border-b border-[var(--foreground)]/10">
              {user?.imageUrl ? (
                <div className="relative w-10 h-10 [box-shadow:_2px_2px_4px_rgb(0_0_0_/_20%)] rounded-full">
                  <Image
                    src={user.imageUrl}
                    alt={user.name || ''}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white [box-shadow:_2px_2px_4px_rgb(0_0_0_/_20%)]">
                  {session.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <span className="text-[var(--foreground)]">
                Hi, {session.user?.name?.split(' ')[0]}
              </span>
            </div>
          )}

          <div className="flex-1 mt-4">
            <Link
              href={session ? "/dashboard" : "/"}
              className="block py-3 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/challenges"
              className="block py-3 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Challenges
            </Link>
          </div>

          <div className="border-t border-[var(--foreground)]/10 py-4">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="block py-3 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' })
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left py-3 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="block py-3 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="block py-3 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  )
} 