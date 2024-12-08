import Image from 'next/image'
import Link from 'next/link'

export default function SignUp() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--background)]">
      <div className="w-full max-w-md bg-white dark:bg-black/20 rounded-2xl p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
            Welcome aboard
          </h1>
          <p className="text-[var(--foreground)]/60">
            Ready to start walking with your dog?
          </p>
        </div>

        {/* Social Sign Up Buttons */}
        <div className="space-y-4">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--foreground)]/20 rounded-lg hover:bg-[var(--foreground)]/5 transition-colors">
            <Image 
              src="/google-icon.svg" 
              alt="Google" 
              width={20} 
              height={20}
            />
            <span>SIGN UP WITH GOOGLE</span>
          </button>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:opacity-90 transition-opacity">
            <Image 
              src="/apple-icon.svg" 
              alt="Apple" 
              width={20} 
              height={20}
            />
            <span>SIGN UP WITH APPLE</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--foreground)]/20"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 text-sm bg-white dark:bg-black/20 text-[var(--foreground)]/60">
              OR
            </span>
          </div>
        </div>

        {/* Email Form */}
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]/80 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="cute@dog.com"
              className="w-full px-4 py-3 rounded-lg border border-[var(--foreground)]/20 bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)]/80 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 rounded-lg border border-[var(--foreground)]/20 bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
          >
            SIGN UP
          </button>
        </form>

        {/* Sign In Link */}
        <p className="mt-6 text-center text-[var(--foreground)]/60">
          Already have an account?{' '}
          <Link href="/signin" className="text-[var(--accent)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
} 