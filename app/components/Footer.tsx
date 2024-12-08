import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full px-6 py-20 border-t border-[var(--foreground)]/10">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Product */}
          <div>
            <h3 className="font-bold mb-4 text-[var(--foreground)]">PRODUCT</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/pricing" className="text-[var(--foreground)]/80 hover:text-[var(--accent)] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/updates" className="text-[var(--foreground)]/80 hover:text-[var(--accent)] transition-colors">
                  Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold mb-4 text-[var(--foreground)]">RESOURCES</h3>
            <ul className="space-y-3">
              {/* Add resources here when needed */}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold mb-4 text-[var(--foreground)]">SOCIAL</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://twitter.com" className="text-[var(--foreground)]/80 hover:text-[var(--accent)] transition-colors">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="https://facebook.com" className="text-[var(--foreground)]/80 hover:text-[var(--accent)] transition-colors">
                  Facebook
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-4 text-[var(--foreground)]">LEGAL</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-[var(--foreground)]/80 hover:text-[var(--accent)] transition-colors">
                  Terms of use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[var(--foreground)]/80 hover:text-[var(--accent)] transition-colors">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center pt-8 border-t border-[var(--foreground)]/10">
          <div className="text-[var(--foreground)]/60 mb-4">1% better every day</div>
          <div className="flex items-center justify-center gap-2 text-[var(--foreground)]/80">
            <span>Built with ❤️ by</span>
            <Link 
              href="https://github.com/matiktli" 
              className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/matikitli-icon.jpeg"
                alt="matiktli"
                width={24}
                height={24}
                className="rounded-full"
              />
              matiktli
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 