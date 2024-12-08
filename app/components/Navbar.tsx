import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
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
      
      <div className="flex gap-4">
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
      </div>
    </nav>
  )
} 