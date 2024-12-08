'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

type SignInFormData = {
  email: string
  password: string
}

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    mode: "onBlur",
    reValidateMode: "onBlur"
  })

  const onSubmit = (data: SignInFormData) => {
    console.log(data)
    // Handle form submission
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--background)]">
      <div className="w-full max-w-md bg-white dark:bg-black/20 rounded-2xl p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
            Welcome back 👋
          </h1>
          <p className="text-[var(--foreground)]/60">
            Ready to walk with your dog?
          </p>
        </div>

        {/* Social Sign In Button */}
        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--foreground)]/20 rounded-lg hover:bg-[var(--foreground)]/5 transition-colors">
          <Image 
            src="/google-icon.svg" 
            alt="Google" 
            width={20} 
            height={20}
          />
          <span>SIGN IN WITH GOOGLE</span>
        </button>

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
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]/80 mb-2">
              Email
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              id="email"
              placeholder="cute@dog.com"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-[var(--foreground)]/20'
              } bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)]/80">
                Password
              </label>
              <Link href="/forgot-password" className="text-sm text-[var(--accent)] hover:underline">
                Forgotten password?
              </Link>
            </div>
            <input
              {...register('password', {
                required: 'Password is required'
              })}
              type="password"
              id="password"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-[var(--foreground)]/20'
              } bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
          >
            SIGN IN
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-[var(--foreground)]/60">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--accent)] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
} 